// utils/geminiApi.js

// Use the local Next.js API route as proxy
const CHATBOT_API_URL = '/api/chatbot';

export const sendMessageToChatbot = async (message, context = {}) => {
  try {
    const payload = { message, context };

    console.log('Sending to chatbot via proxy:', payload);

    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Chatbot API error: ${response.status}`);

    const data = await response.json();

    return {
      success: true,
      message: data.response || data.message || 'I received your message but couldn’t generate a proper response.',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error calling chatbot API:', error);

    return {
      success: false,
      message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
      error: error.message,
      timestamp: new Date()
    };
  }
};

// Example function to get crop-specific advice
export const getCropAdvice = async (cropData) => {
  const message = `I need advice for growing ${cropData.crop} in ${cropData.district} district during ${cropData.season} season on ${cropData.area} hectares. What are the best practices, potential challenges, and recommendations?`;
  
  const context = {
    district: cropData.district,
    season: cropData.season,
    crop: cropData.crop,
    area: cropData.area,
    language: cropData.language || 'en'
  };
  
  return await sendMessageToChatbot(message, context);
};

// Example function for weather-based advice
export const getWeatherBasedAdvice = async (weatherData, cropInfo) => {
  const message = `Given the current weather conditions (${weatherData.condition}, ${weatherData.temperature}°C, ${weatherData.humidity}% humidity), what farming activities should I focus on for my ${cropInfo.crop} crop in ${cropInfo.district}?`;
  
  const context = {
    weather: weatherData,
    ...cropInfo
  };
  
  return await sendMessageToChatbot(message, context);
};