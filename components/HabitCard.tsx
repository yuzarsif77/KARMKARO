import React from 'react';
import { Habit } from '../types';
import { formatDate } from '../utils';
import { 
    Flame, MoreHorizontal, Check, Bell, Trash2, X,
    Activity, BookOpen, CigaretteOff, Droplets, Dumbbell, 
    Heart, Moon, Music, Sun, Utensils, Zap, CheckCircle, Smartphone
} from 'lucide-react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface HabitCardProps {
  habit: Habit;
  weekDates: Date[];
  onToggle: (date: Date) => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, weekDates, onToggle, onClick, onEdit, onDelete }) => {
  const today = new Date();
  const todayKey = formatDate(today);
  
  // Calculate completion percentage for this week for a mini-viz
  const weekCompletion = weekDates.filter(d => habit.logs[formatDate(d)] === 'completed').length;
  const progressPercent = Math.round((weekCompletion / 7) * 100);

  const iconMap: { [key: string]: React.ElementType } = {
    Activity, BookOpen, CigaretteOff, Droplets, Dumbbell, 
    Heart, Moon, Music, Sun, Utensils, Zap, CheckCircle, Smartphone
  };
  const Icon = iconMap[habit.icon] || Activity;

  // Swipe to delete logic
  const x = useMotionValue(0);
  // Fade in opacity as we drag right (positive x)
  const deleteOpacity = useTransform(x, [50, 100], [0, 1]);
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
        // Trigger delete if swiped far enough right
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        onDelete();
    }
  };

  return (
    <div className="relative mb-6 group select-none">
      {/* Background Delete Layer - aligned to start (left) for right swipe */}
      <div className="absolute inset-0 bg-red-500 rounded-[2rem] flex items-center justify-start pl-8 overflow-hidden z-0">
         <motion.div style={{ opacity: deleteOpacity }} className="flex items-center gap-2 text-white font-bold">
            <Trash2 size={24} />
            <span>Delete</span>
         </motion.div>
      </div>

      <motion.div 
        style={{ x, touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.1, right: 0.8 }} // Allow more movement to the right
        onDragEnd={handleDragEnd}
        className="bg-white dark:bg-dark-surface rounded-[2rem] p-6 shadow-soft dark:shadow-none relative z-10 border-2 border-black dark:border-zinc-800 transform-gpu active:cursor-grabbing"
      >
      
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6" onClick={onClick}>
            <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5">
                <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700" 
                    style={{ color: habit.color }}
                >
                    <Icon size={14} />
                </div>
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                    {habit.timeOfDay}
                    {habit.reminderEnabled && (
                        <Bell size={10} className="text-zinc-300 dark:text-zinc-600 fill-zinc-300 dark:fill-zinc-600" />
                    )}
                </span>
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-none">
                {habit.title}
            </h3>
            </div>
            
            <div className="flex items-center gap-1">
                <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Flame size={14} className="text-orange-500 fill-orange-500 animate-pulse" />
                    <motion.span 
                        key={habit.streak}
                        initial={{ scale: 1.5, textShadow: "0 0 10px rgba(249, 115, 22, 0.5)" }}
                        animate={{ scale: 1, textShadow: "0 0 0px rgba(249, 115, 22, 0)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="text-sm font-black text-zinc-700 dark:text-zinc-200"
                    >
                        {habit.streak}
                    </motion.span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="w-9 h-9 flex items-center justify-center text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-full transition-colors"
                >
                    <MoreHorizontal size={20} />
                </button>
            </div>
        </div>

        {/* Week Grid */}
        <div className="flex justify-between items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded-[1.8rem]">
            {weekDates.map((date) => {
            const dateKey = formatDate(date);
            const status = habit.logs[dateKey];
            
            // Logic for date states
            const isToday = dateKey === todayKey;
            const isPast = dateKey < todayKey;
            // A day is "missed" if it is in the past and was NOT completed.
            const isCompleted = status === 'completed';
            const isMissed = isPast && !isCompleted;

            const dayLetter = date.toLocaleDateString('en-US', { weekday: 'narrow' });
            
            return (
                <div key={dateKey} className="flex flex-col items-center gap-2 flex-1">
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Strictly allow toggling only for today
                        if (isToday) {
                            onToggle(date);
                        }
                    }}
                    whileTap={isToday ? { scale: 0.85 } : {}}
                    disabled={!isToday}
                    animate={{
                        scale: isCompleted ? [1, 1.15, 1] : 1,
                    }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 17 }}
                    className={`w-full aspect-[4/5] rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden transition-all duration-200 ${
                        isCompleted 
                        ? 'shadow-md ring-0'
                        : isToday 
                            ? 'hover:bg-white/50 dark:hover:bg-zinc-800 active:bg-black/5 dark:active:bg-white/10 cursor-pointer' 
                            : 'opacity-80 cursor-default' // Dim non-clickable days slightly
                    }`}
                    style={{
                        backgroundColor: isCompleted ? habit.color : (isToday ? 'rgba(255,255,255,1)' : 'transparent'),
                        border: isToday && !isCompleted ? '2px solid #e4e4e7' : 'none',
                    }}
                >
                    {/* Status Indicator */}
                    {isCompleted ? (
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                            <Check size={18} strokeWidth={4} className="text-white drop-shadow-md" />
                        </motion.div>
                    ) : isMissed ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                             <X size={16} strokeWidth={3} className="text-red-300 dark:text-red-900/50" />
                        </motion.div>
                    ) : (
                        <span className={`text-xs font-bold ${isToday ? 'text-zinc-900' : 'text-zinc-400 dark:text-zinc-600'}`}>
                            {date.getDate()}
                        </span>
                    )}
                </motion.button>
                
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isToday ? 'text-zinc-900 dark:text-white' : 'text-zinc-300 dark:text-zinc-700'}`}>
                    {dayLetter}
                </span>
                </div>
            );
            })}
        </div>
        
        {/* Micro Progress Bar */}
        <div className="mt-6 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
            <div className="h-1.5 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%`, backgroundColor: habit.color }}
                />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tabular-nums">{habit.totalCompleted} done</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HabitCard;