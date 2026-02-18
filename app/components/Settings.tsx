import React, { useState } from 'react';
import { Settings as SettingsIcon, Wifi, Sun, Volume2, RefreshCw, Smartphone } from 'lucide-react';

export default function Settings({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (key: string) => {
    // Just mock functionality
  };

  const handleSlider = (key: string, value: string) => {
    setSettings({ ...settings, [key]: parseInt(value) });
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm h-full p-8 border border-slate-200 overflow-hidden flex flex-col relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
           <SettingsIcon size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h2>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* WiFi */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                 <Wifi size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800">WiFi Network</h3>
                 <p className="text-sm text-slate-400 font-medium">{settings.wifi}</p>
              </div>
           </div>
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-sm hover:bg-slate-50">Change</button>
        </div>

        {/* Brightness */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-4 mb-4">
              <Sun size={24} className="text-orange-400" />
              <h3 className="font-bold text-slate-800">Display Brightness</h3>
              <span className="ml-auto font-bold text-slate-400">{settings.brightness}%</span>
           </div>
           <input
             type="range"
             min="0"
             max="100"
             value={settings.brightness}
             onChange={(e) => handleSlider('brightness', e.target.value)}
             className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
           />
        </div>

        {/* Volume */}
         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-4 mb-4">
              <Volume2 size={24} className="text-slate-600" />
              <h3 className="font-bold text-slate-800">Volume</h3>
              <span className="ml-auto font-bold text-slate-400">{settings.volume}%</span>
           </div>
           <input
             type="range"
             min="0"
             max="100"
             value={settings.volume}
             onChange={(e) => handleSlider('volume', e.target.value)}
             className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
           />
        </div>

        {/* Sync */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                 <RefreshCw size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800">Sync Frequency</h3>
                 <p className="text-sm text-slate-400 font-medium">Every {settings.syncFrequency} minutes</p>
              </div>
           </div>
           <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-sm hover:bg-slate-50 outline-none">
             <option>15 min</option>
             <option>30 min</option>
             <option>1 hour</option>
           </select>
        </div>

         {/* About Device */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-200 text-slate-600 rounded-xl">
                 <Smartphone size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800">Device Info</h3>
                 <p className="text-sm text-slate-400 font-medium">Skylight Calendar Model 150-CAL</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
