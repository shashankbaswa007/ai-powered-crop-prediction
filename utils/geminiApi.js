// geminiApi.js
const CHATBOT_API_URL = 'https://agrigem-1.onrender.com';

export const sendMessageToChatbot = async (message, context = {}) => {
  try {
    const payload = {
      message,
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'cors' // ensures cross-origin requests work
    });

    if (!response.ok) {
      throw new Error(`Chatbot API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: data.response || data.message || "I received your message but couldn't generate a proper response.",
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error calling chatbot API:', error);

    return {
      success: false,
      message: getFallbackResponse(message, context.language || 'en'),
      error: error.message
    };
  }
};

const getFallbackResponse = (message, language) => {
  const fallbackResponses = {
    en: {
      greeting: "Hello! I'm your farming assistant. How can I help you today?",
      crop: "For crop-related questions, I recommend consulting local agricultural experts.",
      weather: "Weather is important for farming. Please check local forecasts regularly.",
      pest: "Consider integrated pest management practices. Use biological controls when possible.",
      soil: "Soil health is crucial. Regular soil testing and adding organic matter helps.",
      irrigation: "Proper water management is key. Use drip or sprinkler irrigation for efficiency.",
      fertilizer: "Apply fertilizers based on soil tests. Use balanced NPK ratios.",
      general: "Sorry, I'm having trouble connecting. Please try again later."
    },
    hi: {
      greeting: "नमस्ते! मैं आपका कृषि सहायक हूं। मैं कैसे मदद कर सकता हूं?",
      crop: "फसल संबंधी प्रश्नों के लिए स्थानीय कृषि विशेषज्ञों से सलाह लें।",
      weather: "मौसम की स्थिति खेती के लिए महत्वपूर्ण है। नियमित मौसम पूर्वानुमान देखें।",
      pest: "कीट नियंत्रण के लिए एकीकृत प्रथाओं पर विचार करें।",
      soil: "मिट्टी का स्वास्थ्य महत्वपूर्ण है। नियमित परीक्षण और जैविक पदार्थ जोड़ें।",
      irrigation: "उचित जल प्रबंधन महत्वपूर्ण है। ड्रिप या स्प्रिंकलर का उपयोग करें।",
      fertilizer: "मिट्टी परीक्षण के आधार पर उर्वरक लगाएं। संतुलित NPK का उपयोग करें।",
      general: "क्षमा करें, मैं अभी जुड़ नहीं पा रहा। बाद में पुनः प्रयास करें।"
    },
    or: {
      greeting: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର କୃଷି ସହାୟକ। କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
      crop: "ଫସଲ ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନ ପାଇଁ ସ୍ଥାନୀୟ ବିଶେଷଜ୍ଞଙ୍କ ସହ ପରାମର୍ଶ ନିଅନ୍ତୁ।",
      weather: "ଖେତି ପାଇଁ ପାଣିପାଗ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ସ୍ଥାନୀୟ ପୂର୍ବାନୁମାନ ଯାଞ୍ଚ କରନ୍ତୁ।",
      pest: "କୀଟ ନିୟନ୍ତ୍ରଣ ପାଇଁ ଏକୀକୃତ ପ୍ରଥା ବ୍ୟବହାର କରନ୍ତୁ।",
      soil: "ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ନିୟମିତ ପରୀକ୍ଷା କରନ୍ତୁ।",
      irrigation: "ଉପଯୁକ୍ତ ଜଳ ପରିଚାଳନା ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ।",
      fertilizer: "ମାଟି ପରୀକ୍ଷା ଆଧାରରେ ସାର ପ୍ରୟୋଗ କରନ୍ତୁ।",
      general: "କ୍ଷମା କରନ୍ତୁ, ମୁଁ ସଂଯୋଗ କରିପାରିଲି ନାହିଁ। ପଛରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।"
    }
  };

  const responses = fallbackResponses[language] || fallbackResponses.en;
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('नमस्ते') || lowerMsg.includes('ନମସ୍କାର')) return responses.greeting;
  if (lowerMsg.includes('crop') || lowerMsg.includes('फसल') || lowerMsg.includes('ଫସଲ')) return responses.crop;
  if (lowerMsg.includes('weather') || lowerMsg.includes('मौसम') || lowerMsg.includes('ପାଣିପାଗ')) return responses.weather;
  if (lowerMsg.includes('pest') || lowerMsg.includes('कीट') || lowerMsg.includes('କୀଟ')) return responses.pest;
  if (lowerMsg.includes('soil') || lowerMsg.includes('मिट्टी') || lowerMsg.includes('ମାଟି')) return responses.soil;
  if (lowerMsg.includes('water') || lowerMsg.includes('irrigation') || lowerMsg.includes('सिंचाई') || lowerMsg.includes('ଜଳସେଚନ')) return responses.irrigation;
  if (lowerMsg.includes('fertilizer') || lowerMsg.includes('उर्वरक') || lowerMsg.includes('ସାର')) return responses.fertilizer;

  return responses.general;
};

// Simplified functions to get advice
export const getCropAdvice = async (cropData) => sendMessageToChatbot(
  `Advice for growing ${cropData.crop} in ${cropData.district}.`,
  { ...cropData }
);

export const getWeatherBasedAdvice = async (weatherData, cropInfo) => sendMessageToChatbot(
  `Current weather: ${weatherData.condition}, ${weatherData.temperature}°C, humidity ${weatherData.humidity}%. What should I do for ${cropInfo.crop}?`,
  { ...cropInfo, weather: weatherData }
);