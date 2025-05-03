import React from "react";
import { WiHumidity } from "react-icons/wi";
import { FiSunset, FiSunrise } from "react-icons/fi";
export default function Weather({setCity, setCoords, data, city, refresh}){
  if(data){
  const weather = {...data};
  
  const parseTimestamp = (dt) => {
    const date = new Date(dt * 1000); // Multiply by 1000 to convert seconds to milliseconds
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-US', options); // Format the date
  };
  function uvIndexConverter(num){
    
      if (num <= 2){
        return 'Low';
      } else if(num <= 5){
        return 'Moderate';
      } else if(num <= 7){
        return 'High';
      } else if(num <= 10){
        return 'Very High';
      } else{
        return 'Extreme';
      
    }
  }
  function degToCardinal(deg){
    
      if (deg < 22.5 || deg >= 337.5){
        return 'N';
      } else if(deg >= 22.5 && deg < 67.5){
        return 'NE';
      } else if(deg >= 67.5 && deg < 112.5){
        return 'E';
      } else if(deg >= 112.5 && deg < 157.5){
        return 'SE';
      } else if(deg >= 157.5 && deg < 202.5){
        return 'S';
      } else if(deg >= 202.5 && deg < 247.5){
        return 'SW';
      } else if(deg >= 247.5 && deg < 292.5){
        return 'W';
      } else {
        return 'NW' 
      }
    
  }
  weather.current.formattedDt = parseTimestamp(weather.current.dt);
  weather.current.formattedSR = parseTimestamp(weather.current.sunrise);
  weather.current.formattedSS = parseTimestamp(weather.current.sunset);
  weather.daily = weather.daily.map(day => {return({...day, dt: parseTimestamp(day.dt), sunrise: parseTimestamp(day.sunrise), sunset: parseTimestamp(day.sunset)})});
  weather.hourly = weather.hourly.map(hour => {return({...hour, dt: parseTimestamp(hour.dt), sunrise: parseTimestamp(hour.sunrise), sunset: parseTimestamp(hour.sunset)})});
  console.log(weather);
function getLocation(e){
    navigator.geolocation.getCurrentPosition( async  (pos) => {
      console.log(`lat: ${pos.coords.latitude}, lng: ${pos.coords.longitude}` );
      const res = await fetch(`https://infinite-savannah-17951-8588afb749a5.herokuapp.com/http://api.geonames.org/findNearbyPlaceNameJSON?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&username=leo_twaha`);
      const placeNames = await res.json();
      console.log(`placenames: ${JSON.stringify(placeNames)}`)
      setCoords({lat: pos.coords.latitude, lng: pos.coords.longitude});
      setCity(placeNames.geonames[0].name);
    },() => e.target.style.display = 'none');
  }
  return(
    <>
    
    <header >
    
      <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px'}}>
       <button onClick={(e) => getLocation(e)} className="btn" id='current-location'><i className="fa-solid fa-location-crosshairs"></i> Use Current Location</button>
       
       <button onClick={refresh} id='refresh' className="btn"><i className="fa-solid fa-rotate-right"></i></button>
       </div>
       <h1 >{city}</h1>
       <p id='date'>{weather.current.formattedDt}</p>
       <div id='main-temp-info' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div id='current-temp' >
        <img className='weather-icon' src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} alt={weather.current.weather[0].description}/>
        <h2>{Math.round(weather.current.temp)}°F</h2>
        </div>
        
        <p>Feels like: {Math.round(weather.current.feels_like)}°F</p>
        <p>H:{Math.round(weather.daily[0].temp.max)}°F | L:{Math.round(weather.daily[0].temp.min)}°F</p>
        <p id='summary'>{weather.daily[0].summary}</p>
       </div>
       <div id='hourly-forecast'>
        {weather.hourly.slice(0, 25).map((hour, i) => {
          return(
          
          <div key={i} className='hourTemp'>
          <p>{`${hour.dt.split(" ")[5]} ${hour.dt.split(" ")[6]} `}</p>
          <img className='weather-icon' src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt={hour.weather[0].description}/>
          <p>{Math.round(hour.temp)}°F</p>
        
        </div>
          )
        }) }
       </div>
    </header>
    <section>
      <div id='ate-day-forecast'>
        <p id='ate-day-title'><i className="fa-solid fa-calendar-days"></i> 8-DAY FORECAST</p>
        {weather.daily.map((day, i) => {
          return(
          <div key={i} className="day-forecast">
          <p>{day.dt.split(' ')[0].replace(',', '')}</p>
          <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} />
          <p>H:{Math.round(day.temp.max)}°F | L:{Math.round(day.temp.min)}°F</p>
        </div>
          )
        })}
      </div>
    </section>
    <section>
      <div id='more-info'>
       <div className="info" id="feels-like">
        <p className="title"><i className="fa-solid fa-temperature-high"></i> FEELS LIKE</p>
        <p id="feels-like-temp">{Math.round(weather.current.feels_like)}°F</p>
       </div>
       <div className="info" id="precipitation">
       <p className="title"><i className="fa-solid fa-droplet"></i> PRECIPITATION</p>
       <p id='pre'>{Math.round(weather.daily[0].pop * 100)}%</p>
       <p style={{fontSize: '10px'}}>Chance of Precipitation</p>
       </div>
       <div className="info" id="wind">
         <p className="title"><i className="fa-solid fa-wind"></i>  WIND</p>
         <div id="wind-info">
         {weather.current.wind_speed && <p className="w-info">Wind {Math.round(weather.current.wind_speed)} mph</p>}
         {weather.current.wind_gust && <p className="w-info">Gusts {Math.round(weather.current.wind_gust)} mph</p>}
         {weather.current.wind_deg !== null && weather.current.wind_deg !== undefined && <p className="w-info">Direction {Math.round(weather.current.wind_deg)}° {degToCardinal(weather.current.wind_deg)}</p>}
         </div>
       </div>
       <div className="info" id="humdity">
        <p className="title"><WiHumidity  size='20px'/>HUMIDITY</p>
        <p>{Math.round(weather.current.humidity)}%</p>
       </div>
       <div className="info" id="uv-index">
        <p className="title"><i className="fa-solid fa-sun"></i> UV INDEX</p>
        <p>{`${Math.round(weather.current.uvi)} ${uvIndexConverter(Math.round(weather.current.uvi))}`}</p>
        </div>
       <div className="info" id="sunrise/set"> 
       <div>
        <p className="title"><FiSunrise /> SUNRISE</p>
        <p>{`${weather.current.formattedSR.split(' ')[5]} ${weather.current.formattedSR.split(' ')[6]}`}</p>
        </div>  
        <div>
        <p className="title"><FiSunset />SUNSET</p>
        <p>{`${weather.current.formattedSS.split(' ')[5]} ${weather.current.formattedSS.split(' ')[6]}`}</p>

        </div>
        </div>
      </div>
    </section>
    </>
  )
  
} else{
    console.log(`DATA NOT AVAILABLE YET`)
}
}