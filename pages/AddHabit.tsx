import React, { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { COLORS, ICONS } from '../types';
import TimePicker from '../components/TimePicker';
import { 
    X, Check, Trash2, Bell,
    Activity, BookOpen, CigaretteOff, Droplets, Dumbbell, 
    Heart, Moon, Music, Sun, Utensils, Zap, CheckCircle, Smartphone
} from 'lucide-react';

interface AddHabitProps {
    onClose: () => void;
    habitId?: string;
}

const AddHabit: React.FC<AddHabitProps> = ({ onClose, habitId }) => {
  const { addHabit, updateHabit, deleteHabit, habits } = useHabits();
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  
  // Default to Daily
  const [goal, setGoal] = useState('Daily');
  // Default to Anytime, but will be smart-updated
  const [timeOfDay, setTimeOfDay] = useState('Anytime');
  
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');

  const isEditing = !!habitId;

  const iconMap: { [key: string]: React.ElementType } = {
    Activity, BookOpen, CigaretteOff, Droplets, Dumbbell, 
    Heart, Moon, Music, Sun, Utensils, Zap, CheckCircle, Smartphone
  };

  useEffect(() => {
    if (habitId) {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            setTitle(habit.title);
            setColor(habit.color);
            setIcon(habit.icon);
            setGoal(habit.goal);
            setTimeOfDay(habit.timeOfDay || 'Anytime');
            setReminderEnabled(habit.reminderEnabled || false);
            setReminderTime(habit.reminderTime || '09:00');
        }
    }
  }, [habitId, habits]);

  // Smart Time of Day Logic
  useEffect(() => {
    if (reminderEnabled && reminderTime) {
        const [h] = reminderTime.split(':').map(Number);
        if (h >= 5 && h < 12) setTimeOfDay('Morning');
        else if (h >= 12 && h < 17) setTimeOfDay('Afternoon');
        else if (h >= 17 && h < 22) setTimeOfDay('Evening');
        else setTimeOfDay('Night');
    }
  }, [reminderTime, reminderEnabled]);

  const toggleReminder = async () => {
    if (!reminderEnabled) {
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') setReminderEnabled(true);
            else alert('Notification permission denied.');
        } else if (Notification.permission === 'denied') {
             alert('Notification permission denied.');
        } else {
            setReminderEnabled(true);
        }
    } else {
        setReminderEnabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && habitId) {
        updateHabit(habitId, { title, color, icon, goal, timeOfDay, reminderEnabled, reminderTime });
    } else {
        addHabit({ title, color, icon, goal, timeOfDay, reminderEnabled, reminderTime });
    }
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (habitId) {
        deleteHabit(habitId);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 z-[110] flex items-center justify-center backdrop-blur-sm transition-all p-4">
        <div className="bg-white dark:bg-dark-surface w-[90%] max-w-[19rem] rounded-[2rem] p-3.5 shadow-2xl animate-in zoom-in-95 fade-in duration-300 border-2 border-black dark:border-zinc-800 max-h-[85vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">{isEditing ? 'Edit Habit' : 'New Habit'}</h2>
                <button onClick={onClose} className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors active:scale-90">
                    <X size={12} strokeWidth={2.5} />
                </button>
            </div>

            <form id="habit-form" onSubmit={handleSubmit} className="space-y-2.5">
                {/* Title */}
                <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Habit Name</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Read Book"
                        className="w-full text-base font-bold border-b-2 border-black dark:border-zinc-800 focus:border-violet-500 dark:focus:border-violet-400 outline-none py-1 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-colors"
                        autoFocus={!isEditing}
                    />
                </div>

                {/* Vertical Stack: Icon & Color */}
                <div className="flex flex-col gap-2.5">
                    {/* Icon Picker */}
                    <div>
                        <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Icon</label>
                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                            {ICONS.map(iconName => {
                                const IconCmp = iconMap[iconName];
                                if (!IconCmp) return null;
                                return (
                                    <button
                                        type="button"
                                        key={iconName}
                                        onClick={() => setIcon(iconName)}
                                        className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 border ${
                                            icon === iconName 
                                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white' 
                                            : 'bg-transparent text-zinc-400 border-zinc-200 dark:border-zinc-800'
                                        }`}
                                    >
                                        <IconCmp size={16} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Color</label>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 items-center h-8">
                            {COLORS.map(c => (
                                <button
                                    type="button"
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-6 h-6 rounded-full flex-shrink-0 transition-all duration-300 ${color === c ? 'scale-110 ring-2 ring-black dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-zinc-900' : 'opacity-40 hover:opacity-100'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reminders Section */}
                <div className="pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            Reminders
                            {reminderEnabled && <span className="text-violet-500 bg-violet-50 dark:bg-violet-900/30 px-1.5 py-0.5 rounded text-[8px]">{timeOfDay}</span>}
                        </label>
                        <button
                            type="button"
                            onClick={toggleReminder}
                            className={`relative w-8 h-4.5 rounded-full transition-colors duration-200 ease-in-out border ${
                                reminderEnabled 
                                ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white' 
                                : 'bg-transparent border-zinc-200 dark:border-zinc-700'
                            }`}
                        >
                            <span 
                                className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white dark:bg-zinc-900 shadow-sm transform transition-transform duration-200 ${
                                    reminderEnabled ? 'translate-x-3.5' : 'translate-x-0 bg-zinc-300 dark:bg-zinc-600'
                                }`} 
                            />
                        </button>
                    </div>
                    
                    {reminderEnabled && (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-300 mt-2">
                            <TimePicker value={reminderTime} onChange={setReminderTime} />
                        </div>
                    )}
                </div>

            </form>

            <div className="mt-3 space-y-2">
                <button 
                    type="submit" 
                    form="habit-form"
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm py-2.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    <Check size={16} strokeWidth={3} />
                    {isEditing ? 'Save Changes' : 'Create Habit'}
                </button>

                {isEditing && (
                    <button 
                        type="button"
                        onClick={handleDelete}
                        className="w-full bg-transparent text-red-500 dark:text-red-400 font-bold text-xs py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                        <Trash2 size={14} strokeWidth={2.5} />
                        Delete Habit
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default AddHabit;