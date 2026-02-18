import React from 'react';
import { CloudSun, CloudRain, Sun, Wind, Droplets, Thermometer } from 'lucide-react';

export default function WeatherWidget({ weather }: { weather: any }) {
  // Simple logic to show different icon based on condition (mocked)
  const getIcon = () => {
    switch(weather.condition) {
      case 'Rainy': return <CloudRain size={64} className="text-blue-400" />;
      case 'Sunny': return <Sun size={64} className="text-yellow-400" />;
      default: return <CloudSun size={64} className="text-orange-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden h-full flex flex-col justify-between">
      <div className="flex justify-between items-start z-10">
        <div>
          <h2 className="text-5xl font-black tracking-tighter">{weather.temp}°</h2>
          <p className="text-blue-100 font-bold text-lg mt-1">{weather.condition}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
           {getIcon()}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 z-10">
        <div className="flex flex-col items-center bg-white/10 rounded-xl p-2 backdrop-blur-sm">
           <Thermometer size={16} className="mb-1 opacity-70" />
           <span className="text-xs font-bold opacity-70">H:{weather.high}° L:{weather.low}°</span>
        </div>
        <div className="flex flex-col items-center bg-white/10 rounded-xl p-2 backdrop-blur-sm">
           <Droplets size={16} className="mb-1 opacity-70" />
           <span className="text-xs font-bold opacity-70">{weather.humidity}%</span>
        </div>
        <div className="flex flex-col items-center bg-white/10 rounded-xl p-2 backdrop-blur-sm">
           <Wind size={16} className="mb-1 opacity-70" />
           <span className="text-xs font-bold opacity-70">{weather.wind} mph</span>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300/20 rounded-full blur-xl -ml-12 -mb-12 pointer-events-none"></div>
    </div>
  );
}
