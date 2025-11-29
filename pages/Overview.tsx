import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { formatDate, getDaysInMonth } from '../utils';
import { ChevronLeft, ChevronRight, Check, X, Sparkles, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Overview: React.FC = () => {
  const { habits } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startPadding = days[0].getDay();
  const paddingArray = Array.from({ length: startPadding });
  const todayKey = formatDate(new Date());

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getDayStatus = (date: Date) => {
    const dateKey = formatDate(date);
    if (new Date(dateKey) > new Date(todayKey)) return 'future';
    
    if (habits.length === 0) return 'empty';

    let completedCount = 0;
    habits.forEach(habit => {
        if (habit.logs[dateKey] === 'completed') {
            completedCount++;
        }
    });

    const percentage = (completedCount / habits.length) * 100;

    if (percentage === 100) return 'perfect'; 
    if (percentage >= 50) return 'good';      
    if (completedCount > 0) return 'bad'; // Did something, but less than 50%
    return 'zero'; // Did nothing
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white pb-40 transition-colors duration-300 pt-8 px-5 max-w-md mx-auto flex flex-col">
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
            <LayoutGrid size={16} className="text-violet-500" />
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Heatmap</p>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Month Overview</h1>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-8 px-2">
            <button onClick={prevMonth} className="w-12 h-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-90 border border-transparent dark:border-zinc-800">
                <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                    {currentDate.toLocaleString('default', { month: 'long' })}
                </span>
                <span className="text-xs font-bold text-zinc-400 tracking-widest">
                    {currentDate.getFullYear()}
                </span>
            </div>
            <button onClick={nextMonth} className="w-12 h-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-90 border border-transparent dark:border-zinc-800">
                <ChevronRight size={24} strokeWidth={2.5} />
            </button>
      </div>

      {/* Grid Container */}
      <div className="flex-1">
        <div className="grid grid-cols-7 mb-4 px-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 px-2">
          {paddingArray.map((_, i) => <div key={`pad-${i}`} />)}

          <AnimatePresence mode='popLayout'>
          {days.map((date, i) => {
            const dateKey = formatDate(date);
            const status = getDayStatus(date);
            const isToday = dateKey === todayKey;
            
            return (
              <motion.div 
                key={dateKey}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.01, type: 'spring', stiffness: 300, damping: 20 }}
                className="aspect-square relative flex items-center justify-center"
              >
                <div 
                    className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden
                        ${isToday ? 'ring-2 ring-white z-10 scale-110 shadow-lg' : ''}
                        ${status === 'perfect' ? 'bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.4)]' : ''}
                        ${status === 'good' ? 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700' : ''}
                        ${status === 'bad' || status === 'zero' ? 'bg-zinc-50 dark:bg-zinc-900/40' : ''}
                        ${status === 'future' ? 'opacity-20 grayscale' : ''}
                    `}
                >
                    {/* Visual Indicators */}
                    {status === 'perfect' && (
                        <Check size={16} strokeWidth={4} className="text-white drop-shadow-md" />
                    )}

                    {status === 'good' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                    )}

                    {status === 'bad' && (
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    )}
                    
                    {(status === 'zero' || status === 'future') && (
                         <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-800">
                            {date.getDate()}
                         </span>
                    )}

                    {/* Gradient Overlay for texture */}
                    {status === 'perfect' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                    )}
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Minimal Legend */}
      <div className="mt-8 flex justify-center gap-6 opacity-70">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-violet-600 shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">100%</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mixed</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-zinc-900/40 border border-zinc-800" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Low</span>
          </div>
      </div>

    </div>
  );
};

export default Overview;