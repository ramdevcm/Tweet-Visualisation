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

    

    var redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });


    var violetIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    var yellowIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

      
    appendData(username,tweet,profileimg,lat,long);

    const priority_tags=["DANGER","ACCIDENT","ALERT","SAFE"];
    hashtag.every(element => {
    found=0;
      tag=(element.text).toUpperCase();
      if((found==0) && priority_tags.includes(tag))
        {
          found=1;
          var tag_index="tag"+priority_tags.indexOf(tag);
          if(tag == "DANGER")
          {
            iconColor = redIcon;
          }
          if(tag == "SAFE")
          {
            iconColor = greenIcon;
          }
          if(tag == "ALERT")
          {
            iconColor = violetIcon;
          }
          if(tag == "ACCIDENT")
          {
            iconColor = yellowIcon;
          }
          priorityData(username,tweet,profileimg,tag,tag_index,lat,long);
          return false;
        }
 
    });
    marker = L.marker([lat,long], {icon: iconColor} ).addTo(mymap).bindPopup('Username: <strong>' + username + '</strong><br>Tweet: <strong>' + tweet + '</strong>');
    
}, false);


function priorityData(username,tweet,profileimg,tag,tag_index,lat,long) 
{
  var mainContainer = document.getElementById("PQ");
  var div = document.createElement("div");
  div.classList="card-top";
  div.setAttribute("onclick", 'viewmap('+lat+','+long+')');
  div.innerHTML = '<div class="'+tag_index+'">' + tag + '</div> <img src="'+profileimg+'" style="float:left; padding-right:5px; border-radius:50px;" /> <div class="username"> <strong>' + username + '</strong></div><br>' + '<div class="tweet">' + tweet + '</div>';
  mainContainer.appendChild(div);
  
}

function appendData(username,tweet,profileimg,lat,long) 
{
  
  var mainContainer = document.getElementById("recents");
  var div = document.createElement("div");
  div.setAttribute("onclick", 'viewmap('+lat+','+long+')');
  div.classList='card-bottom';
  div.innerHTML = '<img src="'+profileimg+'" style="float:left; padding-right:5px; border-radius: 50px;" /> <div class="username"> <strong>' + username + '</strong></div><br>' + '<div class="tweet">' + tweet + '</div>';
  mainContainer.appendChild(div);
  
}

function viewmap(lat,long)
{
  mymap.flyTo(
    [lat,long],
    5, {
      animate: true,
      duration: 2 // in seconds
    

  });
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