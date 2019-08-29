import './main.css'

import React, { useLayoutEffect, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import L from 'leaflet'
import LC from 'leaflet.markercluster' // eslint-disable-line

const tileUrl =
  navigator.userAgent.search('HeadlessChrome') !== -1
    ? '/images/white-square.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const mapAttribution = `&copy;
 <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
 <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>`

function Map (props) {
  function resizeMap () {
    const height = document.getElementById('container').clientHeight
    const width = document.getElementById('container').clientWidth
    document.getElementById('map').style.height = height + 'px'
    document.getElementById('map').style.width = width + 'px'
  }

  let map
  const cluster = L.markerClusterGroup()

  function addMarker (data) {
    const marker = L.marker(data.latlng).bindPopup(data.name)
    cluster.addLayer(marker)
    return marker
  }

  useLayoutEffect(() => {
    resizeMap()
    window.addEventListener('resize', resizeMap)
    L.Icon.Default.imagePath = '/images/'
    // eslint-disable-next-line react-hooks/exhaustive-deps
    map = L.map('map').setView([55.761234, 37.563179], 9)
    L.tileLayer(tileUrl, {
      attribution: mapAttribution,
      maxZoom: 18,
      id: 'osm'
    }).addTo(map)

    let popup = L.popup()

    function newSite (e) {
      e.preventDefault()
      const site = {
        name: document.getElementById('new-site-name').value,
        latlng: [popup.getLatLng().lat, popup.getLatLng().lng]
      }
      fetch('/graphql', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation ($site: SiteInput!) {
              newSite (site: $site) {
                name
                latlng
              }
            }
          `,
          variables: {
            site
          }
        })
      })
        .then(response => {
          return response.json()
        })
        .then(response => {
          addMarker(response.data.newSite).openPopup()
        })
    }

    function onMapClick (e) {
      popup
        .setLatLng(e.latlng)
        .setContent(
          '<form class="new-site-popup"">\n' +
            '<input id="new-site-name" />\nКординаты: ' +
            e.latlng.lat.toPrecision(8) +
            ', ' +
            e.latlng.lng.toPrecision(8) +
            '<br />\n<button id="create-new-site">Создать</button>\n' +
            '</form>'
        )
        .openOn(map)
      document
        .getElementsByClassName('new-site-popup')[0]
        .addEventListener('submit', newSite)
    }

    map.on('click', onMapClick)

    return () => {
      map.off('click', onMapClick)
      window.removeEventListener('resize', resizeMap)
      map.remove()
    }
  }, [])

  useEffect(() => {
    props.markers.forEach(addMarker)
    map.addLayer(cluster)

    return () => {
      cluster.clearLayers()
      map.removeLayer(cluster)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, props.markers])

  return (
    <div id='container'>
      <div id='map' />
    </div>
  )
}

const MainScreen = {
  render: props => {
    return (
      <div className='stimul-main'>
        <header>Стимул</header>
        <main>
          <Map markers={props.response.sites} />
        </main>
      </div>
    )
  },

  query: `
  {
    sites {
      name
      latlng
    }
  }`
}

export default MainScreen
