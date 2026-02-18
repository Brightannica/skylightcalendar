import React from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, CheckSquare, Utensils, ShoppingCart, Image as ImageIcon, Settings as SettingsIcon } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'chores', label: 'Chores', icon: CheckSquare },
    { id: 'meals', label: 'Meals', icon: Utensils },
    { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-24 bg-white border-r border-slate-200 flex flex-col items-center py-8 shadow-xl z-20 h-full">
      <div className="mb-8">
        {/* Logo or Brand Icon placeholder */}
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          S
        </div>
      </div>

      <nav className="flex-1 flex flex-col w-full gap-4 px-2">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 w-full aspect-square
                ${isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm transform scale-105'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
              <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold mt-1 tracking-wide ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
