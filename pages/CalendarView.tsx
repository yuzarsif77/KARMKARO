import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { formatDate, getDaysInMonth } from '../utils';
import { ChevronLeft, ChevronRight, ArrowLeft, X, Check, PenLine } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface CalendarViewProps {
  initialHabitId?: string;
  onBack: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ initialHabitId, onBack }) => {
  const { habits, toggleStatus } = useHabits();
  const [selectedHabitId] = useState(initialHabitId || habits[0]?.id);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track selected day for details
  const [direction, setDirection] = useState(0);

  const activeHabit = habits.find(h => h.id === selectedHabitId);
  if (!activeHabit) return <div>No habit selected</div>;

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startPadding = days[0].getDay();
  const paddingArray = Array.from({ length: startPadding });
  const todayKey = formatDate(new Date());

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const gridVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white pb-40 pt-6 px-4 max-w-md mx-auto flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
            onClick={onBack} 
            className="w-12 h-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 active:scale-90 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={24} className="text-zinc-900 dark:text-white" />
        </button>
        <div className="flex flex-col items-end">
            <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">{activeHabit.title}</h2>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeHabit.color }} />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Streak: {activeHabit.streak}</span>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8 px-2">
            <button onClick={prevMonth} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors active:scale-75">
                <ChevronLeft size={28} strokeWidth={3} />
            </button>
            <div className="flex flex-col items-center">
                <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.h2 
                        key={currentDate.toISOString()}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase"
                    >
                        {currentDate.toLocaleString('default', { month: 'long' })}
                    </motion.h2>
                </AnimatePresence>
                <span className="text-zinc-400 dark:text-zinc-600 font-bold tracking-[0.2em] text-xs">{currentDate.getFullYear()}</span>
            </div>
            <button onClick={nextMonth} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors active:scale-75">
                <ChevronRight size={28} strokeWidth={3} />
            </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-3 px-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div 
                key={currentDate.toISOString()}
                variants={gridVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                className="grid grid-cols-7 gap-3 px-2"
            >
            {paddingArray.map((_, i) => <div key={`pad-${i}`} />)}

            {days.map(date => {
                const dateKey = formatDate(date);
                const status = activeHabit.logs[dateKey];
                
                const isSelected = formatDate(selectedDate) === dateKey;
                const isToday = dateKey === todayKey;
                const isPast = dateKey < todayKey;
                const isCompleted = status === 'completed';
                const isMissed = isPast && !isCompleted; 

                return (
                <div 
                    key={dateKey} 
                    className="aspect-square relative flex items-center justify-center"
                >
                    <motion.button
                        onClick={() => {
                            setSelectedDate(date);
                            // Toggle logic remains: only toggle if it is today.
                            if (isToday) toggleStatus(activeHabit.id, date);
                        }}
                        whileTap={{ scale: 0.85 }}
                        className={`w-full h-full rounded-full flex items-center justify-center relative transition-all duration-300
                            ${isSelected 
                                ? 'ring-2 ring-black dark:ring-white scale-110 z-10' 
                                : ''}
                            ${!isToday && !isCompleted && !isMissed 
                                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-700' 
                                : ''}
                            ${isMissed 
                                ? 'bg-red-100 dark:bg-red-950/40 text-red-500 dark:text-red-500' 
                                : ''}
                            ${isCompleted 
                                ? 'text-white shadow-md' 
                                : ''}
                        `}
                        style={{ 
                            backgroundColor: isCompleted ? activeHabit.color : undefined,
                        }}
                    >
                        {isCompleted ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <Check size={16} strokeWidth={4} />
                            </motion.div>
                        ) : isMissed ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <X size={16} strokeWidth={4} />
                            </motion.div>
                        ) : (
                            <span className={`text-sm font-bold ${isToday && !isCompleted ? 'text-zinc-900 dark:text-white' : ''}`}>
                                {date.getDate()}
                            </span>
                        )}
                        
                        {/* Today indicator dot if not selected/completed */}
                        {isToday && !isCompleted && !isSelected && (
                            <div className="absolute -bottom-1 w-1 h-1 bg-zinc-900 dark:bg-white rounded-full" />
                        )}
                    </motion.button>
                </div>
                );
            })}
            </motion.div>
        </AnimatePresence>

        {/* Day Detail / Note Input Section */}
        <div className="mt-8 px-2 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-black text-xl text-zinc-900 dark:text-white">
                    {selectedDate.getDate()}
                </div>
                <div>
                     <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {selectedDate.toLocaleDateString('default', { month: 'short' })}
                    </span>
                    <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wide leading-none">
                        {selectedDate.toLocaleDateString('default', { weekday: 'long' })}
                    </span>
                </div>
            </div>
            
            {/* The Note Input */}
            <div className="w-full relative group">
                <div className="absolute inset-0 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl pointer-events-none group-hover:border-violet-400 dark:group-hover:border-violet-600 transition-colors" />
                <textarea 
                    placeholder="Add a note for this day..."
                    className="w-full h-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none resize-none bg-transparent"
                />
                <div className="absolute bottom-3 right-3 text-zinc-400 pointer-events-none">
                    <PenLine size={14} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
