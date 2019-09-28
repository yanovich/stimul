import "./main.css";

import React, { useLayoutEffect, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import LC from "leaflet.markercluster"; // eslint-disable-line
import osme from "osme";

const tileUrl =
  navigator.userAgent.search("HeadlessChrome") !== -1
    ? "/images/white-square.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const mapAttribution = `&copy;
 <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
 <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>`;

function Map(props) {
  const { values } = props;

  function resizeMap() {
    const height = document.getElementById("container").clientHeight;
    const width = document.getElementById("container").clientWidth;
    document.getElementById("map").style.height = height + "px";
    document.getElementById("map").style.width = width + "px";
  }

  let map;
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
      "<a onclick=\"L.showSite('" + escapeHtml(data.name) + "')\">" + data.name + "</a>"
    );
    L.showSite = showSite;
    cluster.addLayer(marker);
    return marker;
  }

  useLayoutEffect(() => {
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
    const avgValue = values.find(v => v.osmId === "60189")
    let avg = ( avgValue || { value: (min + max) / 2 }).value;
    if (avg > max || avg < min) {
      avg = avg / values.length;
    }
    console.log(min, avg, max);

    resizeMap();
    window.addEventListener("resize", resizeMap);
    L.Icon.Default.imagePath = "/images/";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    map = L.map("map").setView([68.192424, 105.306383], 3);
    L.tileLayer(tileUrl, {
      attribution: mapAttribution,
      maxZoom: 18,
      id: "osm"
    }).addTo(map);

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
      // console.log(e)
    };

    var borderLayer = L.geoJSON(null, {
      style: function(feature) {
        return {
          color: "#F50",
          fillColor: "#FD6",
          opacity: 1,
          fillOpacity: 0.6,
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
        if (value && value.region) {
          console.log(value.region.statName, value.value, c);
        }

        return {
          color: colors[c],
          fillColor: colors[c]
        };
      });

      // regLeaf.addEvent("click", e => console.log(e));
    });

    return () => {
      window.removeEventListener("resize", resizeMap);
      map.remove();
    };
  }, []);

  useEffect(() => {
    props.markers.forEach(addMarker);
    map.addLayer(cluster);

    return () => {
      cluster.clearLayers();
      map.removeLayer(cluster);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, props.markers]);

  return (
    <div id="container">
      <div id="map" />
    </div>
  );
}

const MainScreen = {
  render: props => {
    return (
      <main className="map">
        <Map
          markers={props.response.sites}
          gql={props.gql}
          update={props.update}
          values={props.response.values}
        />
      </main>
    );
  },

  query: `
  {
    values(indicatorId: "0", year: 2018){
      indicatorId
      osmId
      region {
        statName
        level
      }
      year
      value
    }
    sites{
      name
      latlng
    }
  }  
  `
};

export default MainScreen;
