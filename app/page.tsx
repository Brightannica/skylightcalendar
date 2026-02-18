"use client";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Image as ImageIcon, Maximize2, Moon } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import DashboardView from './components/DashboardView';
import ChoreChart from './components/ChoreChart';
import MealPlanner from './components/MealPlanner';
import GroceryList from './components/GroceryList';
import PhotoFrame from './components/PhotoFrame';
import WeatherWidget from './components/WeatherWidget';
import Settings from './components/Settings';
import Auth from './components/Auth';
import EventModal from './components/EventModal';

// Mock Data
import { MOCK_EVENTS, MOCK_CHORES, MOCK_MEALS, MOCK_GROCERIES, MOCK_WEATHER, MOCK_SETTINGS } from './lib/mockData';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data State
  const [events, setEvents] = useState<any[]>(MOCK_EVENTS);
  
  // Popups
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Check LocalStorage for user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('skylight_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchEventsList = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/events?userId=${user.id}`);
      if (res.ok) {
         const data = await res.json();
         if (Array.isArray(data)) {
           const formatted = data.map((e: any) => ({
             id: e.id,
             title: e.title || e.summary || 'No Title',
             start: new Date(e.start),
             end: new Date(e.end),
             allDay: e.allDay,
             guests: e.guests,
           }));
           setEvents(formatted);
         }
      }
    } catch (err) { console.log("Using mock events", err); }
  };

  // Fetch real events if available
  useEffect(() => {
    fetchEventsList();
  }, [user]);

  const handleLogin = (loggedInUser: any) => {
    setUser(loggedInUser);
    localStorage.setItem('skylight_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skylight_user');
    setEvents(MOCK_EVENTS);
  };

  const handleSaveEvent = async (eventData: any) => {
    if (!user) return;
    try {
      const method = eventData.id ? 'PUT' : 'POST';
      const body = {
        ...eventData,
        ownerId: user.id,
      };

      const res = await fetch('/api/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchEventsList();
        setEditingEvent(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
     if (!user) return;
     try {
       const res = await fetch(`/api/events?id=${eventId}&userId=${user.id}`, {
         method: 'DELETE',
       });
       if (res.ok) {
         await fetchEventsList();
         setEditingEvent(null);
       }
     } catch (err) {
       console.error(err);
     }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView
                  events={events}
                  setEvents={setEvents}
                  setShowSharePopup={setShowSharePopup}
                  setEditingEvent={setEditingEvent}
               />;
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
        return <DashboardView events={events} setEvents={setEvents} setShowSharePopup={setShowSharePopup} setEditingEvent={setEditingEvent} />;
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

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
                 <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm text-slate-500 font-bold">Hello, {user.username}</p>
                 </div>
              </div>
              <div className="flex gap-4 items-center">
                 <button
                   onClick={handleLogout}
                   className="px-5 py-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl font-bold transition text-xs uppercase tracking-wide"
                 >
                   Logout
                 </button>
                 <button
                   onClick={() => setIsPhotoMode(true)}
                   className="p-4 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition"
                   title="Sleep / Photo Mode"
                 >
                   <Moon size={24} />
                 </button>
              </div>
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

      <EventModal
         isOpen={!!editingEvent}
         onClose={() => setEditingEvent(null)}
         event={editingEvent}
         onSave={handleSaveEvent}
         onDelete={handleDeleteEvent}
      />
    </div>
  );
}
