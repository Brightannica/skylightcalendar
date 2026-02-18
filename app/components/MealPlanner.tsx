import React, { useState } from 'react';
import { Utensils, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export default function MealPlanner({ initialMeals }: { initialMeals: MealDay[] }) {
  const [meals, setMeals] = useState<MealDay[]>(initialMeals);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const currentDay = meals[activeDayIndex];

  const handlePrev = () => setActiveDayIndex((prev) => (prev === 0 ? meals.length - 1 : prev - 1));
  const handleNext = () => setActiveDayIndex((prev) => (prev === meals.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm h-full p-8 border border-slate-200 overflow-hidden flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <Utensils className="text-orange-500" size={32} />
          Weekly Meal Plan
        </h2>

        <div className="flex items-center gap-4">
           <button onClick={handlePrev} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition shadow-sm border border-slate-200">
             <ChevronLeft size={24} />
           </button>
           <span className="text-xl font-bold text-slate-700 w-32 text-center">{currentDay.day}</span>
           <button onClick={handleNext} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition shadow-sm border border-slate-200">
             <ChevronRight size={24} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-4">
        {['Breakfast', 'Lunch', 'Dinner'].map((type) => (
          <div key={type} className={`relative overflow-hidden rounded-[2.5rem] p-8 flex flex-col justify-between border-2 transition-all duration-300 group hover:shadow-xl
            ${type === 'Dinner' ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'}
          `}>
             <div className={`absolute top-0 right-0 p-6 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-110 transition duration-500 ${type === 'Dinner' ? 'text-orange-500' : 'text-slate-400'}`}>
               <Utensils size={120} />
             </div>

             <div>
               <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${type === 'Dinner' ? 'text-orange-400' : 'text-slate-400'}`}>
                 <Clock size={16} /> {type}
               </h3>
               <textarea
                 className={`w-full bg-transparent text-3xl font-black leading-tight resize-none focus:outline-none placeholder-slate-300 transition-colors ${
                    type === 'Dinner' ? 'text-orange-900 placeholder-orange-200' : 'text-slate-800'
                 }`}
                 rows={3}
                 value={(currentDay as any)[type.toLowerCase()]}
                 onChange={(e) => {
                   const newMeals = [...meals];
                   (newMeals[activeDayIndex] as any)[type.toLowerCase()] = e.target.value;
                   setMeals(newMeals);
                 }}
               />
             </div>

             <div className={`mt-auto pt-6 border-t ${type === 'Dinner' ? 'border-orange-200' : 'border-slate-200'}`}>
                <p className={`text-xs font-bold ${type === 'Dinner' ? 'text-orange-400' : 'text-slate-400'}`}>
                  Tap to edit
                </p>
             </div>
          </div>
        ))}
      </div>

      {/* Mini Week View */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {meals.map((meal, index) => (
          <button
            key={meal.day}
            onClick={() => setActiveDayIndex(index)}
            className={`flex-1 min-w-[100px] p-4 rounded-2xl border text-center transition-all duration-200 ${
              index === activeDayIndex
                ? 'bg-slate-800 text-white shadow-lg transform -translate-y-1'
                : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">{meal.day.substring(0, 3)}</span>
            <span className="text-lg font-bold truncate block opacity-80">{meal.dinner.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
