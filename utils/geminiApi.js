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
      pest: "For pest control, consider integrated pest management practices. Use biological controls when possible.",
      soil: "Soil health is crucial for good yields. Regular soil testing and organic matter addition helps.",
      irrigation: "Proper water management is key. Use drip irrigation or sprinkler systems for efficiency.",
      fertilizer: "Apply fertilizers based on soil test results. Use balanced NPK ratios for your specific crop.",
      general: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again later or consult with local farming experts."
    },
    hi: {
      greeting: "नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      crop: "फसल संबंधी प्रश्नों के लिए, मैं स्थानीय कृषि विशेषज्ञों या विस्तार अधिकारियों से सलाह लेने की सलाह देता हूं।",
      weather: "मौसम की स्थिति खेती के लिए महत्वपूर्ण है। कृपया नियमित रूप से स्थानीय मौसम पूर्वानुमान देखें।",
      pest: "कीट नियंत्रण के लिए, एकीकृत कीट प्रबंधन प्रथाओं पर विचार करें।",
      soil: "अच्छी उपज के लिए मिट्टी का स्वास्थ्य महत्वपूर्ण है। नियमित मिट्टी परीक्षण करवाएं।",
      irrigation: "उचित जल प्रबंधन महत्वपूर्ण है। दक्षता के लिए ड्रिप सिंचाई का उपयोग करें।",
      fertilizer: "मिट्टी परीक्षण के आधार पर उर्वरक लगाएं। संतुलित NPK अनुपात का उपयोग करें।",
      general: "मुझे खुशी है, लेकिन मुझे अपने ज्ञान आधार से जुड़ने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें।"
    },
    or: {
      greeting: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର କୃଷି ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
      crop: "ଫସଲ ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନ ପାଇଁ, ମୁଁ ସ୍ଥାନୀୟ କୃଷି ବିଶେଷଜ୍ଞ କିମ୍ବା ସମ୍ପ୍ରସାରଣ ଅଧିକାରୀଙ୍କ ସହିତ ପରାମର୍ଶ କରିବାକୁ ପରାମର୍ଶ ଦେଉଛି।",
      weather: "ଚାଷ ପାଇଁ ପାଣିପାଗ ଅବସ୍ଥା ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ଦୟାକରି ନିୟମିତ ସ୍ଥାନୀୟ ପାଣିପାଗ ପୂର୍ବାନୁମାନ ଯାଞ୍ଚ କରନ୍ତୁ।",
      pest: "କୀଟ ନିୟନ୍ତ୍ରଣ ପାଇଁ, ଏକୀକୃତ କୀଟ ପରିଚାଳନା ଅଭ୍ୟାସ ବିଚାର କରନ୍ତୁ।",
      soil: "ଭଲ ଅମଳ ପାଇଁ ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ନିୟମିତ ମାଟି ପରୀକ୍ଷା କରାନ୍ତୁ।",
      irrigation: "ଉପଯୁକ୍ତ ଜଳ ପରିଚାଳନା ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ଦକ୍ଷତା ପାଇଁ ଡ୍ରିପ୍ ଜଳସେଚନ ବ୍ୟବହାର କରନ୍ତୁ।",
      fertilizer: "ମାଟି ପରୀକ୍ଷା ଆଧାରରେ ସାର ପ୍ରୟୋଗ କରନ୍ତୁ। ସନ୍ତୁଳିତ NPK ଅନୁପାତ ବ୍ୟବହାର କରନ୍ତୁ।",
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
  } else if (lowerMessage.includes('pest') || lowerMessage.includes('कीट') || lowerMessage.includes('କୀଟ')) {
    return responses.pest;
  } else if (lowerMessage.includes('soil') || lowerMessage.includes('मिट्टी') || lowerMessage.includes('ମାଟି')) {
    return responses.soil;
  } else if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('सिंचाई') || lowerMessage.includes('ଜଳସେଚନ')) {
    return responses.irrigation;
  } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('उर्वरक') || lowerMessage.includes('ସାର')) {
    return responses.fertilizer;
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
    area: cropData.area,
    language: cropData.language || 'en'
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