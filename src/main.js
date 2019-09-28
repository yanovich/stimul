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

  function showSite(name) {
    props.update("site", { name });
  }

  function addMarker(data) {
    const marker = L.marker(data.latlng).bindPopup(
      "<a onclick=\"L.showSite('" + data.name + "')\">" + data.name + "</a>"
    );
    L.showSite = showSite;
    cluster.addLayer(marker);
    return marker;
  }

  useLayoutEffect(() => {
    const { min, max } = values.reduce(
      (acc, current) => {
        return {
          min: Math.min(acc.min, current.value),
          max: Math.max(acc.max, current.value)
        };
      },
      { min: Infinity, max: -Infinity }
    );
    const avg = values.find(v => v.osmId === "60189").value;

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

    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent(
          '<form class="new-site-popup"">\n' +
            '<input id="new-site-name" />\nКординаты: ' +
            e.latlng.lat.toPrecision(8) +
            ", " +
            e.latlng.lng.toPrecision(8) +
            '<br />\n<button id="create-new-site">Создать</button>\n' +
            "</form>"
        )
        .openOn(map);
      document
        .getElementsByClassName("new-site-popup")[0]
        .addEventListener("submit", newSite);
    }

    map.on("click", onMapClick);

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
      }
    }).addTo(map);

    osme.geoJSON("RU", { lang: "ru" }).then(regions => {
      var regLeaf = osme.toLeaflet(regions);
      borderLayer.addData(regLeaf.geoJSON);
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

        if (value.value > avg) {
          let y = (max - avg) / 3.5;
          c = Math.round((value.value - avg) / y) + 3;
        } else {
          let z = (avg - min) / 3.5;
          c = Math.round((value.value - avg) / z) + 3;
        }

        return {
          fillColor: colors[c]
        };
      });
    });

    return () => {
      map.off("click", onMapClick);
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
    values(indicatorId: "55376", year: 2018){
      indicatorId
      osmId
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
