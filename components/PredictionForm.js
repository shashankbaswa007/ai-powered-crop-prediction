import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { i18n } from '../data/i18n';
import { districts } from '../data/districts';
import { crops } from '../data/crops';
import Card from './Card';
import ChartCard from './ChartCard';
import { yieldData, soilData, weatherData } from '../data/mockData';
import { predictCropYield } from '../utils/mlApi';
import { getCropAdvice } from '../utils/geminiApi';

const PredictionForm = () => {
  const { theme, language } = useAppContext();
  const t = i18n[language];
  const [formData, setFormData] = useState({
    district: '',
    year: new Date().getFullYear(),
    season: '',
    crop: '',
    area: '',
    subPlots: [{ crop: '', area: '' }]
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubPlots, setShowSubPlots] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubPlotChange = (index, field, value) => {
    const updatedSubPlots = formData.subPlots.map((plot, i) => 
      i === index ? { ...plot, [field]: value } : plot
    );
    setFormData({ ...formData, subPlots: updatedSubPlots });
  };

  const addSubPlot = () => {
    setFormData({
      ...formData,
      subPlots: [...formData.subPlots, { crop: '', area: '' }]
    });
  };

  const removeSubPlot = (index) => {
    setFormData({
      ...formData,
      subPlots: formData.subPlots.filter((_, i) => i !== index)
    });
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setPredictionResult(null);

    try {
      // Validate form data
      if (!formData.district || !formData.season) {
        throw new Error('Please fill in all required fields');
      }
      
      if (!showSubPlots && (!formData.crop || !formData.area)) {
        throw new Error('Please select crop and enter area');
      }
      
      if (showSubPlots && formData.subPlots.some(plot => !plot.crop || !plot.area)) {
        throw new Error('Please fill in all sub-plot details');
      }

      // Call ML API for prediction
      const mlResult = await predictCropYield(formData);
      
      if (mlResult.success) {
        const totalArea = showSubPlots 
          ? formData.subPlots.reduce((sum, plot) => sum + (parseFloat(plot.area) || 0), 0)
          : parseFloat(formData.area) || 0;

        // Get AI-powered advice
        const aiAdvice = await getCropAdvice({
          ...formData,
          area: totalArea,
          language: language
        });

        setPredictionResult({
          predictedYield: mlResult.data.predictedYield,
          totalYield: mlResult.data.totalYield,
          comparativePercentage: mlResult.data.comparativePercentage,
          confidence: mlResult.data.confidence,
          totalArea: totalArea,
          marketPrice: mlResult.data.marketPrice,
          expectedRevenue: mlResult.data.expectedRevenue,
          recommendations: mlResult.data.recommendations,
          advice: {
            [language]: aiAdvice.success ? aiAdvice.message : getDefaultAdvice(formData, totalArea, language)
          },
          subPlotResults: mlResult.data.subPlotResults || []
        });
      } else {
        throw new Error('ML API call failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setPredictionResult({
        error: true,
        message: error.message || 'Unable to get prediction at the moment. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultAdvice = (formData, totalArea, language) => {
    const advice = {
      en: `Based on your ${totalArea} hectares in ${formData.district}, the predicted yield looks promising. Consider using certified seeds, maintain proper irrigation schedules, and apply balanced fertilizers based on soil test results.`,
      hi: `आपके ${formData.district} में ${totalArea} हेक्टेयर के लिए, अनुमानित उपज आशाजनक दिख रही है। प्रमाणित बीजों का उपयोग करें, उचित सिंचाई कार्यक्रम बनाए रखें, और मिट्टी परीक्षण के आधार पर संतुलित उर्वरक लगाएं।`,
      or: `ଆପଣଙ୍କ ${formData.district} ରେ ${totalArea} ହେକ୍ଟର ପାଇଁ, ଅନୁମାନିତ ଉତ୍ପାଦନ ଆଶାବାଦୀ ଦେଖାଯାଉଛି। ପ୍ରମାଣିତ ମଞ୍ଜି ବ୍ୟବହାର କରନ୍ତୁ, ଉପଯୁକ୍ତ ଜଳସେଚନ କାର୍ଯ୍ୟସୂଚୀ ବଜାୟ ରଖନ୍ତୁ, ଏବଂ ମାଟି ପରୀକ୍ଷା ଆଧାରରେ ସନ୍ତୁଳିତ ସାର ପ୍ରୟୋଗ କରନ୍ତୁ।`
    };
    return advice[language] || advice.en;
  };

  const isFormValid = formData.district && formData.season && 
    (showSubPlots ? formData.subPlots.every(plot => plot.crop && plot.area) : 
    (formData.crop && formData.area));

  return (
    <div className={`p-8 pt-20 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-800'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          {t.predictionForm}
        </h1>
        <p className="text-lg text-center mb-8 opacity-75">Get AI-powered crop predictions and expert advice</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Form */}
          <Card title="🌾 Enter Farm Details" className="bg-white dark:bg-gray-800">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">📍 {t.district}</label>
                  <select name="district" value={formData.district} onChange={handleInputChange} 
                    className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors duration-300">
                    <option value="">Select district</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">📅 {t.year}</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} 
                    className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors duration-300" />
                </div>
                
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">🌤️ {t.season}</label>
                  <select name="season" value={formData.season} onChange={handleInputChange} 
                    className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors duration-300">
                    <option value="">Select season</option>
                    {Object.keys(crops).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                {!showSubPlots && (
                  <div className="flex flex-col">
                    <label className="mb-2 font-medium">🌿 {t.crop}</label>
                    <select name="crop" value={formData.crop} onChange={handleInputChange} 
                      className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors duration-300" 
                      disabled={!formData.season}>
                      <option value="">Select crop</option>
                      {formData.season && crops[formData.season].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Field Division Toggle */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={showSubPlots} onChange={(e) => setShowSubPlots(e.target.checked)} 
                    className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Divide field into multiple crops</span>
                </label>
              </div>

              {/* Single Crop Area or Multiple Sub-plots */}
              {!showSubPlots ? (
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">📐 {t.area} (hectares)</label>
                  <input type="number" name="area" value={formData.area} onChange={handleInputChange} 
                    className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors duration-300" 
                    placeholder="Enter area in hectares" />
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="font-medium">🌾 Sub-plots Division</label>
                  {formData.subPlots.map((plot, index) => (
                    <div key={index} className="flex space-x-3 items-end">
                      <div className="flex-1">
                        <select value={plot.crop} onChange={(e) => handleSubPlotChange(index, 'crop', e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                          <option value="">Select crop</option>
                          {formData.season && crops[formData.season].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <input type="number" value={plot.area} onChange={(e) => handleSubPlotChange(index, 'area', e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700" 
                          placeholder="Area (ha)" />
                      </div>
                      {formData.subPlots.length > 1 && (
                        <button onClick={() => removeSubPlot(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          ❌
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addSubPlot} className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                    <span>+</span>
                    <span>Add another crop</span>
                  </button>
                </div>
              )}

              <button
                onClick={handlePredict}
                disabled={!isFormValid || isLoading}
                className="w-full mt-4 p-4 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing with AI...</span>
                    <button 
                      onClick={() => setPredictionResult(null)}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    <span>{t.getYield}</span>
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {predictionResult && (
              <>
                <Card title="📈 Prediction Results" className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
                  {predictionResult.error ? (
                    <div className="text-center text-red-600 dark:text-red-400">
                      <p className="text-lg font-semibold">⚠️ Prediction Error</p>
                      <p className="text-sm mt-2">{predictionResult.message}</p>
                    </div>
                  ) : (
                  <div className="text-center space-y-4">
                    <div className="flex items-baseline justify-center">
                      <p className="text-5xl font-bold text-green-600">{predictionResult.predictedYield}</p>
                      <p className="ml-2 text-xl font-bold">{t.yieldUnit}</p>
                    </div>
                    
                    {predictionResult.confidence && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        🎯 Confidence: {predictionResult.confidence}%
                      </p>
                    )}
                    
                    <p className="text-lg">
                      📊 {t.comparativeYield}: <span className="text-green-600 font-bold">+{predictionResult.comparativePercentage}%</span> above average
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                        <p className="font-semibold">📐 Total Area</p>
                        <p>{predictionResult.totalArea} hectares</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                        <p className="font-semibold">🌾 Total Yield</p>
                        <p>{predictionResult.totalYield} quintals</p>
                      </div>
                      {predictionResult.marketPrice && (
                        <>
                          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                            <p className="font-semibold">💰 Market Price</p>
                            <p>₹{predictionResult.marketPrice}/quintal</p>
                          </div>
                          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                            <p className="font-semibold">💵 Expected Revenue</p>
                            <p>₹{predictionResult.expectedRevenue?.toLocaleString()}</p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {predictionResult.subPlotResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Sub-plot Breakdown:</h4>
                        <div className="space-y-2">
                          {predictionResult.subPlotResults.map((result, index) => (
                            <div key={index} className="flex justify-between text-sm p-2 bg-white dark:bg-gray-700 rounded">
                              <span>{result.crop} ({result.area} ha)</span>
                              <span>{result.yieldPerHa} {t.yieldUnit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  )}
                </Card>

                <Card title="💡 AI-Powered Advice" className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900">
                  {!predictionResult.error && (
                    <>
                      <div className="text-sm leading-relaxed mb-4">
                        {predictionResult.advice[language]}
                      </div>
                      
                      {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">📋 Key Recommendations:</h4>
                          <ul className="text-sm space-y-1">
                            {predictionResult.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Visualizations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">📊 Farm Analytics & Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ChartCard title={t.predictedYield} data={yieldData} xAxisKey="name" yAxisKey="yield" color="#10b981" />
            <ChartCard title={t.soilPH} data={soilData} xAxisKey="name" yAxisKey="pH" color="#8b5cf6" />
            <ChartCard title={t.rainfallPatterns} data={weatherData} xAxisKey="name" yAxisKey="rainfall" color="#3b82f6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;