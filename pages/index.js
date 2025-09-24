// pages/index.js
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import Chatbot from '../components/Chatbot';
import Dashboard from '../components/Dashboard';

const Home = () => {
  const { theme } = useAppContext();

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-5xl font-bold mb-2">Welcome to Smart Farming Hub</h1>
          <p className="text-lg opacity-75">Get personalized farming advice powered by AI</p>
        </header>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Crop Recommendations" icon="🌾">
            <p>Get the best practices for your crops based on area, season, and district.</p>
          </Card>
          <Card title="Weather-based Advice" icon="☀️">
            <p>Receive farming suggestions according to the current weather conditions.</p>
          </Card>
          <Card title="Pest & Fertilizer Tips" icon="🐞">
            <p>Learn about integrated pest management and optimal fertilizer usage.</p>
          </Card>
        </div>

        {/* Dashboard */}
        <Dashboard />

        {/* Chatbot */}
        <Chatbot />

      </div>
    </div>
  );
};

export default Home;