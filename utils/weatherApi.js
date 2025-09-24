// utils/weatherApi.js
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const getWeatherByCity = async (cityName) => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `${CURRENT_WEATHER_URL}?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
    const data = await response.json();

    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main),
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // km
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

const getWeatherIcon = (condition) => {
  const iconMap = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
  };
  return iconMap[condition] || '🌤️';
};