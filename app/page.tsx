"use client";
import React, { useState } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Utensils, CheckSquare, CloudSun } from 'lucide-react';

// Setup the Calendar Engine
const localizer = momentLocalizer(moment);

// Define types for our data
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

// --- FAKE DATA ---
const FAKE_EVENTS: CalendarEvent[] = [
  {
    title: 'Soccer Practice ⚽',
    start: new Date(moment().set({ hour: 17, minute: 0 }).toDate()),
    end: new Date(moment().set({ hour: 18, minute: 30 }).toDate()),
    color: '#10b981', // Green
  },
  {
    title: 'Date Night ❤️',
    start: new Date(moment().add(1, 'days').set({ hour: 19, minute: 0 }).toDate()),
    end: new Date(moment().add(1, 'days').set({ hour: 21, minute: 0 }).toDate()),
    color: '#ec4899', // Pink
  },
  {
    title: 'Trash Day 🗑️',
    start: new Date(moment().add(2, 'days').set({ hour: 7, minute: 0 }).toDate()),
    end: new Date(moment().add(2, 'days').set({ hour: 7, minute: 30 }).toDate()),
    color: '#3b82f6', // Blue
  }
];

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>(FAKE_EVENTS);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  // Style the events based on their color property
  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#3b82f6',
        borderRadius: '6px',
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.9rem',
        padding: '2px 5px',
      },
    };
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
        <div className="p-8 flex flex-col h-full gap-8">
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Family</h1>
            <p className="text-slate-400 font-medium text-lg">Command Center</p>
          </div>

          {/* Weather Widget */}
          <div className="bg-blue-50 p-6 rounded-3xl flex items-center justify-between border border-blue-100">
            <div>
              <span className="text-5xl font-bold text-blue-900">72°</span>
              <p className="text-blue-600 font-medium mt-1">Sunny</p>
            </div>
            <CloudSun size={48} className="text-blue-500" />
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-8">
            {/* Dinner */}
            <div>
              <h3 className="flex items-center gap-2 font-bold text-slate-400 mb-4 uppercase text-xs tracking-wider">
                <Utensils size={16} /> Dinner
              </h3>
              <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="font-bold text-xl text-orange-900">Taco Tuesday 🌮</p>
                <p className="text-sm text-orange-700 mt-1">Ground beef, salsa, guac</p>
              </div>
            </div>

            {/* Chores */}
            <div>
              <h3 className="flex items-center gap-2 font-bold text-slate-400 mb-4 uppercase text-xs tracking-wider">
                <CheckSquare size={16} /> Chores
              </h3>
              <ul className="space-y-3">
                {['Walk the dog', 'Empty dishwasher'].map((chore, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center"></div>
                    <span className="font-medium text-slate-600 text-lg">{chore}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* --- CALENDAR AREA --- */}
      <main className="flex-1 p-6 h-full">
        <div className="bg-white rounded-[2rem] shadow-sm h-full p-6 border border-slate-200 overflow-hidden flex flex-col">
          
          {/* Custom Toolbar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-6">
               <span className="text-3xl font-bold text-slate-800">
                 {moment(date).format('MMMM YYYY')}
               </span>
               <div className="flex gap-2">
                 <button onClick={() => setDate(moment(date).subtract(1, view === 'month' ? 'months' : 'weeks').toDate())} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">←</button>
                 <button onClick={() => setDate(new Date())} className="px-4 py-1 hover:bg-slate-100 rounded-full text-slate-500 font-medium">Today</button>
                 <button onClick={() => setDate(moment(date).add(1, view === 'month' ? 'months' : 'weeks').toDate())} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">→</button>
               </div>
            </div>
            
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {['month', 'week', 'day'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as View)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                    view === v ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* The Calendar */}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            view={view}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            onView={(newView) => setView(newView)}
            eventPropGetter={eventStyleGetter}
            toolbar={false}
          />
        </div>
      </main>
    </div>
  );
}