import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
// This imports bootstrap css styles. You can use bootstrap or your own classes by using the className attribute in your elements.
import React, { useState, useEffect } from 'react';

// WEATHER FORECAST: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m
// GEOCODING: https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=10&language=en&format=json

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  const cities = {
    Dallas: { lat: 32.7767, lon: -96.7970 },
    Houston: { lat: 29.7604, lon: -95.3698 },
    Austin: { lat: 30.2672, lon: -97.7431 },
  };
  
  const fetchWeatherData = async (lat, lon) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation&start=now&end=now+12h`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    setWeatherData(data);
  };
  
  const handleCityClick = city => {
    const { lat, lon } = cities[city];
    fetchWeatherData(lat, lon);
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    fetchWeatherData(latitude, longitude);
  };

  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };
  
  return (
    <div className="App">
      <div className="city-buttons">
        {Object.keys(cities).map(city => (
          <button key={city} onClick={() => handleCityClick(city)}>{city}</button>
        ))}
      </div>
          
      <form onSubmit={handleSubmit} className="latlong-input">
        <div className="input-group">
          <input type="text" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Latitude" className="form-control" />
          <input type="text" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Longitude" className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Get Weather</button>
      </form>
  
      <div className="weatherDisplay">
        {weatherData && weatherData.hourly && (
          <div className="weatherRows">
            <div className="weatherRow">
              <div className="timeColumn">Time</div>
              <div className="temperatureColumn">Temperature (°F)</div>
            </div>
            {weatherData.hourly.time.map((time, index) => {
              if (index >= new Date().getHours()) {
                return (
                  <div key={time} className="weatherRow">
                    <div className="timeColumn">{new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="temperatureColumn">{celsiusToFahrenheit(weatherData.hourly.temperature_2m[index])}</div>
                  </div>
                );
              }
              return null; // Skip rendering past hours
            })}
          </div>
        )}
      </div>
    </div>
  );
  
  }
  
  export default App;