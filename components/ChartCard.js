import React from 'react';
import { useAppContext } from '../context/AppContext';

const ChartCard = ({ title, data, xAxisKey, yAxisKey, color }) => {
  const { theme } = useAppContext();
  
  const maxValue = Math.max(...data.map(d => d[yAxisKey]));
  
  return (
    <div className={`p-4 rounded-2xl shadow-lg transition-colors duration-300
      ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div className="w-full h-48 flex justify-center items-center">
        <div className="w-full h-full flex items-end justify-around p-2 space-x-1">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${(point[yAxisKey] / maxValue) * 100}%`,
                  backgroundColor: color,
                  minHeight: '20px'
                }}
                title={`${point[xAxisKey]}: ${point[yAxisKey]}`}
              ></div>
              <span className="mt-2 text-xs">{point[xAxisKey]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;