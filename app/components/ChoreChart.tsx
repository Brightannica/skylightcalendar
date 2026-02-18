import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, User } from 'lucide-react';

interface Chore {
  id: number;
  title: string;
  assignee: string;
  completed: boolean;
  points: number;
}

export default function ChoreChart({ initialChores }: { initialChores: Chore[] }) {
  const [chores, setChores] = useState<Chore[]>(initialChores);
  const [newChoreTitle, setNewChoreTitle] = useState('');
  const [newChoreAssignee, setNewChoreAssignee] = useState('Kids');

  const toggleChore = (id: number) => {
    setChores(chores.map(c =>
      c.id === id ? { ...c, completed: !c.completed } : c
    ));
  };

  const addChore = () => {
    if (!newChoreTitle.trim()) return;
    const newChore: Chore = {
      id: Date.now(),
      title: newChoreTitle,
      assignee: newChoreAssignee,
      completed: false,
      points: 5
    };
    setChores([...chores, newChore]);
    setNewChoreTitle('');
  };

  const deleteChore = (id: number) => {
    setChores(chores.filter(c => c.id !== id));
  };

  // Group chores by assignee
  const groupedChores = chores.reduce((acc, chore) => {
    if (!acc[chore.assignee]) acc[chore.assignee] = [];
    acc[chore.assignee].push(chore);
    return acc;
  }, {} as Record<string, Chore[]>);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm h-full p-8 border border-slate-200 overflow-hidden flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <CheckSquare className="text-blue-500" size={32} />
          Chore Chart
        </h2>
        <div className="flex gap-2">
           <input
              type="text"
              placeholder="Add new chore..."
              value={newChoreTitle}
              onChange={(e) => setNewChoreTitle(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-slate-700"
              onKeyDown={(e) => e.key === 'Enter' && addChore()}
            />
             <select
              value={newChoreAssignee}
              onChange={(e) => setNewChoreAssignee(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-600 appearance-none"
            >
              <option value="Kids">Kids</option>
              <option value="Mom">Mom</option>
              <option value="Dad">Dad</option>
            </select>
            <button onClick={addChore} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <Plus size={24} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4">
        {Object.entries(groupedChores).map(([assignee, assigneeChores]) => (
          <div key={assignee} className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex flex-col h-full shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{assignee}</h3>
                  <p className="text-slate-400 text-sm font-medium">{assigneeChores.filter(c => c.completed).length} / {assigneeChores.length} Done</p>
                </div>
             </div>

             <div className="space-y-3">
               {assigneeChores.map((chore) => (
                 <div
                    key={chore.id}
                    className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                      chore.completed
                        ? 'bg-blue-50 border-blue-100'
                        : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleChore(chore.id)}>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        chore.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 text-transparent'
                      }`}>
                         <CheckSquare size={16} strokeWidth={3} />
                      </div>
                      <span className={`text-lg font-bold transition-all ${chore.completed ? 'text-blue-800 line-through opacity-60' : 'text-slate-700'}`}>
                        {chore.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${chore.completed ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                        {chore.points} pts
                      </span>
                      <button onClick={() => deleteChore(chore.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
