var mymap = L.map('mapid').setView([51.512, -0.104], 1);

L.tileLayer('   https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=bvyvAPyZ7H2S6PR2Tq2h', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'bvyvAPyZ7H2S6PR2Tq2h'
}).addTo(mymap);

var source = new EventSource('/topic/twitterdata2');

source.addEventListener('message', function(e){
    obj = JSON.parse(e.data);
    console.log(obj);
    lat = obj.place.bounding_box.coordinates[0][0][1];
    long = obj.place.bounding_box.coordinates[0][0][0];
    username = obj.user.name;
    tweet = obj.text;

    marker = L.marker([lat,long],).addTo(mymap).bindPopup('Username: <strong>' + username + '</strong><br>Tweet: <strong>' + tweet + '</strong>');

}, false);



function init() {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: {
        lat: 12.9715987,
        lng: 77.59456269999998
      },
      zoom: 12
    });
 
 
    var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('pac-input'));
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      searchBox.set('map', null);
 
 
      var places = searchBox.getPlaces();
 
      var bounds = new google.maps.LatLngBounds();
      var i, place;
      for (i = 0; place = places[i]; i++) {
        (function(place) {
          var marker = new google.maps.Marker({
 
            position: place.geometry.location
          });
          marker.bindTo('map', searchBox, 'map');
          google.maps.event.addListener(marker, 'map_changed', function() {
            if (!this.getMap()) {
              this.unbindAll();
            }
          });
          bounds.extend(place.geometry.location);
 
 
        }(place));
 
      }
      map.fitBounds(bounds);
      searchBox.set('map', map);
      map.setZoom(Math.min(map.getZoom(),12));
 
    });
  }
  google.maps.event.addDomListener(window, 'load', init);