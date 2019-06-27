import './main.css'

import React, { useEffect } from 'react'
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

  useEffect(() => {
    resizeMap()
    window.addEventListener('resize', resizeMap)
    L.Icon.Default.imagePath = '/images/'
    const map = L.map('map').setView([55.761234, 37.563179], 16)
    L.tileLayer(tileUrl, {
      attribution: mapAttribution,
      maxZoom: 18,
      id: 'osm'
    }).addTo(map)

    const cluster = L.markerClusterGroup()

    props.markers.forEach(marker => {
      cluster.addLayer(L.marker(marker.latlng)
        .bindPopup(marker.name))
    })

    map.addLayer(cluster)

    return () => {
      window.removeEventListener('resize', resizeMap)
      map.remove()
    }
  }, [props.markers])

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
          <div className='info'>
            <p>{props.response.hello}</p>
          </div>
          <Map markers={props.response.sites} />
        </main>
      </div>
    )
  },

  query: `
  {
    hello
    sites {
      name
      latlng
    }
  }`
}

export default MainScreen
