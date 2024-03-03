import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
// This imports bootstrap css styles. You can use bootstrap or your own classes by using the className attribute in your elements.
import { useState, useEffect } from 'react';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.open-meteo.com/weather?city=${city}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (error) {
        setWeatherData(null);
        setError('Failed to fetch weather data. Please try again.');
      }
    };

    fetchData();
  }, [city]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleButtonClick = (cityName) => {
    setCity(cityName);
  };

  return (
    <div>
      <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city name" />
      <button onClick={() => handleButtonClick('London')}>London</button>
      <button onClick={() => handleButtonClick('New York')}>New York</button>
      <button onClick={() => handleButtonClick('Tokyo')}>Tokyo</button>
      
      {error && <div>Error: {error}</div>}
      
      {weatherData && (
        <div>
          <h2>{weatherData.city.name}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Description: {weatherData.weather.description}</p>
          {/* Add more weather data points as needed */}
        </div>
      )}
    </div>
  );
}

export default App;