"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Pomodoro from "./components/Pomodoro";
import HabitTracker from "./components/HabitTracker";
import FoxMascot from "./components/FoxMascot";
import EventModal from "./components/EventModal";
import { Plus } from "lucide-react";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

export default function Home() {
  const { data: session, status } = useSession();
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = () => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
          })));
        }
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchEvents();
    }
  }, [status]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Calendar</h1>
          <p className="text-gray-500 mb-8">Sign in to sync your schedule and study habits.</p>
          <button
            onClick={() => signIn("google")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Study Tools */}
      <aside className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col hidden lg:flex p-6 overflow-y-auto">
        <Pomodoro />
        <HabitTracker />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {moment(date).format("MMMM YYYY")}
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-sm transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['month', 'week', 'day', 'agenda'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  view === v ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 p-6 bg-white overflow-hidden">
          <div className="h-full rounded-xl border border-gray-200 shadow-sm overflow-hidden calendar-container">
            <style dangerouslySetInnerHTML={{__html: `
              .rbc-toolbar { display: none; }
              .rbc-header { padding: 12px 0; font-weight: 600; color: #4b5563; text-transform: uppercase; font-size: 0.75rem; border-bottom: 1px solid #e5e7eb; }
              .rbc-time-header.rbc-overflowing { border-right: none; }
              .rbc-time-view { border: none; }
              .rbc-day-slot .rbc-time-slot { border-top: 1px solid #f3f4f6; }
              .rbc-timeslot-group { border-bottom: 1px solid #e5e7eb; min-height: 60px; }
              .rbc-event { border-radius: 6px; padding: 4px 8px; border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
              .rbc-today { background-color: #f8fafc; }
              .rbc-time-gutter .rbc-timeslot-group { border-right: 1px solid #e5e7eb; color: #6b7280; font-size: 0.75rem; padding-right: 8px; text-align: right; }
            `}} />
            <Calendar
              localizer={localizer}
              events={events}
              view={view}
              date={date}
              onNavigate={(newDate) => setDate(newDate)}
              onView={(newView) => setView(newView)}
              startAccessor="start"
              endAccessor="end"
              className="text-gray-700"
            />
          </div>
        </div>

        <FoxMascot />
      </main>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
