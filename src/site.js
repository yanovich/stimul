import './site.css'

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

  function showSite (name) {
    props.update('site', { name })
  }

  function addMarker (data) {
    const marker = L.marker(data.latlng).bindPopup(
      '<a onclick="L.showSite(' + data.name + ')">' + data.name + '</a>'
    )
    L.showSite = showSite
    cluster.addLayer(marker)
    return marker
  }

  useLayoutEffect(() => {
    resizeMap()
    window.addEventListener('resize', resizeMap)
    L.Icon.Default.imagePath = '/images/'
    // eslint-disable-next-line react-hooks/exhaustive-deps
    map = L.map('map').setView(props.markers[0].latlng, 15)
    L.tileLayer(tileUrl, {
      attribution: mapAttribution,
      maxZoom: 18,
      id: 'osm'
    }).addTo(map)

    return () => {
      window.removeEventListener('resize', resizeMap)
      map.remove()
    }
  }, [props.markers])

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

const SiteScreen = {
  render: props => {
    return (
      <div className='stimul-site'>
        <header>Стимул</header>
        <main>
          <div className='sitePane'>
            <Map
              markers={[props.response.site]}
              gql={props.gql}
              update={props.update}
            />
            <div className='site'>
              <label>Кодовое имя:</label>
              <label>{props.response.site.name}</label>
              <label>Координаты:</label>
              <input value={props.response.site.latlng} />
            </div>
          </div>
          <div className='objectsPane'>
            <label>Объекты строительства</label>
          </div>
        </main>
      </div>
    )
  },

  query: `
  query ($name:String!) {
    site(name: $name) {
      name
      latlng
    }
  }`
}

export default SiteScreen
