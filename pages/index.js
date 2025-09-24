import React from 'react';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import PredictionForm from '../components/PredictionForm';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const { theme, view } = useAppContext();

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