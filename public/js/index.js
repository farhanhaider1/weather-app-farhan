const fetchWeather = "/weather";

getCurrentLocation();

//! call when user enters city name/zip etc
document.getElementById("search-btn").addEventListener("click", async ()=> {
    const name = document.getElementById('location-input');
    console.log(name.value);
    if(name.value == ''){
      return alert('Enter a name or choose my location');
    }
    const url = fetchWeather + '?name=' + name.value;
    const res = await fetch(url);
    const data = await res.json().then(data => {
      if(data.error){
        console.log(data.error);
        alert(data.error);
      }else{
        updateHtml(data);
      }
    }).catch(err=>{
       console.log(err);
    });
});

//call when user wants weather from their location
document.getElementById('user-loc-btn').addEventListener('click',()=>{
    getCurrentLocation();
});
function getCurrentLocation() {
  if (navigator.geolocation) {
      console.log('Location Available');
      navigator.geolocation.getCurrentPosition(getWeather);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
async function getWeather (position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = fetchWeather + '?lat=' + lat + "&lon=" + lon;

    const res = await fetch(url);
    const data = await res.json().then(data=>{
      updateHtml(data);
    });
}

//! update html with data
function updateHtml(data) {
  //* left panel
  document.getElementById('current-temp').innerText = data.current_temp + "°C";
  
  document.getElementById('current-feel-temp').innerText = data.feels_like+"°C";

  document.getElementById('current-temp-icon').src = "http://openweathermap.org/img/wn/"+data.icon+"@2x.png";

  document.getElementById('current-description').innerText = data.description;

  //! right panel
  //* 7 day forecast
  //*getting icons, hig/low temp and name of next days
  var html='';
  for (var i=0; i<=data.daily.length-1; i++) {
    html+='<div class="seven-div" ><div class = "seven-div-child"><h5>'+data.daily[i].next_days+'</h5><img src="http://openweathermap.org/img/wn/' +data.daily[i].icon+'@2x.png"'+'alt="weather icon">'+''+data.daily[i].max_temp+'°'+'<span class="min-week"> '+data.daily[i].min_temp+'°</span></div></div></div>';
  }
  document.getElementById('seven-daily-div').innerHTML = html;

  //* todays highlights
  //sunrise and sunset
  document.getElementById('sunrise-time').innerText = data.sunrise+' AM';
  document.getElementById('sunset-time').innerText = data.sunset + ' PM';
  document.getElementById('humidity-data').innerText = data.humidity;
  document.getElementById('uvi-data').innerText = data.uvi;
  document.getElementById('wind-data').innerText = data.windspeed;
  document.getElementById('visibility').innerText = data.visibility;
  var d = new Date();
  document.getElementById('time').innerText = d.getHours()+':'+d.getMinutes();
}
