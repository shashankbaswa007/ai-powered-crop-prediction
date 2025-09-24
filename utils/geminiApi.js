const CHATBOT_API_URL = 'https://agrigem-1.onrender.com/ask'; // correct endpoint

export const sendMessageToChatbot = async (message, context = {}) => {
  try {
    const payload = { question: message }; // matches /ask API

    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Chatbot API error: ${response.status}`);

    const data = await response.json();

    return {
      success: true,
      message: data.answer || data.response || 'I received your message but couldn\'t generate a proper response.',
      timestamp: new Date()
    };

  } catch (error) {
    console.error('Error calling chatbot API:', error);

    return {
      success: false,
      message: "I apologize, but I'm experiencing technical difficulties. Please try again later.",
      error: error.message,
      timestamp: new Date()
    };
  }
};

// Crop-specific advice via /recommend endpoint
export const getCropAdvice = async (cropData) => {
  try {
    const payload = {
      crop: cropData.crop,
      area: cropData.area,
      target_yield: cropData.target_yield || null
    };

    const response = await fetch('https://agrigem-1.onrender.com/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Chatbot API error: ${response.status}`);

    const data = await response.json();
    return { success: true, message: data.recommendation || '', timestamp: new Date() };

  } catch (error) {
    console.error('Error calling recommendation API:', error);
    return {
      success: false,
      message: "Could not fetch crop recommendation. Please try again later.",
      error: error.message,
      timestamp: new Date()
    };
  }
};