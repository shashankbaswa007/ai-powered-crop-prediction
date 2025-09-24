import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { i18n } from '../data/i18n';
import { Card } from './Card';          // fixed to named import
import { ChartCard } from './ChartCard'; // fixed to named import
import { yieldData, soilData, weatherData } from '../data/mockData';
import { getWeatherByDistrict } from '../utils/weatherApi';
import { getWeatherBasedAdvice } from '../utils/geminiApi';

const Dashboard = () => {
  const { theme, setView, language, userId, userFarms } = useAppContext();
  const t = i18n[language];
  const [weather, setWeather] = useState(null);
  const [soilHealth, setSoilHealth] = useState(null);
  const [currentYield, setCurrentYield] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const defaultDistrict = userFarms.length > 0 ? userFarms[0].district : 'Cuttack';
      
      const weatherData = await getWeatherByDistrict(defaultDistrict);
      if (weatherData) {
        setWeather(weatherData.current);
      } else {
        setWeather({
          temperature: 28 + Math.floor(Math.random() * 8),
          humidity: 60 + Math.floor(Math.random() * 20),
          wind: 10 + Math.floor(Math.random() * 10),
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
          icon: '🌤️'
        });
      }

      setSoilHealth({
        ph: (6.5 + Math.random() * 0.8).toFixed(1),
        nitrogen: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        phosphorus: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        potassium: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      });

      setCurrentYield({
        crop: 'Rice',
        district: 'Cuttack',
        predictedYield: 25 + Math.floor(Math.random() * 15),
        comparativePercentage: (5 + Math.random() * 20).toFixed(1),
        status: 'Good',
      });

      setSuggestions({
        today: await generateAISuggestions(weatherData, userFarms[0]),
        tomorrow: weatherData?.daily?.[1] ? 
          `Tomorrow: ${weatherData.daily[1].description}, ${weatherData.daily[1].tempMax}°C/${weatherData.daily[1].tempMin}°C` :
          language === 'en'
          ? "Prepare for possible rainfall. Ensure proper drainage and consider applying organic compost."
          : language === 'hi'
          ? "संभावित वर्षा के लिए तैयार रहें। उचित जल निकासी सुनिश्चित करें और जैविक खाद लगाने पर विचार करें।"
          : "ସମ୍ଭାବ୍ୟ ବର୍ଷା ପାଇଁ ପ୍ରସ୍ତୁତ ହୁଅନ୍ତୁ। ଉପଯୁକ୍ତ ଡ୍ରେନେଜ୍ ନିଶ୍ଚିତ କରନ୍ତୁ ଏବଂ ଜୈବିକ କମ୍ପୋଷ୍ଟ ପ୍ରୟୋଗ କରିବାକୁ ବିଚାର କରନ୍ତୁ।"
      });
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [language, userFarms]);

  const generateAISuggestions = async (weatherData, farmData) => {
    if (!weatherData?.current) {
      return language === 'en' 
        ? "Monitor soil moisture levels and check for pest infestations. Ideal time for light fertilization."
        : language === 'hi'
        ? "मिट्टी की नमी के स्तर की निगरानी करें और कीट संक्रमण की जांच करें। हल्के उर्वरक के लिए आदर्श समय।"
        : "ମାଟିର ଆର୍ଦ୍ରତା ସ୍ତର ମନିଟର୍ କରନ୍ତୁ ଏବଂ କୀଟ ସଂକ୍ରମଣ ଯାଞ୍ଚ କରନ୍ତୁ। ହାଲୁକା ସାର ପାଇଁ ଉପଯୁକ୍ତ ସମୟ।";
    }

    try {
      const cropInfo = farmData ? {
        district: farmData.district || 'Cuttack',
        crop: farmData.subPlots?.[0]?.crop || 'Rice',
        language: language
      } : { district: 'Cuttack', crop: 'Rice', language: language };

      const aiAdvice = await getWeatherBasedAdvice(weatherData.current, cropInfo);
      if (aiAdvice.success) return aiAdvice.message.substring(0, 200) + '...';
    } catch (error) {
      console.warn('Error getting AI suggestions:', error);
    }

    return language === 'en' 
      ? "Monitor soil moisture levels and check for pest infestations. Ideal time for light fertilization."
      : language === 'hi'
      ? "मिट्टी की नमी के स्तर की निगरानी करें और कीट संक्रमण की जांच करें। हल्के उर्वरक के लिए आदर्श समय।"
      : "ମାଟିର ଆର୍ଦ୍ରତା ସ୍ତର ମନିଟର୍ କରନ୍ତୁ ଏବଂ କୀଟ ସଂକ୍ରମଣ ଯାଞ୍ଚ କରନ୍ତୁ। ହାଲୁକା ସାର ପାଇଁ ଉପଯୁକ୍ତ ସମୟ।";
  };

  return (
    <div className={`min-h-screen transition-all duration-300 p-8 pt-20 ${
      theme === 'dark' ? 'bg-gradient-to-br from-dark-900 to-dark-800 text-white' : 'bg-gradient-to-br from-green-50 to-blue-50 text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Your dashboard JSX remains unchanged */}
      </div>
    </div>
  );
};

export { Dashboard }; // changed to named export