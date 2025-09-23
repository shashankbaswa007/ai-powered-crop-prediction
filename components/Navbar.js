import React from 'react';
import { useAppContext } from '../context/AppContext';
import { i18n } from '../data/i18n';

const Navbar = () => {
  const { theme, toggleTheme, setView, language, setLanguage, userId } = useAppContext();
  const t = i18n[language];

  return (
    <nav className={`fixed w-full top-0 z-50 p-4 shadow-lg transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-dark-800 border-b border-dark-700 text-white' 
        : 'bg-white border-b border-gray-200 text-gray-900'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setView('dashboard')} 
            className="flex items-center text-2xl font-bold transition-all duration-300 hover:scale-105"
          >
            <span className="text-3xl mr-2">🌾</span>
            <span className="hidden sm:inline-block">{t.appTitle}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              theme === 'dark' 
                ? 'hover:bg-dark-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            🏠 {t.home}
          </button>
          
          <button
            onClick={() => setView('predict')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              theme === 'dark' 
                ? 'hover:bg-dark-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            📊 {t.predict}
          </button>
          
          <button
            onClick={() => setView('chatbot')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              theme === 'dark' 
                ? 'hover:bg-dark-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            🤖 {t.chatbot}
          </button>
          
          <select
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            className={`px-3 py-2 rounded-lg border transition-all duration-300 font-medium ${
              theme === 'dark' 
                ? 'bg-dark-700 border-dark-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="en">🇺🇸 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="or">🇮🇳 ଓଡ଼ିଆ</option>
          </select>
          
          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              theme === 'dark' 
                ? 'hover:bg-dark-700' 
                : 'hover:bg-gray-100'
            }`}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;