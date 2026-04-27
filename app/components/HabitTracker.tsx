"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function HabitTracker() {
  const [habits, setHabits] = useState([
    { id: 1, name: "Read 10 pages", completed: false },
    { id: 2, name: "Review flashcards", completed: true },
    { id: 3, name: "Drink water", completed: false },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">Daily Habits</h3>
      <div className="space-y-3">
        {habits.map(habit => (
          <div
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 cursor-pointer transition group"
          >
            <span className={`font-medium ${habit.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
              {habit.name}
            </span>
            {habit.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
            ) : (
              <Circle className="w-6 h-6 text-gray-300 group-hover:text-blue-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
