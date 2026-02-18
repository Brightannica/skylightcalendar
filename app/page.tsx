"use client";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Image as ImageIcon, Maximize2, Moon } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import ChoreChart from './components/ChoreChart';
import MealPlanner from './components/MealPlanner';
import GroceryList from './components/GroceryList';
import PhotoFrame from './components/PhotoFrame';
import WeatherWidget from './components/WeatherWidget';
import Settings from './components/Settings';

// Mock Data
import { MOCK_EVENTS, MOCK_CHORES, MOCK_MEALS, MOCK_GROCERIES, MOCK_WEATHER, MOCK_SETTINGS } from './lib/mockData';

export default function Home() {
  const [activeView, setActiveView] = useState('calendar');
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data State
  const [events, setEvents] = useState<any[]>(MOCK_EVENTS);
  
  // Popups (Calendar specific, but lifted up for global access if needed)
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real events if available (keeping original logic as optional enhancement)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
           const data = await res.json();
           if (Array.isArray(data) && data.length > 0) {
             const formatted = data.map((e: any) => ({
               id: e.id,
               title: e.summary || 'No Title',
               start: new Date(e.start.dateTime || e.start.date),
               end: new Date(e.end.dateTime || e.end.date),
               allDay: !e.start.dateTime,
             }));
             setEvents(formatted);
           }
        }
      } catch (err) { console.log("Using mock events"); }
    };
    fetchEvents();
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'calendar':
        return <CalendarView
                  events={events}
                  setEvents={setEvents}
                  setShowSharePopup={setShowSharePopup}
                  setEditingEvent={setEditingEvent}
               />;
      case 'chores':
        return <ChoreChart initialChores={MOCK_CHORES} />;
      case 'meals':
        return <MealPlanner initialMeals={MOCK_MEALS} />;
      case 'grocery':
        return <GroceryList initialGroceries={MOCK_GROCERIES} />;
      case 'photos':
        // If they click the sidebar tab, we can either show a gallery or just launch the frame mode.
        // Let's launch frame mode for now.
        return (
           <div className="flex flex-col items-center justify-center h-full bg-slate-50 rounded-[2.5rem] border border-slate-200">
              <ImageIcon size={64} className="text-slate-300 mb-4" />
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Photo Frame Mode</h2>
              <button
                onClick={() => setIsPhotoMode(true)}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                <Maximize2 size={20} /> Start Slideshow
              </button>
           </div>
        );
      case 'settings':
        return <Settings initialSettings={MOCK_SETTINGS} />;
      default:
        return <CalendarView events={events} setEvents={setEvents} setShowSharePopup={setShowSharePopup} setEditingEvent={setEditingEvent} />;
    }
  };

  if (isPhotoMode) {
    return <PhotoFrame onExit={() => setIsPhotoMode(false)} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-100 text-slate-800 overflow-hidden font-sans p-4 gap-4 selection:bg-blue-100 selection:text-blue-900">
      
      {/* SIDEBAR */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">

        {/* HEADER BAR */}
        <header className="flex justify-between items-stretch h-32 gap-4">
           {/* Greeting & Time */}
           <div className="flex-1 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                 <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                    {moment(currentTime).format('h:mm A')}
                 </h1>
                 <p className="text-slate-400 font-bold text-lg uppercase tracking-wider mt-1">
                    {moment(currentTime).format('dddd, MMMM Do')}
                 </p>
              </div>
              <button 
                 onClick={() => setIsPhotoMode(true)}
                 className="p-4 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition"
                 title="Sleep / Photo Mode"
              >
                 <Moon size={24} />
              </button>
           </div>

           {/* Weather Widget (Top Right) */}
           <div className="w-80">
              <WeatherWidget weather={MOCK_WEATHER} />
           </div>
        </header>

        {/* ACTIVE CONTENT */}
        <main className="flex-1 overflow-hidden relative">
           {renderContent()}
        </main>
      </div>

    </div>
  );
}
