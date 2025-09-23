// Weather API utility functions
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByCity = async (cityName) => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main),
      city: data.name,
      country: data.sys.country
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const getWeatherByCoordinates = async (lat, lon) => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main),
      city: data.name,
      country: data.sys.country
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const getWeatherForecast = async (cityName, days = 5) => {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeather API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric&cnt=${days * 8}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather forecast API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.list.map(item => ({
      date: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
      condition: item.weather[0].main,
      description: item.weather[0].description,
      icon: getWeatherIcon(item.weather[0].main)
    }));
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
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

// District to city mapping for Odisha
export const districtCityMap = {
  'Angul': 'Angul',
  'Balangir': 'Balangir',
  'Bhadrak': 'Bhadrak',
  'Boudh': 'Boudh',
  'Cuttack': 'Cuttack',
  'Dhenkanal': 'Dhenkanal',
  'Gajapati': 'Paralakhemundi',
  'Ganjam': 'Berhampur',
  'Jagatsinghpur': 'Jagatsinghpur',
  'Jajpur': 'Jajpur',
  'Jharsuguda': 'Jharsuguda',
  'Kalahandi': 'Bhawanipatna',
  'Kandhamal': 'Phulbani',
  'Kendrapara': 'Kendrapara',
  'Keonjhar': 'Keonjhar',
  'Khordha': 'Bhubaneswar',
  'Koraput': 'Koraput',
  'Malkangiri': 'Malkangiri',
  'Mayurbhanj': 'Baripada',
  'Nabarangpur': 'Nabarangpur',
  'Nayagarh': 'Nayagarh',
  'Nuapada': 'Nuapada',
  'Puri': 'Puri',
  'Rayagada': 'Rayagada',
  'Sambalpur': 'Sambalpur',
  'Subarnapur': 'Subarnapur',
  'Sundargarh': 'Rourkela'
};