import { Slider } from "antd";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import osme from "osme";
import React, { useCallback, useEffect, useState } from "react";
import Curved from "./Curved";
import "./main.css";
import RadioIndicator from "./RadioIndicator";
import CurvedRate from "./CurvedRate";

const query = `
query($at: Int, $indicatorId: String!) {
  values(indicatorId: $indicatorId, year: [$at]){
    indicatorId
    indicator {
      isPositive
    }
    osmId
    region {
      statName
      level
    }
    year
    value
  }
  sites(at: $at) {
    name
    latlng
    year
    address
  }
}  
  `;
const queryIndicators = `
{
  indicators {
    id
    name
  }
}
`;

const tileUrl =
  navigator.userAgent.search("HeadlessChrome") !== -1
    ? "/images/white-square.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const mapAttribution = `&copy;
 <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
 <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>`;

function Map(props) {
  let [map, setMap] = useState();

  const createMap = useCallback(node => {
    if (node === null) {
      return;
    }

    resizeMap();

    const newMap = L.map(node).setView([68.192424, 105.306383], 3);
    setMap(newMap);
  }, []);
  const { values } = props;

  function resizeMap() {
    const height = document.getElementById("container").clientHeight;
    const width = document.getElementById("container").clientWidth;
    document.getElementById("map").style.height = height + "px";
    document.getElementById("map").style.width = width + "px";
  }

  const cluster = L.markerClusterGroup();

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showSite(name) {
    props.update("site", { name });
  }

  function addMarker(data) {
    const marker = L.marker(data.latlng).bindPopup(
      "<a onclick=\"L.showSite('" +
        escapeHtml(data.name) +
        "')\">" +
        data.name +
        "</a>"
    );
    L.showSite = showSite;
    cluster.addLayer(marker);
    return marker;
  }

  useEffect(() => {
    if (map === undefined) return;
    window.addEventListener("resize", resizeMap);
    L.Icon.Default.imagePath = "/images/";
    L.tileLayer(tileUrl, {
      attribution: mapAttribution,
      maxZoom: 18,
      id: "osm"
    }).addTo(map);

    props.markers.forEach(addMarker);
    map.addLayer(cluster);

    const { min, max } = values.reduce(
      (acc, current) => {
        if (!current || !current.region || current.region.level !== 4) {
          return acc;
        }
        return {
          min: Math.min(acc.min, current.value),
          max: Math.max(acc.max, current.value)
        };
      },
      { min: Infinity, max: -Infinity }
    );
    const avgValue = values.find(v => v.osmId === "60189");
    let avg = (avgValue || { value: (min + max) / 2 }).value;
    if (avg > max || avg < min) {
      avg = avg / values.length;
    }

    // L.tileLayer(
    //   "http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU",
    //   {
    //     subdomains: ["01", "02", "03", "04"],
    //     attribution: '<a http="yandex.ru" target="_blank">Яндекс</a>',
    //     reuseTiles: true,
    //     updateWhenIdle: false
    //   }
    // ).addTo(map);

    let popup = L.popup();

    function newSite(e) {
      e.preventDefault();
      const site = {
        name: document.getElementById("new-site-name").value,
        latlng: [popup.getLatLng().lat, popup.getLatLng().lng]
      };
      const query = `
        mutation ($site: SiteInput!) {
          newSite (site: $site) {
            name
            latlng
          }
        }
      `;
      props.gql(query, { site }, response => {
        addMarker(response.data.newSite).openPopup();
      });
    }

    const onRegionClick = feature => event => {
      const { osmId } = feature.properties;
      popup
        .setLatLng(event.latlng)
        .setContent(
          `
            <form class="new-site-popup">
              <input id="new-site-name" />
                Кординаты: ${event.latlng.lat.toPrecision(
                  8
                )}, ${event.latlng.lng.toPrecision(8)},
                osmId: ${osmId}
              <br />
              <button id="create-new-site">Создать</button>
            </form>
          `
        )
        .openOn(map);
      document
        .getElementsByClassName("new-site-popup")[0]
        .addEventListener("submit", newSite);
    };

    const onRegionMouseOver = feature => event => {
      event.target.setStyle({ fillOpacity: 0.9 });
      if (feature && feature.properties)
        props.setActiveRegion(feature.properties.osmId);
    };

    var borderLayer = L.geoJSON(null, {
      style: function(feature) {
        return {
          color: "#F50",
          fillColor: "#FD6",
          opacity: 1,
          fillOpacity: 0.5,
          weight: 2
        };
      },
      filter: function(feature, layer) {
        // 3 - federal
        return feature.properties.level === 4;
      },
      onEachFeature: function(feature, layer) {
        layer.on({
          mouseover: onRegionMouseOver(feature),
          // mouseout: resetHighlight,
          click: e => onRegionClick(e, feature)
        });
      }
    }).addTo(map);

    osme.geoJSON("RU", { lang: "ru", quality: 2 }).then(regions => {
      var regLeaf = osme.toLeaflet(regions);

      let collection = regLeaf.geoJSON;

      borderLayer.addData(collection);

      borderLayer.setStyle(function(feature) {
        const osmId = feature.properties.osmId;
        const value = values.find(v => v.osmId === osmId);
        const colors = [
          "#d73027",
          "#fc8d59",
          "#fee08b",
          "#ffffbf",
          "#d9ef8b",
          "#91cf60",
          "#1a9850"
        ];

        let c;

        if (value && value.value > avg) {
          let y = (max - avg) / 3.4;
          c = Math.round((value.value - avg) / y) + 3;
        } else if (value) {
          let z = (avg - min) / 3.4;
          c = Math.round((value.value - avg) / z) + 3;
        } else {
          console.error(feature.properties.osmId);
        }
        if (value && value.indicator && !value.indicator.isPositive) {
          c = 6 - c;
        }

        return {
          color: colors[c],
          fillColor: colors[c]
        };
      });

      // regLeaf.addEvent("click", e => console.log(e));
    });

    return () => {
      map.removeLayer(cluster);
      map.removeLayer(borderLayer);
      cluster.clearLayers();
    };
  });

  return (
    <div id="container">
      <div id="map" ref={createMap} />
    </div>
  );
}

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

function Main(props) {
  const { gql } = props;
  const [year, setYear] = useState(2018);
  const [response, setResponse] = useState({});
  const [activeRegion, setActiveRegion] = useState("102269");
  const [indicators, setIndicators] = useState([]);
  const [indicatorId, setIndicatorId] = useState("1");
  const [dataType, setDataType] = useState("relative");

  useEffect(() => {
    gql(query, { at: year, indicatorId }, response => {
      setResponse(response.data);
    });
  }, [gql, year, indicatorId]);

  useEffect(() => {
    gql(queryIndicators, {}, response => {
      setIndicators(response.data.indicators);
    });
  }, [gql]);

  console.log(dataType);

  return (
    <main className="map">
      <div id="statistics" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>
          <RadioIndicator
            indicators={indicators}
            onChange={setIndicatorId}
            value={indicatorId}
            dataType={dataType}
            onChangeDataType={setDataType}
          />
        </div>
        {dataType === "absolute" ? (
          // @TODO fix it
          <Curved
            gql={gql}
            osmId={activeRegion}
            indicatorId={indicatorId}
            dataType={dataType}
          />
        ) : (
          <CurvedRate
            gql={gql}
            osmId={activeRegion}
            indicatorId={indicatorId}
            dataType={dataType}
          />
        )}
      </div>

      <div id="map-container">
        <Slider
          min={2009}
          max={2019}
          marks={range(2009, 2019).reduce(
            (acc, cur) => ({ ...acc, [cur]: cur }),
            {}
          )}
          value={year}
          onChange={value => {
            // props.update("main", { at: value });
            setYear(value);
          }}
        />
        {response.sites && response.values && (
          <Map
            markers={response.sites}
            gql={props.gql}
            update={props.update}
            values={response.values}
            setActiveRegion={setActiveRegion}
          />
        )}
      </div>
    </main>
  );
}

const MainScreen = {
  render: props => {
    return <Main {...props} />;
  }
};

export default MainScreen;
