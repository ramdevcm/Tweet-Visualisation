var mymap = L.map('mapid').setView([25.512, 20.104], 2);

L.tileLayer('   https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=bvyvAPyZ7H2S6PR2Tq2h', {
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'bvyvAPyZ7H2S6PR2Tq2h'
}).addTo(mymap);

var source = new EventSource('/topic/twitterdata1');

source.addEventListener('message', function(e){
    obj = JSON.parse(e.data);
    lat = obj.place.bounding_box.coordinates[0][0][1];
    long = obj.place.bounding_box.coordinates[0][0][0];
    username = obj.user.name;
    tweet = obj.text;
    profileimg=obj.user.profile_image_url_https;
    hashtag = obj.entities.hashtags;
    marker = L.marker([lat,long],).addTo(mymap).bindPopup('Username: <strong>' + username + '</strong><br>Tweet: <strong>' + tweet + '</strong>');
      
    appendData(username,tweet,profileimg);

    const priority_tags=["DANGER","ACCIDENT","ALERT","SAFE"];
    hashtag.every(element => {
      tag=(element.text).toUpperCase();
      if(priority_tags.includes(tag))
        {
          var tag_index="tag"+priority_tags.indexOf(tag);
          priorityData(username,tweet,profileimg,tag,tag_index);
          return false;
        }
 
    });

}, false);


function priorityData(username,tweet,profileimg,tag,tag_index) 
{
  var mainContainer = document.getElementById("PQ");
  var div = document.createElement("div");
  div.classList="card-top";
  div.innerHTML = '<div class="'+tag_index+'">' + tag + '</div> <img src="'+profileimg+'" style="float:left; padding-right:5px; border-radius:50px;" /> <div class="username"> <strong>' + username + '</strong></div><br>' + '<div class="tweet">' + tweet + '</div>';
  mainContainer.appendChild(div);
  
}

function appendData(username,tweet,profileimg) 
{
  
  var mainContainer = document.getElementById("recents");
  var div = document.createElement("div");
  var img = document.createElement("div");
  div.classList='card-bottom';
  div.innerHTML = '<img src="'+profileimg+'" style="float:left; padding-right:5px; border-radius: 50px;" /> <div class="username"> <strong>' + username + '</strong></div><br>' + '<div class="tweet">' + tweet + '</div>';
  mainContainer.appendChild(div);
  
}


L.control.scale().addTo(mymap);
setInterval(function(){
    map.setView([0, 0]);
    setTimeout(function(){
        map.setView([60, 0]);
    }, 2000);
}, 4000);

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