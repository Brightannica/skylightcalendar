"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Utensils, CheckSquare, CloudSun, Share2, X, Copy, Check, Loader2, Save } from 'lucide-react';

const localizer = momentLocalizer(moment);

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  
  // Popups State
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- CONFIGURATION ---
  // Paste your Service Account Email here so it shows up in the "Sync" popup
  const ROBOT_EMAIL = "skylight@skylight-487615.iam.gserviceaccount.com"; 

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (Array.isArray(data)) {
        const formatted = data.map((e: any) => ({
          id: e.id,
          title: e.summary || 'No Title',
          start: new Date(e.start.dateTime || e.start.date),
          end: new Date(e.end.dateTime || e.end.date),
          allDay: !e.start.dateTime,
        }));
        setEvents(formatted);
      }
    } catch (err) { console.error("Sync error", err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  // Save Event Changes
  const handleSaveEvent = async () => {
    if (!editingEvent) return;
    setIsSaving(true);
    try {
      await fetch('/api/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: editingEvent.id,
          title: editingEvent.title,
          start: editingEvent.start,
          end: editingEvent.end
        })
      });
      await fetchEvents(); // Refresh data
      setEditingEvent(null);
    } catch (e) {
      alert("Failed to save. Did you give the robot 'Make Changes' permission?");
    }
    setIsSaving(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
        <div className="p-8 flex flex-col h-full gap-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Family</h1>
            <p className="text-slate-400 font-medium text-lg">Command Center</p>
          </div>

          <button 
            onClick={() => setShowSharePopup(true)}
            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-2xl font-bold border border-blue-100 hover:bg-blue-100 transition"
          >
            <Share2 size={18} /> Sync Calendar
          </button>

          {/* Weather & Info */}
          <div className="bg-blue-50 p-6 rounded-3xl flex items-center justify-between border border-blue-100">
            <div>
              <span className="text-5xl font-bold text-blue-900">72°</span>
              <p className="text-blue-600 font-medium mt-1">Sunny</p>
            </div>
            <CloudSun size={48} className="text-blue-500" />
          </div>
          
           <div className="flex-1 space-y-8">
            <div>
              <h3 className="flex items-center gap-2 font-bold text-slate-400 mb-4 uppercase text-xs tracking-wider">
                <Utensils size={16} /> Dinner
              </h3>
              <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="font-bold text-xl text-orange-900">Taco Tuesday 🌮</p>
              </div>
            </div>
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

      {/* CALENDAR */}
      <main className="flex-1 p-6 h-full">
        <div className="bg-white rounded-[2rem] shadow-sm h-full p-6 border border-slate-200 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="text-3xl font-bold text-slate-800">{moment(date).format('MMMM YYYY')}</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {['month', 'week', 'day'].map((v) => (
                <button key={v} onClick={() => setView(v as View)} className={`px-6 py-2 rounded-lg text-sm font-bold capitalize ${view === v ? 'bg-white shadow' : 'text-slate-400'}`}>{v}</button>
              ))}
            </div>
          </div>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            view={view}
            date={date}
            onNavigate={setDate}
            onView={setView}
            onSelectEvent={(e) => setEditingEvent(e)}
            toolbar={false}
          />
        </div>
      </main>

      {/* --- SETUP WIZARD POPUP --- */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 relative">
            <button onClick={() => setShowSharePopup(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Connect Calendar</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">1. Copy Robot Email</p>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono flex-1 truncate">{ROBOT_EMAIL}</code>
                  <button onClick={() => { navigator.clipboard.writeText(ROBOT_EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">2. Share in Google Calendar</p>
                <p className="text-sm text-slate-600">Go to <b>Settings & Sharing</b> for your calendar. Add the email above under "Share with specific people".</p>
              </div>
               <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 text-sm">
                <strong>Important for Editing:</strong> Select <u>"Make changes to events"</u> permission if you want to edit events from this dashboard.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT EVENT POPUP --- */}
      {editingEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setEditingEvent(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Edit Event</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Event Name</label>
                <input 
                  value={editingEvent.title} 
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">Start</label>
                    <input type="datetime-local" 
                      value={moment(editingEvent.start).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e) => setEditingEvent({...editingEvent, start: new Date(e.target.value)})}
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">End</label>
                    <input type="datetime-local" 
                       value={moment(editingEvent.end).format('YYYY-MM-DDTHH:mm')}
                       onChange={(e) => setEditingEvent({...editingEvent, end: new Date(e.target.value)})}
                       className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm"
                    />
                 </div>
              </div>
              
              <button 
                onClick={handleSaveEvent} 
                disabled={isSaving}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}