import React, { useState, useRef } from 'react';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import HabitCard from '../components/HabitCard';
import { ChevronLeft, ChevronRight, Moon, Sun, Loader2, RefreshCw } from 'lucide-react';
import { getCurrentWeek } from '../utils';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardProps {
    onNavigate: (tab: string, habitId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { habits, toggleStatus, deleteHabit, refreshHabits } = useHabits();
  const { theme, toggleTheme } = useTheme();
  const [viewDate, setViewDate] = useState(new Date());
  
  // Pull to refresh state
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);

  const currentWeek = getCurrentWeek(viewDate);
  const startOfWeek = currentWeek[0];
  const endOfWeek = currentWeek[6];
  
  const getWeekRangeString = () => {
    const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
    const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
    
    if (startMonth === endMonth) {
        return `${startMonth} ${startOfWeek.getDate()}—${endOfWeek.getDate()}`;
    } else {
        return `${startMonth} ${startOfWeek.getDate()} — ${endMonth} ${endOfWeek.getDate()}`;
    }
  };

  const handlePrevWeek = () => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() - 7);
    setViewDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + 7);
    setViewDate(newDate);
  };

  const jumpToToday = () => {
    setViewDate(new Date());
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (window.scrollY === 0 && diff > 0 && !isRefreshing) {
        // Apply some damping to the pull
        setPullY(Math.min(diff * 0.45, 120));
    }
  };

  const handleTouchEnd = async () => {
    if (pullY > 60) {
        setIsRefreshing(true);
        setPullY(60); // Snap to loading position
        
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        refreshHabits();
        
        setIsRefreshing(false);
        setPullY(0);
    } else {
        setPullY(0);
    }
    startY.current = 0;
  };

  return (
    <div 
        className="pb-40 pt-10 px-5 max-w-md mx-auto min-h-screen transition-colors duration-300 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
            transform: `translateY(${pullY}px)`, 
            transition: isRefreshing || pullY === 0 ? 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' 
        }}
    >
      {/* Refresh Indicator */}
      <div className="absolute top-0 left-0 w-full flex justify-center -translate-y-16 pointer-events-none">
         <div 
            className={`w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-zinc-100 dark:border-zinc-700 flex items-center justify-center transition-all duration-300 ${isRefreshing ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            style={{ opacity: Math.min(pullY / 40, 1) }}
         >
             {isRefreshing ? (
                 <Loader2 size={20} className="text-violet-500 animate-spin" />
             ) : (
                 <RefreshCw size={20} className="text-zinc-400 dark:text-zinc-500" style={{ transform: `rotate(${pullY * 2}deg)` }} />
             )}
         </div>
      </div>

      {/* Minimal Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none transition-colors">KARM Karo</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm tracking-wide mt-1">getting 1% better each day.</p>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={toggleTheme}
                className="w-12 h-12 rounded-[1rem] border-2 border-black dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-dark-surface shadow-sm active:scale-90 transition-all text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            >
                {theme === 'light' ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
            </button>
            <button 
                onClick={jumpToToday}
                className="w-12 h-12 rounded-[1rem] border-2 border-black dark:border-zinc-800 flex flex-col items-center justify-center bg-white dark:bg-dark-surface shadow-sm active:scale-90 transition-all group hover:border-violet-200"
            >
                <span className="text-[9px] font-bold uppercase text-zinc-400 group-hover:text-violet-500 leading-none mb-0.5">{new Date().toLocaleString('default', { month: 'short' })}</span>
                <span className="text-lg font-black leading-none text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-white">{new Date().getDate()}</span>
            </button>
        </div>
      </div>

      {/* Date Navigation Strip */}
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-dark-surface p-1.5 rounded-full border-2 border-black dark:border-zinc-800 shadow-soft transition-colors duration-300">
        <button 
            onClick={handlePrevWeek}
            className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90"
        >
            <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <span className="font-extrabold text-zinc-900 dark:text-white text-sm tracking-tight">{getWeekRangeString()}</span>
        <button 
            onClick={handleNextWeek}
            className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90"
        >
            <ChevronRight size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Habit List */}
      <div>
        <AnimatePresence mode="popLayout">
            {habits.map(habit => (
            <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
            >
                <HabitCard 
                    habit={habit} 
                    weekDates={currentWeek}
                    onToggle={(d) => toggleStatus(habit.id, d)}
                    onClick={() => onNavigate('calendar', habit.id)}
                    onEdit={() => onNavigate('edit', habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                />
            </motion.div>
            ))}
        </AnimatePresence>
        
        {habits.length === 0 && (
            <div className="text-center py-20 opacity-50">
                <p className="text-zinc-400 font-bold">No habits yet. Tap + to start.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;