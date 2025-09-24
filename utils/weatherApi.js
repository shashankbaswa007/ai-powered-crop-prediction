// Weather API utility functions using OpenWeather Free APIs
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Helper to map weather condition to an icon
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

// District to city mapping for Odisha
// District to city mapping for all Odisha districts with approximate coordinates
export const districtCityMap = {
  'Angul': { name: 'Angul', lat: 20.8397, lon: 85.1016 },
  'Balangir': { name: 'Balangir', lat: 20.7081, lon: 83.4847 },
  'Balasore': { name: 'Balasore', lat: 21.4906, lon: 86.9310 },
  'Bargarh': { name: 'Bargarh', lat: 21.3333, lon: 83.6167 },
  'Bhadrak': { name: 'Bhadrak', lat: 21.0542, lon: 86.5158 },
  'Boudh': { name: 'Boudh', lat: 20.8356, lon: 84.3258 },
  'Cuttack': { name: 'Cuttack', lat: 20.4625, lon: 85.8828 },
  'Deogarh': { name: 'Deogarh', lat: 21.4911, lon: 84.4305 },
  'Dhenkanal': { name: 'Dhenkanal', lat: 20.6586, lon: 85.5947 },
  'Gajapati': { name: 'Paralakhemundi', lat: 18.7833, lon: 84.0833 },
  'Ganjam': { name: 'Berhampur', lat: 19.3149, lon: 84.7941 },
  'Jagatsinghpur': { name: 'Jagatsinghpur', lat: 20.2518, lon: 86.1739 },
  'Jajpur': { name: 'Jajpur', lat: 20.8397, lon: 86.3269 },
  'Jharsuguda': { name: 'Jharsuguda', lat: 21.8558, lon: 84.0058 },
  'Kalahandi': { name: 'Bhawanipatna', lat: 19.9069, lon: 83.1636 },
  'Kandhamal': { name: 'Phulbani', lat: 20.4781, lon: 84.2353 },
  'Kendrapara': { name: 'Kendrapara', lat: 20.5000, lon: 86.4219 },
  'Keonjhar': { name: 'Keonjhar', lat: 21.6297, lon: 85.5828 },
  'Khordha': { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245 },
  'Koraput': { name: 'Koraput', lat: 18.8120, lon: 82.7108 },
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

// Fetch current weather by city
export const getWeatherByCity = async (cityName) => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `${CURRENT_WEATHER_URL}?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main)),
      pressure: data.main.pressure,
      visibility: data.visibility / 1000 // km
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Fetch weather by district
export const getWeatherByDistrict = async (district) => {
  const districtInfo = districtCityMap[district];
  if (!districtInfo) {
    console.warn(`District not found: ${district}`);
    return null;
  }
  return await getWeatherByCity(districtInfo.name);
};

// Fetch 5-day forecast by city
export const getForecastByCity = async (cityName) => {
  if (!OPENWEATHER_API_KEY) return null;

  try {
    const response = await fetch(
      `${FORECAST_URL}?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) throw new Error(`Forecast API error: ${response.status}`);

    const data = await response.json();
    // Simplify: pick 3-hour intervals for next 5 days
    const forecast = data.list.map(item => ({
      time: new Date(item.dt * 1000),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: getWeatherIcon(item.weather[0].main),
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6)
    }));

    return { city: cityName, forecast };
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return null;
  }
};