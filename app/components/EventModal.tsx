import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, UserPlus, Trash2 } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSave: (event: any) => void;
  onDelete: (eventId: string) => void;
}

export default function EventModal({ isOpen, onClose, event, onSave, onDelete }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [guests, setGuests] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      // Format date for datetime-local input: YYYY-MM-DDTHH:mm
      const formatDate = (d: Date) => {
        if (!d) return '';
        const offset = d.getTimezoneOffset() * 60000;
        const local = new Date(d.getTime() - offset);
        return local.toISOString().slice(0, 16);
      };
      setStart(formatDate(event.start));
      setEnd(formatDate(event.end));
      setGuests(event.guests ? event.guests.join(', ') : '');
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...event,
      title,
      start: new Date(start),
      end: new Date(end),
      guests: guests.split(',').map(g => g.trim()).filter(g => g),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {event?.id ? 'Edit Event' : 'New Event'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wide">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-400 transition-all text-lg"
              placeholder="e.g. Dinner with Mom"
              required
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                 <Calendar size={14} /> Start
              </label>
              <input
                type="datetime-local"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-blue-100 outline-none font-bold text-slate-600"
                required
              />
            </div>
             <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                 <Clock size={14} /> End
              </label>
              <input
                type="datetime-local"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-blue-100 outline-none font-bold text-slate-600"
                required
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
               <UserPlus size={14} /> Guests (Usernames)
            </label>
            <input
              type="text"
              value={guests}
              onChange={e => setGuests(e.target.value)}
              className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-400 transition-all"
              placeholder="alice, bob, charlie"
            />
            <p className="text-xs text-slate-400 font-medium ml-1">Separate usernames with commas to invite them.</p>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
            {event?.id && (
               <button
                 type="button"
                 onClick={() => onDelete(event.id)}
                 className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition flex items-center gap-2"
               >
                 <Trash2 size={20} /> Delete
               </button>
            )}
            <div className="flex-1"></div>
            <button
               type="button"
               onClick={onClose}
               className="px-6 py-4 text-slate-500 font-bold hover:text-slate-700 transition"
            >
               Cancel
            </button>
            <button
               type="submit"
               className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
               Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
