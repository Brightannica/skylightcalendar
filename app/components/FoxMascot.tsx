"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function FoxMascot() {
  const [showQuote, setShowQuote] = useState(false);

  const quotes = [
    "Stay focused, you got this!",
    "Remember to take short breaks.",
    "Consistency is key!",
    "Drink some water, friend.",
    "Small steps lead to big results."
  ];

  const [quote, setQuote] = useState(quotes[0]);

  const handleToggle = () => {
    if (!showQuote) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
    setShowQuote(!showQuote);
  };

  return (
    <div className="fixed bottom-6 right-6 flex items-end gap-4 z-50">
      {showQuote && (
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-orange-100 mb-4 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-gray-700 font-medium">{quote}</p>
        </div>
      )}

      <button
        onClick={handleToggle}
        className="group relative flex items-center justify-center transition-transform hover:-translate-y-1"
      >
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageCircle className="w-4 h-4 text-orange-400" />
        </div>
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-white cursor-pointer hover:shadow-lg transition">
          🦊
        </div>
      </button>
    </div>
  );
}
