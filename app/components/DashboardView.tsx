import React from 'react';
import CalendarView from './CalendarView';
import ChoreChart from './ChoreChart';
import MealPlanner from './MealPlanner';
import { MOCK_CHORES, MOCK_MEALS } from '../lib/mockData';

interface DashboardViewProps {
  events: any[];
  setEvents: (events: any[]) => void;
  setShowSharePopup: (show: boolean) => void;
  setEditingEvent: (event: any) => void;
}

export default function DashboardView({ events, setEvents, setShowSharePopup, setEditingEvent }: DashboardViewProps) {
  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* Main Calendar Area - 2/3 width */}
      <div className="flex-[2] h-full overflow-hidden">
         <CalendarView
            events={events}
            setEvents={setEvents}
            setShowSharePopup={setShowSharePopup}
            setEditingEvent={setEditingEvent}
         />
      </div>

      {/* Widgets Area - 1/3 width */}
      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
        <div className="flex-1 overflow-hidden">
           <ChoreChart initialChores={MOCK_CHORES} />
        </div>
        <div className="flex-1 overflow-hidden">
           <MealPlanner initialMeals={MOCK_MEALS} />
        </div>
      </div>
    </div>
  );
}
