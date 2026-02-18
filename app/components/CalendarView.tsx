import React, { useState } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ChevronLeft, ChevronRight, Share2, Plus } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events: any[];
  setEvents: (events: any[]) => void;
  setShowSharePopup: (show: boolean) => void;
  setEditingEvent: (event: any) => void;
}

export default function CalendarView({ events, setEvents, setShowSharePopup, setEditingEvent }: CalendarViewProps) {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const handleNavigate = (newDate: Date) => setDate(newDate);
  const handleViewChange = (newView: View) => setView(newView);

  const handleDrillDown = (date: Date) => {
    setDate(date);
    setView('day');
  };

  const handleSelectSlot = ({ start, end }: any) => {
    setEditingEvent({ title: '', start, end });
  };

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span className="text-3xl font-bold text-slate-800 tracking-tight">
          {date.format('MMMM YYYY')}
        </span>
      );
    };

    return (
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button onClick={goToBack} className="p-3 hover:bg-slate-100 rounded-full text-slate-600 transition">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <button onClick={goToCurrent} className="px-4 py-2 hover:bg-slate-100 rounded-xl font-bold text-slate-600 text-sm border border-slate-200 uppercase tracking-wider transition">
              Today
            </button>
            <button onClick={goToNext} className="p-3 hover:bg-slate-100 rounded-full text-slate-600 transition">
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>
          {label()}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSharePopup(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition border border-blue-100 shadow-sm"
          >
            <Share2 size={18} />
            <span className="text-sm">Sync</span>
          </button>

          <div className="flex bg-slate-100 p-1.5 rounded-xl shadow-inner">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                onClick={() => handleViewChange(v as View)}
                className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${
                  view === v
                    ? 'bg-white text-slate-800 shadow-md transform scale-105'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

           <button
            onClick={() => setEditingEvent({ title: '', start: new Date(), end: new Date() })}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm h-full p-6 border border-slate-200 overflow-hidden flex flex-col relative">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        onSelectEvent={(e) => setEditingEvent(e)}
        onDrillDown={handleDrillDown}
        selectable
        onSelectSlot={handleSelectSlot}
        components={{
          toolbar: CustomToolbar,
        }}
        className="custom-calendar font-sans text-slate-600"
      />
      <style jsx global>{`
        .rbc-calendar { font-family: inherit; }
        .rbc-header { padding: 12px 4px; font-weight: 700; color: #64748b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0; }
        .rbc-month-view { border: none; }
        .rbc-day-bg { border-left: 1px solid #f1f5f9; }
        .rbc-off-range-bg { background: #f8fafc; }
        .rbc-today { background: #eff6ff; }
        .rbc-event { background-color: #3b82f6; border: none; border-radius: 6px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3); padding: 4px 8px; font-weight: 600; font-size: 0.85rem; }
        .rbc-event.rbc-selected { background-color: #2563eb; }
        .rbc-current-time-indicator { background-color: #ef4444; height: 2px; }
      `}</style>
    </div>
  );
}
