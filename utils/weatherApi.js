// Weather API utility functions using OpenWeather OneCall API 3.0
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const OPENWEATHER_ONECALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const OPENWEATHER_GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export const getWeatherByCoordinates = async (lat, lon) => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_ONECALL_URL}?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      current: {
        temperature: Math.round(data.current.temp),
        humidity: data.current.humidity,
        wind: Math.round(data.current.wind_speed * 3.6), // Convert m/s to km/h
        condition: data.current.weather[0].main,
        description: data.current.weather[0].description,
        icon: getWeatherIcon(data.current.weather[0].main),
        pressure: data.current.pressure,
        visibility: data.current.visibility / 1000, // Convert to km
        uvIndex: data.current.uvi
      },
      hourly: data.hourly.slice(0, 24).map(hour => ({
        time: new Date(hour.dt * 1000),
        temperature: Math.round(hour.temp),
        condition: hour.weather[0].main,
        icon: getWeatherIcon(hour.weather[0].main),
        humidity: hour.humidity,
        windSpeed: Math.round(hour.wind_speed * 3.6)
      })),
      daily: data.daily.slice(0, 7).map(day => ({
        date: new Date(day.dt * 1000),
        tempMax: Math.round(day.temp.max),
        tempMin: Math.round(day.temp.min),
        condition: day.weather[0].main,
        description: day.weather[0].description,
        icon: getWeatherIcon(day.weather[0].main),
        humidity: day.humidity,
        windSpeed: Math.round(day.wind_speed * 3.6),
        pop: Math.round(day.pop * 100) // Probability of precipitation
      }))
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const getWeatherByCity = async (cityName) => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return null;
  }

  try {
    // First, get coordinates for the city
    const geoResponse = await fetch(
      `${OPENWEATHER_GEOCODING_URL}?q=${cityName}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!geoResponse.ok) {
      throw new Error(`Geocoding API error: ${geoResponse.status}`);
    }
    
    const geoData = await geoResponse.json();
    
    if (geoData.length === 0) {
      throw new Error(`City not found: ${cityName}`);
    }
    
    const { lat, lon } = geoData[0];
    
    // Get weather data using coordinates
    const weatherData = await getWeatherByCoordinates(lat, lon);
    
    if (weatherData) {
      weatherData.city = cityName;
      weatherData.coordinates = { lat, lon };
    }
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data by city:', error);
    return null;
  }
};

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

// District to city mapping for Odisha with coordinates
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

export const getWeatherByDistrict = async (district) => {
  const districtInfo = districtCityMap[district];
  if (!districtInfo) {
    console.warn(`District not found: ${district}`);
    return null;
  }

  return await getWeatherByCoordinates(districtInfo.lat, districtInfo.lon);
};