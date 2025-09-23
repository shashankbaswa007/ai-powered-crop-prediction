import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { i18n } from '../data/i18n';
import { districts } from '../data/districts';
import { crops } from '../data/crops';
import Card from './Card';
import ChartCard from './ChartCard';
import { yieldData, soilData, weatherData } from '../data/mockData';
// Remove Firebase imports

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

    // Simulate API call to Gemini AI
    setTimeout(() => {
      const totalArea = showSubPlots 
        ? formData.subPlots.reduce((sum, plot) => sum + (parseFloat(plot.area) || 0), 0)
        : parseFloat(formData.area) || 0;

      setPredictionResult({
        predictedYield: (Math.random() * 20 + 25).toFixed(1),
        comparativePercentage: (Math.random() * 25 + 5).toFixed(1),
        totalArea: totalArea,
        advice: {
          en: `Based on your ${totalArea} hectares in ${formData.district}, the predicted yield looks excellent. Consider using certified seeds, maintain proper irrigation schedules, and apply balanced fertilizers. Monitor for common pests in your region.`,
          hi: `आपके ${formData.district} में ${totalArea} हेक्टेयर के लिए, अनुमानित उपज उत्कृष्ट दिख रही है। प्रमाणित बीजों का उपयोग करें, उचित सिंचाई कार्यक्रम बनाए रखें और संतुलित उर्वरक लगाएं। अपने क्षेत्र में सामान्य कीटों पर नजर रखें।`,
          or: `ଆପଣଙ୍କ ${formData.district} ରେ ${totalArea} ହେକ୍ଟର ପାଇଁ, ଅନୁମାନିତ ଉତ୍ପାଦନ ଉତ୍କୃଷ୍ଟ ଦେଖାଯାଉଛି। ପ୍ରମାଣିତ ମଞ୍ଜି ବ୍ୟବହାର କରନ୍ତୁ, ଉପଯୁକ୍ତ ଜଳସେଚନ କାର୍ଯ୍ୟକ୍ରମ ବଜାୟ ରଖନ୍ତୁ ଏବଂ ସନ୍ତୁଳିତ ସାର ପ୍ରୟୋଗ କରନ୍ତୁ। ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ସାଧାରଣ କୀଟପତଙ୍ଗ ଉପରେ ନଜର ରଖନ୍ତୁ।`,
        },
        subPlotResults: showSubPlots ? formData.subPlots.map(plot => ({
          crop: plot.crop,
          area: plot.area,
          yield: (Math.random() * 15 + 20).toFixed(1)
        })) : []
      });
      setIsLoading(false);
    }, 2000);
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
                  <div className="text-center space-y-4">
                    <div className="flex items-baseline justify-center">
                      <p className="text-5xl font-bold text-green-600">{predictionResult.predictedYield}</p>
                      <p className="ml-2 text-xl font-bold">{t.yieldUnit}</p>
                    </div>
                    <p className="text-lg">
                      📊 {t.comparativeYield}: <span className="text-green-600 font-bold">+{predictionResult.comparativePercentage}%</span> above average
                    </p>
                    <p className="text-sm opacity-75">Total Area: {predictionResult.totalArea} hectares</p>
                    
                    {predictionResult.subPlotResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Sub-plot Breakdown:</h4>
                        {predictionResult.subPlotResults.map((result, index) => (
                          <div key={index} className="flex justify-between text-sm p-2 bg-white dark:bg-gray-700 rounded">
                            <span>{result.crop}</span>
                            <span>{result.yield} {t.yieldUnit}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                <Card title="💡 AI-Powered Advice" className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900">
                  <p className="text-sm leading-relaxed">
                    {predictionResult.advice[language] || predictionResult.advice.en}
                  </p>
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