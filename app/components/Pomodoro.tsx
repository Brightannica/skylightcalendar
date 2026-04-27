"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Brain } from "lucide-react";

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setTimeout(() => {
        setIsActive(false);
        if (mode === "work") {
          setMode("break");
          setTimeLeft(5 * 60);
          new Audio("/bell.mp3").play().catch(() => {});
        } else {
          setMode("work");
          setTimeLeft(25 * 60);
          new Audio("/bell.mp3").play().catch(() => {});
        }
      }, 0);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 text-gray-700">
        <Brain className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Focus Timer</h3>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode("work"); setTimeLeft(25 * 60); setIsActive(false); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${mode === "work" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => { setMode("break"); setTimeLeft(5 * 60); setIsActive(false); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${mode === "break" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Break
        </button>
      </div>

      <div className="text-5xl font-bold text-gray-800 mb-8 tabular-nums tracking-tight">
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition transform hover:scale-105 ${isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
