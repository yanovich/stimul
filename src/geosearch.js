import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useState } from "react";
import "./main.css";

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
  function resizeMap() {
    const height = document.getElementById("container").clientHeight;
    const width = document.getElementById("container").clientWidth;

    document.getElementById("map").style.height = height + "px";
    document.getElementById("map").style.width = width + "px";
  }

  const cluster = L.markerClusterGroup();

  function showSite(name) {
    props.update("site", { name });
  }

  function newSite(e) {
    e.preventDefault();

    let values = {};

    e.target.childNodes.forEach(el => {
      values[el.id] = el.value;
    });

    const site = {
      name: values["new-site-name"],
      latlng: [
        parseFloat(values["new-site-lat"]),
        parseFloat(values["new-site-lng"])
      ]
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
      props.update("main");
    });
  }
  window.newSite = newSite;

  const addMarker = data => {
    const marker = L.marker(data.latlng).bindPopup(
      `
        <form class="new-site-popup" onsubmit="return newSite(event)  ">
          <input id="new-site-name" placeholder="Название" />
          <input id="new-site-adress" value="${data.address}" />
          <input id="new-site-lat" value="${data.latlng[0]}">
          <input id="new-site-lng" value="${data.latlng[1]}">
          <button id="create-new-site">Добавить</button>
        </form>
      `
    );

    window.showSite = showSite;
    cluster.addLayer(marker);
    return marker;
  };

  useEffect(() => {
    if (map === undefined) return;
    window.addEventListener("resize", resizeMap);
    L.Icon.Default.imagePath = "/images/";

    L.tileLayer(tileUrl, {
      attribution: mapAttribution,
      maxZoom: 18,
      id: "osm"
    }).addTo(map);

    let popup = L.popup();

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
    }

    // map.on("click", onMapClick);

    props.markers.forEach(addMarker);
    map.addLayer(cluster);

    return () => {
      map.removeLayer(cluster);
      cluster.clearLayers();
      // map.off("click", onMapClick);
      window.removeEventListener("resize", resizeMap);
      //   map.remove();
    };
  });

  return (
    <div id="container">
      <div id="map" ref={createMap} />
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

  query: ``
};

export default MainScreen;
