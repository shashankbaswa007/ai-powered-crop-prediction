// Google Gemini AI API utility functions
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const sendMessageToGemini = async (message, context = {}) => {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found');
    return {
      success: false,
      error: 'API key not configured',
      message: 'I apologize, but the AI service is not properly configured. Please check the API key settings.'
    };
  }

  try {
    const prompt = createFarmingPrompt(message, context);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        message: data.candidates[0].content.parts[0].text,
        timestamp: new Date()
      };
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      success: false,
      error: error.message,
      message: 'I apologize, but I encountered an error while processing your request. Please try again later.'
    };
  }
};

const createFarmingPrompt = (userMessage, context) => {
  const systemPrompt = `You are an expert agricultural AI assistant specializing in farming practices in Odisha, India. You provide practical, actionable advice to farmers about:

- Crop selection and rotation
- Soil health and fertilization
- Pest and disease management
- Weather-based farming decisions
- Irrigation and water management
- Harvest timing and post-harvest handling
- Government schemes and subsidies for farmers
- Sustainable farming practices
- Market prices and crop economics

Context information:
${context.district ? `District: ${context.district}` : ''}
${context.season ? `Season: ${context.season}` : ''}
${context.crop ? `Current crop: ${context.crop}` : ''}
${context.weather ? `Weather: ${context.weather.condition}, ${context.weather.temperature}°C, Humidity: ${context.weather.humidity}%` : ''}

Please provide helpful, practical advice in a conversational tone. Keep responses concise but informative. If the question is not related to farming, politely redirect the conversation back to agricultural topics.

User question: ${userMessage}`;

  return systemPrompt;
};

export const getCropAdvice = async (cropData) => {
  const message = `I need advice for growing ${cropData.crop} in ${cropData.district} district during ${cropData.season} season on ${cropData.area} hectares. What are the best practices, potential challenges, and recommendations?`;
  
  const context = {
    district: cropData.district,
    season: cropData.season,
    crop: cropData.crop,
    area: cropData.area
  };
  
  return await sendMessageToGemini(message, context);
};

export const getWeatherBasedAdvice = async (weatherData, cropInfo) => {
  const message = `Given the current weather conditions (${weatherData.condition}, ${weatherData.temperature}°C, ${weatherData.humidity}% humidity), what farming activities should I focus on for my ${cropInfo.crop} crop in ${cropInfo.district}?`;
  
  const context = {
    weather: weatherData,
    ...cropInfo
  };
  
  return await sendMessageToGemini(message, context);
};