mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: mapSite.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
new mapboxgl.Marker()
      .setLngLat(mapSite.geometry.coordinates)
      .addTo(map)