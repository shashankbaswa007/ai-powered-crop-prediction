import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { i18n } from '../data/i18n';

const Chatbot = () => {
  const { theme, language } = useAppContext();
  const t = i18n[language];
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Smart Farmer AI Assistant. How can I help you with your farming questions today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponses = {
        en: [
          "Based on current weather patterns, I recommend checking soil moisture levels before irrigation.",
          "For better yield, consider using organic fertilizers and proper crop rotation techniques.",
          "Monitor your crops regularly for signs of pests and diseases. Early detection is key!",
          "The optimal planting time for your region is approaching. Prepare your fields accordingly."
        ],
        hi: [
          "वर्तमान मौसम पैटर्न के आधार पर, मैं सिंचाई से पहले मिट्टी की नमी के स्तर की जांच करने की सलाह देता हूं।",
          "बेहतर उपज के लिए, जैविक उर्वरकों और उचित फसल चक्र तकनीकों का उपयोग करने पर विचार करें।",
          "कीटों और बीमारियों के लक्षणों के लिए अपनी फसलों की नियमित निगरानी करें। शीघ्र पता लगाना महत्वपूर्ण है!",
          "आपके क्षेत्र के लिए इष्टतम रोपण का समय निकट आ रहा है। तदनुसार अपने खेतों को तैयार करें।"
        ],
        or: [
          "ବର୍ତ୍ତମାନର ପାଣିପାଗ ପ୍ୟାଟର୍ନ ଉପରେ ଆଧାର କରି, ଜଳସେଚନ ପୂର୍ବରୁ ମାଟିର ଆର୍ଦ୍ରତା ସ୍ତର ଯାଞ୍ଚ କରିବାକୁ ମୁଁ ପରାମର୍ଶ ଦେଉଛି।",
          "ଉନ୍ନତ ଉତ୍ପାଦନ ପାଇଁ, ଜୈବିକ ସାର ଏବଂ ଉପଯୁକ୍ତ ଫସଲ ଆବର୍ତ୍ତନ କୌଶଳ ବ୍ୟବହାର କରିବାକୁ ବିଚାର କରନ୍ତୁ।",
          "କୀଟପତଙ୍ଗ ଏବଂ ରୋଗର ଚିହ୍ନ ପାଇଁ ନିୟମିତ ଭାବରେ ଆପଣଙ୍କ ଫସଲଗୁଡିକ ମନିଟର୍ କରନ୍ତୁ। ପ୍ରାରମ୍ଭିକ ଚିହ୍ନଟ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ!",
          "ଆପଣଙ୍କ ଅଞ୍ଚଳ ପାଇଁ ଅନୁକୂଳ ରୋପଣ ସମୟ ନିକଟତର ହେଉଛି। ତଦନୁସାରେ ଆପଣଙ୍କ କ୍ଷେତ୍ରଗୁଡିକ ପ୍ରସ୍ତୁତ କରନ୍ତୁ।"
        ]
      };

      const botMessage = {
        id: messages.length + 2,
        text: botResponses[language][Math.floor(Math.random() * botResponses[language].length)],
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "Best time to plant rice?",
    "How to control pests?",
    "Soil preparation tips",
    "Water management advice"
  ];

  return (
    <div className={`p-8 pt-20 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t.chatWithAI}
        </h1>
        <p className="text-lg text-center mb-8 opacity-75">Get instant farming advice from AI</p>

        <div className={`rounded-2xl shadow-xl h-[600px] flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold">Smart Farmer AI</h3>
                <p className="text-sm opacity-90">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-none p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your farming question..."
                className="flex-1 p-3 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;