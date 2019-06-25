import './main.css'

import React, { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const tileUrl = navigator.appName === 'Zombie'
  ? '/white-square.png'
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
    console.log('width: ', width, ', height: ', height)
  }

  useEffect(() => {
    resizeMap()
    window.addEventListener('resize', resizeMap)
    const map = L.map('map').setView([55.761234, 37.563179], 16)
    L.tileLayer(tileUrl, {
      attribution: mapAttribution,
      maxZoom: 18,
      id: 'osm'
    }).addTo(map)

    return () => {
      window.removeEventListener('resize', resizeMap)
      map.remove()
    }
  }, [])

  return (
    <div id='container'>
      <div id='map' />
    </div>
  )
}

const MainScreen = {
  render: (props) => {
    return (
      <div className='stimul-main'>
        <header>Стимул</header>
        <main>
          <div className='info'>
            <p>{props.response.hello}</p>
          </div>
          <Map />
        </main>
      </div>
    )
  },

  query: '{hello}'
}

export default MainScreen
