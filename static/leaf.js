var mymap = L.map('mapid').setView([51.512, -0.104], 1);

L.tileLayer('   https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=bvyvAPyZ7H2S6PR2Tq2h', {
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'bvyvAPyZ7H2S6PR2Tq2h'
}).addTo(mymap);

var source = new EventSource('/topic/twitterdata1');

source.addEventListener('message', function(e){
    obj = JSON.parse(e.data);
    console.log(obj);
    lat = obj.place.bounding_box.coordinates[0][0][1];
    long = obj.place.bounding_box.coordinates[0][0][0];
    username = obj.user.name;
    tweet = obj.text;

    marker = L.marker([lat,long],).addTo(mymap).bindPopup('Username: <strong>' + username + '</strong><br>Tweet: <strong>' + tweet + '</strong>');

}, false);




var searchControl = L.esri.Geocoding.geosearch({
  position: 'topright',
  placeholder: 'Enter an address or place e.g. 1 York St',
  useMapBounds: false,
  providers: [L.esri.Geocoding.arcgisOnlineProvider({
    apikey: "AAPKa8d2b8db3fd14e77ae4505c7e20096f0JB6KH1YI-s95S8qSJ3BE1mSkL0bQs9WhLNeEU-ERX_pPGFPPBLy6WFNdTlqvODgp", // replace with your api key - https://developers.arcgis.com/dashboard/
    nearby: {
      lat: -33.8688,
      lng: 151.2093
    }
  })]
}).addTo(mymap);

var results = L.layerGroup().addTo(mymap);

searchControl.on('results', function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});