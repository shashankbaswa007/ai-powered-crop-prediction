import React, { useState, useEffect, createContext, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('dashboard');
  const [language, setLanguage] = useState('en');
  const [userId, setUserId] = useState('demo-user-' + Math.random().toString(36).substr(2, 9));
  const [userFarms, setUserFarms] = useState([]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Save to localStorage and apply class to html element
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const addNewFarm = (farmData) => {
    const newFarm = { 
      id: Date.now().toString(), 
      ...farmData, 
      createdAt: new Date() 
    };
    setUserFarms(prev => [...prev, newFarm]);
    return newFarm;
  };

  const savePrediction = (predictionData) => {
    console.log('📊 Prediction saved:', predictionData);
    return 'prediction-' + Date.now();
  };

  const value = { 
    theme, 
    toggleTheme, 
    view, 
    setView, 
    language, 
    setLanguage, 
    userId, 
    userFarms,
    addNewFarm,
    savePrediction
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};