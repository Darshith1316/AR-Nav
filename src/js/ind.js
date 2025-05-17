// Create the map centered at India
var map = L.map('map').setView([22.9734, 78.6569], 5);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add marker when user clicks on map
map.on('click', function(e) {
  var lat = e.latlng.lat.toFixed(5);
  var lng = e.latlng.lng.toFixed(5);
  var marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup("Marker at:<br>Lat: " + lat + "<br>Lng: " + lng).openPopup();
});
