import React from 'react';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';            // default export
import Dashboard from '../components/Dashboard';     // default export
import PredictionForm from '../components/PredictionForm'; // default export
// Home (index.js) should have)
import Card from '../components/Card';
import Chatbot from '../components/Chatbot';         // default export

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