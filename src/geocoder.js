export default function geocoder(query) {
  return fetch(
    `https://nominatim.openstreetmap.org/search?format=geocodejson&accept-language=ru&countrycodes=ru&q=${query}`
  )
    .then(response => response.json())
    .then(data => data.features);
}
