// utils/weatherApi.js

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const districtCityMap = {
  'Angul': { lat: 20.8397, lon: 85.1016 },
  'Balangir': { lat: 20.7081, lon: 83.4847 },
  'Bhadrak': { lat: 21.0542, lon: 86.5158 },
  'Boudh': { lat: 20.8356, lon: 84.3258 },
  'Cuttack': { lat: 20.4625, lon: 85.8828 },
  'Dhenkanal': { lat: 20.6586, lon: 85.5947 },
  'Gajapati': { lat: 18.7833, lon: 84.0833 },
  'Ganjam': { lat: 19.3149, lon: 84.7941 },
  'Jagatsinghpur': { lat: 20.2518, lon: 86.1739 },
  'Jajpur': { lat: 20.8397, lon: 86.3269 },
  'Jharsuguda': { lat: 21.8558, lon: 84.0058 },
  'Kalahandi': { lat: 19.9069, lon: 83.1636 },
  'Kandhamal': { lat: 20.4781, lon: 84.2353 },
  'Kendrapara': { lat: 20.5, lon: 86.4219 },
  'Keonjhar': { lat: 21.6297, lon: 85.5828 },
  'Khordha': { lat: 20.2961, lon: 85.8245 },
  'Koraput': { lat: 18.812, lon: 82.7108 },
  'Malkangiri': { lat: 18.3478, lon: 81.8811 },
  'Mayurbhanj': { lat: 21.9347, lon: 86.7339 },
  'Nabarangpur': { lat: 19.2306, lon: 82.5497 },
  'Nayagarh': { lat: 20.1297, lon: 85.0958 },
  'Nuapada': { lat: 20.8047, lon: 82.6197 },
  'Puri': { lat: 19.8135, lon: 85.8312 },
  'Rayagada': { lat: 19.1697, lon: 83.4158 },
  'Sambalpur': { lat: 21.4669, lon: 83.9812 },
  'Subarnapur': { lat: 20.3269, lon: 83.9019 },
  'Sundargarh': { lat: 22.2604, lon: 84.8536 }
};

const getWeatherIcon = (condition) => {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️'
  };
  return icons[condition] || '🌤️';
};

export const getWeatherByDistrict = async (district) => {
  const coords = districtCityMap[district];
  if (!coords) return null;

  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return null;
  }

  try {
    const res = await fetch(
      `${CURRENT_WEATHER_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`);
    }

    const data = await res.json();

    return {
      current: {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].main),
        pressure: data.main.pressure,
        visibility: data.visibility / 1000
      }
    };
  } catch (err) {
    console.error('Error fetching weather data:', err);
    return null;
  }
};