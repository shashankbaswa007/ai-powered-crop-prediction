import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Navbar } from '../components/Navbar';               // named import
import { Dashboard } from '../components/Dashboard';         // named import
import { PredictionForm } from '../components/PredictionForm'; // named import
import { Chatbot } from '../components/Chatbot';             // named import

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