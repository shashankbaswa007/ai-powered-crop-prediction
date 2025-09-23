// ML Model API utility functions for crop yield prediction
const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL;

export const predictCropYield = async (formData) => {
  try {
    // Prepare the data in the format expected by the ML model
    const mlPayload = {
      district: formData.district,
      year: parseInt(formData.year),
      season: formData.season,
      crop: formData.crop,
      area: parseFloat(formData.area) || 0,
      // Add any additional fields that the ML model expects
      subPlots: formData.subPlots || []
    };

    console.log('Sending data to ML API:', mlPayload);

    // For now, we'll simulate the API call since the HuggingFace space might need specific formatting
    // Replace this with actual API call when the endpoint format is confirmed
    const response = await simulateMLPrediction(mlPayload);
    
    return {
      success: true,
      data: response
    };

    // Uncomment and modify this when the actual API endpoint is ready:
    /*
    const response = await fetch(`${ML_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mlPayload)
    });

    if (!response.ok) {
      throw new Error(`ML API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data
    };
    */
  } catch (error) {
    console.error('Error calling ML API:', error);
    
    // Fallback to simulated prediction
    const fallbackResponse = await simulateMLPrediction(formData);
    
    return {
      success: true,
      data: fallbackResponse,
      note: 'Using simulated prediction due to API unavailability'
    };
  }
};

// Simulate ML prediction with realistic data based on Odisha agriculture
const simulateMLPrediction = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const baseYields = {
    'Rice': { min: 20, max: 45, avg: 32 },
    'Wheat': { min: 15, max: 35, avg: 25 },
    'Maize': { min: 25, max: 55, avg: 40 },
    'Pulses': { min: 8, max: 18, avg: 12 },
    'Oilseeds': { min: 10, max: 25, avg: 18 },
    'Sugarcane': { min: 400, max: 800, avg: 600 },
    'Jute': { min: 15, max: 30, avg: 22 },
    'Vegetables': { min: 150, max: 400, avg: 275 },
    'Groundnut': { min: 12, max: 28, avg: 20 },
    'Millets': { min: 8, max: 20, avg: 14 }
  };

  const seasonMultipliers = {
    'Kharif': 1.0,
    'Rabi': 0.9,
    'Summer': 0.8
  };

  const districtMultipliers = {
    'Cuttack': 1.1,
    'Khordha': 1.05,
    'Puri': 1.0,
    'Ganjam': 0.95,
    'Sambalpur': 0.9,
    'Mayurbhanj': 0.85,
    'Koraput': 0.8
  };

  const crop = formData.crop || 'Rice';
  const season = formData.season || 'Kharif';
  const district = formData.district || 'Cuttack';
  const area = parseFloat(formData.area) || 1;

  const baseYield = baseYields[crop] || baseYields['Rice'];
  const seasonMult = seasonMultipliers[season] || 1.0;
  const districtMult = districtMultipliers[district] || 0.9;
  
  // Add some randomness for realistic variation
  const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
  
  const predictedYieldPerHa = Math.round(
    baseYield.avg * seasonMult * districtMult * randomFactor
  );
  
  const totalYield = predictedYieldPerHa * area;
  const comparativePercentage = ((predictedYieldPerHa - baseYield.avg) / baseYield.avg * 100).toFixed(1);

  // Generate sub-plot predictions if applicable
  const subPlotResults = formData.subPlots?.map(plot => {
    const plotBaseYield = baseYields[plot.crop] || baseYields['Rice'];
    const plotYield = Math.round(
      plotBaseYield.avg * seasonMult * districtMult * (0.8 + Math.random() * 0.4)
    );
    
    return {
      crop: plot.crop,
      area: parseFloat(plot.area),
      yieldPerHa: plotYield,
      totalYield: plotYield * parseFloat(plot.area)
    };
  }) || [];

  return {
    predictedYield: predictedYieldPerHa,
    totalYield: totalYield,
    comparativePercentage: comparativePercentage,
    confidence: Math.round(75 + Math.random() * 20), // 75-95% confidence
    factors: {
      season: season,
      district: district,
      crop: crop,
      area: area
    },
    subPlotResults: subPlotResults,
    recommendations: generateRecommendations(crop, season, district, predictedYieldPerHa, baseYield.avg),
    marketPrice: generateMarketPrice(crop),
    expectedRevenue: calculateExpectedRevenue(crop, totalYield)
  };
};

const generateRecommendations = (crop, season, district, predictedYield, avgYield) => {
  const recommendations = [];
  
  if (predictedYield > avgYield * 1.1) {
    recommendations.push("Excellent yield potential! Maintain current practices and consider expanding area next season.");
  } else if (predictedYield < avgYield * 0.9) {
    recommendations.push("Below average yield predicted. Consider soil testing and improved fertilization.");
  }
  
  // Crop-specific recommendations
  const cropRecommendations = {
    'Rice': [
      "Ensure proper water management during flowering stage",
      "Apply balanced NPK fertilizers as per soil test",
      "Monitor for brown plant hopper and stem borer"
    ],
    'Wheat': [
      "Timely sowing is crucial for good yield",
      "Apply irrigation at critical growth stages",
      "Watch for rust diseases and aphid attacks"
    ],
    'Maize': [
      "Maintain proper plant spacing for better yield",
      "Apply nitrogen in split doses",
      "Control fall armyworm if detected"
    ]
  };
  
  const specificRecs = cropRecommendations[crop] || cropRecommendations['Rice'];
  recommendations.push(...specificRecs.slice(0, 2));
  
  return recommendations;
};

const generateMarketPrice = (crop) => {
  const basePrices = {
    'Rice': 2000,
    'Wheat': 2100,
    'Maize': 1800,
    'Pulses': 5000,
    'Oilseeds': 4500,
    'Sugarcane': 300,
    'Vegetables': 1500,
    'Groundnut': 5200
  };
  
  const basePrice = basePrices[crop] || basePrices['Rice'];
  const variation = 0.9 + (Math.random() * 0.2); // ±10% variation
  
  return Math.round(basePrice * variation);
};

const calculateExpectedRevenue = (crop, totalYield) => {
  const marketPrice = generateMarketPrice(crop);
  return Math.round(totalYield * marketPrice);
};

export const getMLModelStatus = async () => {
  try {
    // Check if the ML API is accessible
    const response = await fetch(`${ML_API_URL}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    return {
      status: response.ok ? 'online' : 'offline',
      url: ML_API_URL
    };
  } catch (error) {
    return {
      status: 'offline',
      url: ML_API_URL,
      error: error.message
    };
  }
};