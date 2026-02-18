import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2574&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2673&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop'
];

interface PhotoFrameProps {
  onExit: () => void;
}

export default function PhotoFrame({ onExit }: PhotoFrameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? PHOTOS.length - 1 : prev - 1));
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-none group"
      onClick={onExit} // Click anywhere to exit
    >
      {PHOTOS.map((photo, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${photo})` }}
        />
      ))}

      {/* Overlay controls (visible on hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-12 cursor-default pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="text-white">
             <h1 className="text-4xl font-black tracking-tight mb-2">Family Memories</h1>
             <p className="text-white/80 font-medium">Tap anywhere to return to dashboard</p>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={handlePrev} className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition">
               <ChevronLeft size={32} />
             </button>
             <button onClick={togglePlay} className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition">
               {isPlaying ? <Pause size={32} /> : <Play size={32} />}
             </button>
             <button onClick={handleNext} className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition">
               <ChevronRight size={32} />
             </button>
             <button onClick={onExit} className="p-4 rounded-full bg-white/10 hover:bg-red-500/80 backdrop-blur-md text-white transition ml-4">
               <X size={32} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
