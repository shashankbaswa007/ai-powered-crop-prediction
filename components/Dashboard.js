import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { i18n } from '../data/i18n';
import Card from './Card';
import ChartCard from './ChartCard';
import { yieldData, soilData, weatherData } from '../data/mockData';
import { getWeatherByDistrict, districtCityMap } from '../utils/weatherApi';
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
      // Fetch real weather data
      const defaultDistrict = userFarms.length > 0 ? userFarms[0].district : 'Cuttack';
      
      const weatherData = await getWeatherByDistrict(defaultDistrict);
      if (weatherData) {
        setWeather(weatherData.current);
      } else {
        // Fallback to simulated data
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
    const interval = setInterval(fetchDashboardData, 300000); // Update every 5 minutes
    
    return () => clearInterval(interval);
  }, [language, userFarms]); // Add userFarms dependency

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
      } : {
        district: 'Cuttack',
        crop: 'Rice',
        language: language
      };
      
      const aiAdvice = await getWeatherBasedAdvice(weatherData.current, cropInfo);
      
      if (aiAdvice.success) {
        return aiAdvice.message.substring(0, 200) + '...'; // Limit length for dashboard
      }
    } catch (error) {
      console.warn('Error getting AI suggestions:', error);
    }

    // Fallback suggestions
    return language === 'en' 
      ? "Monitor soil moisture levels and check for pest infestations. Ideal time for light fertilization."
      : language === 'hi'
      ? "मिट्टी की नमी के स्तर की निगरानी करें और कीट संक्रमण की जांच करें। हल्के उर्वरक के लिए आदर्श समय।"
      : "ମାଟିର ଆର୍ଦ୍ରତା ସ୍ତର ମନିଟର୍ କରନ୍ତୁ ଏବଂ କୀଟ ସଂକ୍ରମଣ ଯାଞ୍ଚ କରନ୍ତୁ। ହାଲୁକା ସାର ପାଇଁ ଉପଯୁକ୍ତ ସମୟ।";
  };

  return (
    <div className={`min-h-screen transition-all duration-300 p-8 pt-20 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-dark-900 to-dark-800 text-white' 
        : 'bg-gradient-to-br from-green-50 to-blue-50 text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent`}>
            {t.dashboardTitle}
          </h1>
          <p className={`text-lg opacity-75 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.slogan} • {userId ? `Welcome Farmer!` : 'Loading...'}
          </p>
        </div>
        
        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Weather Card */}
          <Card title={t.weatherCard} icon="🌤️" className={theme === 'dark' ? 'bg-dark-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50'}>
            {weather ? (
              <>
                <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {weather.temperature}°C
                </p>
                <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {weather.condition}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    💧 {t.humidity}: {weather.humidity}%
                  </div>
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    💨 {t.wind}: {weather.wind} km/h
                  </div>
                </div>
              </>
            ) : (
              <div className={`text-center animate-pulse ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading weather...
              </div>
            )}
          </Card>

          {/* Soil Health Card */}
          <Card title={t.soilHealthCard} icon="🌱" className={theme === 'dark' ? 'bg-dark-700' : 'bg-gradient-to-br from-green-50 to-emerald-50'}>
            {soilHealth ? (
              <>
                <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  pH {soilHealth.ph}
                </p>
                <div className="space-y-1 mt-3 text-sm">
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    🟡 {t.nitrogen}: {soilHealth.nitrogen}
                  </div>
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    🔴 {t.phosphorus}: {soilHealth.phosphorus}
                  </div>
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    🔵 {t.potassium}: {soilHealth.potassium}
                  </div>
                </div>
              </>
            ) : (
              <div className={`text-center animate-pulse ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading soil data...
              </div>
            )}
          </Card>

          {/* Yield Card */}
          <Card title={t.yieldCard} icon="🌾" className={theme === 'dark' ? 'bg-dark-700' : 'bg-gradient-to-br from-amber-50 to-orange-50'}>
            {currentYield ? (
              <>
                <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                  {currentYield.predictedYield} {t.yieldUnit}
                </p>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentYield.crop} • {currentYield.district}
                </p>
                <div className="space-y-1 mt-3 text-sm">
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    📈 {t.comparativeYield}: +{currentYield.comparativePercentage}%
                  </div>
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    ✅ {t.status}: {currentYield.status}
                  </div>
                </div>
              </>
            ) : (
              <div className={`text-center animate-pulse ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading yield data...
              </div>
            )}
          </Card>

          {/* Crop Health Card */}
          <Card title={t.cropHealth} icon="🌿" className={theme === 'dark' ? 'bg-dark-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'}>
            <div className="text-center">
              <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                85%
              </div>
              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.overallCropHealth}
              </p>
              <div className={`w-full rounded-full h-2 mt-2 ${theme === 'dark' ? 'bg-dark-600' : 'bg-gray-200'}`}>
                <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          </Card>
        </div>

        {/* User Farms Section */}
        {userFarms.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              🏡 {t.yourFarms}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userFarms.map((farm, index) => (
                <Card key={farm.id} title={`${t.farm} ${index + 1}`} className={theme === 'dark' ? 'bg-dark-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'}>
                  <div className="space-y-2 text-sm">
                    <p><strong>{t.district}:</strong> {farm.district}</p>
                    <p><strong>{t.area}:</strong> {farm.area || farm.totalArea} hectares</p>
                    <p><strong>{t.crop}:</strong> {farm.subPlots?.map(p => p.crop).join(', ')}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions and Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Suggestions Card */}
          <Card title={t.todaysSuggestions} className={`lg:col-span-2 ${theme === 'dark' ? 'bg-dark-700' : 'bg-gradient-to-br from-yellow-50 to-orange-50'}`}>
            {suggestions ? (
              <div className="space-y-4">
                <div>
                  <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    📅 {t.today}
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {suggestions.today}
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    ⏰ {t.tomorrow}
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {suggestions.tomorrow}
                  </p>
                </div>
              </div>
            ) : (
              <div className={`text-center animate-pulse ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading AI suggestions...
              </div>
            )}
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setView('predict')}
              className="p-6 rounded-2xl font-bold text-white shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
            >
              <span className="text-2xl">📊</span>
              <span className="text-lg">{t.predict}</span>
            </button>
            
            <button
              onClick={() => setView('chatbot')}
              className="p-6 rounded-2xl font-bold text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
            >
              <span className="text-2xl">🤖</span>
              <span className="text-lg">{t.chatWithAI}</span>
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {t.chartTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ChartCard 
              title={t.predictedYield} 
              data={yieldData} 
              xAxisKey="name" 
              yAxisKey="yield" 
              color={theme === 'dark' ? '#10b981' : '#059669'}
            />
            <ChartCard 
              title={t.soilPH} 
              data={soilData} 
              xAxisKey="name" 
              yAxisKey="pH" 
              color={theme === 'dark' ? '#8b5cf6' : '#7c3aed'}
            />
            <ChartCard 
              title={t.rainfallPatterns} 
              data={weatherData} 
              xAxisKey="name" 
              yAxisKey="rainfall" 
              color={theme === 'dark' ? '#3b82f6' : '#2563eb'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;