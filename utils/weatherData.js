const fetch = require('node-fetch');
var dayjs = require('dayjs');

//* to be called in app.js
const weatherDataByCord = (req,callback)=>{ //? req and callback from app.js
    var lat = "";
    var lon = "";
    
    //! if user is searching by entring a name
    if(req.query.name != undefined){
        //* using location API to convert location name to coordinates
        // todo hide api key
        fetch(locationUrl).then(data => data.json())
        .then(body => {
            if(body.error){
                return callback({
                    error: "Location not found"
                });
            }
            lat = body[0].lat;
            lon = body[0].lon;
            //* pass the returned lat and lon to fetchweather from openweather api 
            fetchWeather(body[0].lat,body[0].lon,callback);
        }).catch(err => {
            return callback({
                error: err.message
            });
        });
    //! if user is searching by their current location    
    }else{
        //* get lat and lon from req
        lat = req.query.lat;
        lon = req.query.lon;
        fetchWeather(lat,lon,callback);
    }  
};

//! fetch weather from api after getting user lat and lon
const fetchWeather = (lat,lon,callback)=>{
    //todo --> HIDE SECRETKEY
    
    //* fetch weather info from api and turn data into json
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+(lon)+'&units=metric&appid=' + SecretKey)
    .then(data => data.json())
    .then(body => {
        //pick needed hourly parameters and pass it to callback
        const hourlyData = [];
        for (i = 1; i < body.hourly.length; i++){
            hourlyData.push({
                date: body.hourly[i].dt,
                temp: body.hourly[i].temp,
                description: body.hourly[i].weather[0].description,
                icon: body.hourly[i].weather[0].icon
            });
        }
        //pick needed daily parameters and pass it to callback
        const dailyData = [];
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'];
        var d = new Date();
        for (i = 1; i < body.daily.length; i++) {
            dailyData.push({
                next_days: days[(d.getDay())+(i)],
                min_temp: Math.round(body.daily[i].temp.min),
                max_temp: Math.round(body.daily[i].temp.max),
                icon: body.daily[i].weather[0].icon,
            });
        }
        const currentTemp = Math.round(body.current.temp);
        const currentFeelsLike = Math.round(body.current.feels_like);
        callback({
            //current weather info
            current_temp: currentTemp,
            feels_like: currentFeelsLike,
            humidity: body.current.humidity,
            sunrise: dayjs.unix(body.current.sunrise).format('hh:mm'),
            sunset: dayjs.unix(body.current.sunset).format('hh:mm'),
            uvi: body.current.uvi,
            windspeed: body.current.wind_speed,
            description: body.current.weather[0].description,
            icon: body.current.weather[0].icon,
            visibility: body.current.visibility,
            //hourly forecast
            hourlyData: hourlyData, //provided 6 hour hourly data
            //daily forecast
            daily: dailyData
        });
    });
};

module.exports = weatherDataByCord;