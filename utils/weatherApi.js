// utils/weatherApi.js
// Weather API utility functions using OpenWeather free APIs (Current + 5-day Forecast)

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Helper: Map weather condition to icon
const getWeatherIcon = (condition) => {
  const iconMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  return iconMap[condition] || '🌤️';
};

// Odisha district coordinates
export const districtCityMap = {
  'Angul': { name: 'Angul', lat: 20.8397, lon: 85.1016 },
  'Balangir': { name: 'Balangir', lat: 20.7081, lon: 83.4847 },
  'Bhadrak': { name: 'Bhadrak', lat: 21.0542, lon: 86.5158 },
  'Boudh': { name: 'Boudh', lat: 20.8356, lon: 84.3258 },
  'Cuttack': { name: 'Cuttack', lat: 20.4625, lon: 85.8828 },
  'Dhenkanal': { name: 'Dhenkanal', lat: 20.6586, lon: 85.5947 },
  'Gajapati': { name: 'Paralakhemundi', lat: 18.7833, lon: 84.0833 },
  'Ganjam': { name: 'Berhampur', lat: 19.3149, lon: 84.7941 },
  'Jagatsinghpur': { name: 'Jagatsinghpur', lat: 20.2518, lon: 86.1739 },
  'Jajpur': { name: 'Jajpur', lat: 20.8397, lon: 86.3269 },
  'Jharsuguda': { name: 'Jharsuguda', lat: 21.8558, lon: 84.0058 },
  'Kalahandi': { name: 'Bhawanipatna', lat: 19.9069, lon: 83.1636 },
  'Kandhamal': { name: 'Phulbani', lat: 20.4781, lon: 84.2353 },
  'Kendrapara': { name: 'Kendrapara', lat: 20.5, lon: 86.4219 },
  'Keonjhar': { name: 'Keonjhar', lat: 21.6297, lon: 85.5828 },
  'Khordha': { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245 },
  'Koraput': { name: 'Koraput', lat: 18.812, lon: 82.7108 },
  'Malkangiri': { name: 'Malkangiri', lat: 18.3478, lon: 81.8811 },
  'Mayurbhanj': { name: 'Baripada', lat: 21.9347, lon: 86.7339 },
  'Nabarangpur': { name: 'Nabarangpur', lat: 19.2306, lon: 82.5497 },
  'Nayagarh': { name: 'Nayagarh', lat: 20.1297, lon: 85.0958 },
  'Nuapada': { name: 'Nuapada', lat: 20.8047, lon: 82.6197 },
  'Puri': { name: 'Puri', lat: 19.8135, lon: 85.8312 },
  'Rayagada': { name: 'Rayagada', lat: 19.1697, lon: 83.4158 },
  'Sambalpur': { name: 'Sambalpur', lat: 21.4669, lon: 83.9812 },
  'Subarnapur': { name: 'Subarnapur', lat: 20.3269, lon: 83.9019 },
  'Sundargarh': { name: 'Rourkela', lat: 22.2604, lon: 84.8536 }
};

// Fetch current weather by coordinates
export const getWeatherByCoordinates = async (lat, lon) => {
  if (!OPENWEATHER_API_KEY) return null;

  try {
    const res = await fetch(`${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();

    return {
      current: {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6), // m/s → km/h
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].main),
        pressure: data.main.pressure,
        visibility: data.visibility / 1000
      }
    };
  } catch (err) {
    console.error('❌ Error fetching weather data:', err);
    return null;
  }
};

// Fetch 5-day forecast by coordinates
export const getForecastByCoordinates = async (lat, lon) => {
  if (!OPENWEATHER_API_KEY) return null;

  try {
    const res = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`);
    if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);
    const data = await res.json();

    const daily = [];
    const today = new Date().getDate();

    // Take 3-hour forecasts and convert to daily max/min
    const grouped = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.getDate();
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(item);
    });

    Object.values(grouped).forEach(dayItems => {
      const temps = dayItems.map(i => i.main.temp);
      const weatherMain = dayItems[0].weather[0].main;
      daily.push({
        date: new Date(dayItems[0].dt * 1000),
        tempMax: Math.round(Math.max(...temps)),
        tempMin: Math.round(Math.min(...temps)),
        condition: weatherMain,
        icon: getWeatherIcon(weatherMain)
      });
    });

    return { daily: daily.slice(0, 5) }; // Next 5 days
  } catch (err) {
    console.error('❌ Error fetching forecast data:', err);
    return null;
  }
};

// Fetch weather by district
export const getWeatherByDistrict = async (district) => {
  const info = districtCityMap[district];
  if (!info) return null;

  const current = await getWeatherByCoordinates(info.lat, info.lon);
  const forecast = await getForecastByCoordinates(info.lat, info.lon);
  return { ...current, forecast, city: info.name, coordinates: { lat: info.lat, lon: info.lon } };
};