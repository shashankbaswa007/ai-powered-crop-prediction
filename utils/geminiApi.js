// utils/geminiApi.js
const CHATBOT_API_URL = '/api/chatbot'; // Use Next.js server-side proxy

export const sendMessageToChatbot = async (message, context = {}) => {
  try {
    const payload = { message, context };

    console.log('Sending to chatbot (via proxy):', payload);

    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Chatbot API error: ${response.status}`);
    const data = await response.json();

    return {
      success: true,
      message: data.response || data.message || 'No response from chatbot',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error calling chatbot API:', error);
    return {
      success: false,
      message: 'Fallback: could not reach chatbot',
      error: error.message
    };
  }
};

// Crop advice
export const getCropAdvice = async (cropData) => {
  const message = `I need advice for growing ${cropData.crop} in ${cropData.district} district during ${cropData.season} season on ${cropData.area} hectares. What are the best practices, potential challenges, and recommendations?`;
  const context = { ...cropData, language: cropData.language || 'en' };
  return await sendMessageToChatbot(message, context);
};

// Weather-based advice
export const getWeatherBasedAdvice = async (weatherData, cropInfo) => {
  const message = `Given the current weather conditions (${weatherData.condition}, ${weatherData.temperature}°C, ${weatherData.humidity}% humidity), what farming activities should I focus on for my ${cropInfo.crop} crop in ${cropInfo.district}?`;
  const context = { ...cropInfo, weather: weatherData };
  return await sendMessageToChatbot(message, context);
};