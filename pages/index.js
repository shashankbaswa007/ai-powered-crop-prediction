import React from 'react';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import PredictionForm from '../components/PredictionForm';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const { theme, view, isAuthReady, userId } = useAppContext();

  if (!isAuthReady) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl">Initializing Smart Farmer AI Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme}`}>
      <Navbar />
      {view === 'dashboard' && <Dashboard />}
      {view === 'predict' && <PredictionForm />}
      {view === 'chatbot' && <Chatbot />}
    </div>
  );
};

export default Home;