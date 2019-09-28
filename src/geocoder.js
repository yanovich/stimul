export default function geocoder(query) {
  return fetch(
    `https://nominatim.openstreetmap.org/search?format=geocodejson&accept-language=ru&countrycodes=ru&q=${query}`
  )
    .then(response => response.json())
    .then(data => data.features);
}

export function yandex(query) {
  return fetch(
    `https://geocode-maps.yandex.ru/1.x/?apikey=704c238a-9f36-422d-8e2a-cff130abb7f4&format=json&geocode=${query}`
  ).then(response => response.json());
}
