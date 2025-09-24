// Chatbot API utility functions using external service
const CHATBOT_API_URL = 'https://agrigem-1.onrender.com';

export const sendMessageToChatbot = async (message, context = {}) => {
  try {
    const payload = {
      message: message,
      context: {
        language: context.language || 'en',
        district: context.district || null,
        season: context.season || null,
        crop: context.crop || null,
        weather: context.weather || null,
        userId: context.userId || null
      }
    };

    console.log('Sending to chatbot:', payload);

    const response = await fetch(`${CHATBOT_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Chatbot API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.response || data.message || 'I received your message but couldn\'t generate a proper response.',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error calling chatbot API:', error);
    
    // Fallback response
    return {
      success: false,
      error: error.message,
      message: getFallbackResponse(message, context.language || 'en')
    };
  }
};

const getFallbackResponse = (message, language) => {
  const fallbackResponses = {
    en: {
      greeting: "Hello! I'm your farming assistant. How can I help you today?",
      crop: "For crop-related questions, I recommend consulting with local agricultural experts or extension officers.",
      weather: "Weather conditions are important for farming. Please check local weather forecasts regularly.",
      general: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again later or consult with local farming experts."
    },
    hi: {
      greeting: "नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      crop: "फसल संबंधी प्रश्नों के लिए, मैं स्थानीय कृषि विशेषज्ञों या विस्तार अधिकारियों से सलाह लेने की सलाह देता हूं।",
      weather: "मौसम की स्थिति खेती के लिए महत्वपूर्ण है। कृपया नियमित रूप से स्थानीय मौसम पूर्वानुमान देखें।",
      general: "मुझे खुशी है, लेकिन मुझे अपने ज्ञान आधार से जुड़ने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें।"
    },
    or: {
      greeting: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର କୃଷି ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
      crop: "ଫସଲ ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନ ପାଇଁ, ମୁଁ ସ୍ଥାନୀୟ କୃଷି ବିଶେଷଜ୍ଞ କିମ୍ବା ସମ୍ପ୍ରସାରଣ ଅଧିକାରୀଙ୍କ ସହିତ ପରାମର୍ଶ କରିବାକୁ ପରାମର୍ଶ ଦେଉଛି।",
      weather: "ଚାଷ ପାଇଁ ପାଣିପାଗ ଅବସ୍ଥା ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ଦୟାକରି ନିୟମିତ ସ୍ଥାନୀୟ ପାଣିପାଗ ପୂର୍ବାନୁମାନ ଯାଞ୍ଚ କରନ୍ତୁ।",
      general: "ମୁଁ ଦୁଃଖିତ, କିନ୍ତୁ ମୋର ଜ୍ଞାନ ଆଧାର ସହିତ ସଂଯୋଗ କରିବାରେ ଅସୁବିଧା ହେଉଛି। ଦୟାକରି ପରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।"
    }
  };

  const responses = fallbackResponses[language] || fallbackResponses.en;
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते') || lowerMessage.includes('ନମସ୍କାର')) {
    return responses.greeting;
  } else if (lowerMessage.includes('crop') || lowerMessage.includes('फसल') || lowerMessage.includes('ଫସଲ')) {
    return responses.crop;
  } else if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('ପାଣିପାଗ')) {
    return responses.weather;
  } else {
    return responses.general;
  }
};

export const getCropAdvice = async (cropData) => {
  const message = `I need advice for growing ${cropData.crop} in ${cropData.district} district during ${cropData.season} season on ${cropData.area} hectares. What are the best practices, potential challenges, and recommendations?`;
  
  const context = {
    district: cropData.district,
    season: cropData.season,
    crop: cropData.crop,
    area: cropData.area
  };
  
  return await sendMessageToChatbot(message, context);
};

export const getWeatherBasedAdvice = async (weatherData, cropInfo) => {
  const message = `Given the current weather conditions (${weatherData.condition}, ${weatherData.temperature}°C, ${weatherData.humidity}% humidity), what farming activities should I focus on for my ${cropInfo.crop} crop in ${cropInfo.district}?`;
  
  const context = {
    weather: weatherData,
    ...cropInfo
  };
  
  return await sendMessageToChatbot(message, context);
};