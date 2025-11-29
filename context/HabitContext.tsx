import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Habit, HabitStatus } from '../types';
import { formatDate } from '../utils';

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'totalCompleted' | 'totalTarget' | 'logs'>) => void;
  toggleStatus: (habitId: string, date: Date) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'logs'>>) => void;
  resetHabits: () => void;
  refreshHabits: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Practice gratitude',
    icon: 'Heart',
    color: '#2196F3',
    goal: 'Daily',
    streak: 8,
    totalCompleted: 303,
    totalTarget: 365,
    logs: {
      '2025-11-20': 'completed',
      '2025-11-21': 'completed',
      '2025-11-22': 'completed',
      '2025-11-23': 'completed',
    },
    timeOfDay: '9:00 PM',
    reminderEnabled: true,
    reminderTime: '21:00'
  },
  {
    id: '2',
    title: 'Reduce screen time',
    icon: 'Smartphone',
    color: '#F44336',
    goal: 'Daily',
    streak: 2,
    totalCompleted: 56,
    totalTarget: 365,
    logs: {
      '2025-11-20': 'skipped',
      '2025-11-21': 'skipped',
      '2025-11-22': 'completed',
      '2025-11-23': 'skipped',
    },
    timeOfDay: '8:00 PM'
  },
  {
    id: '3',
    title: 'Quit smoking',
    icon: 'CigaretteOff',
    color: '#009688',
    goal: 'Daily',
    streak: 12,
    totalCompleted: 215,
    totalTarget: 364,
    logs: {
        '2025-11-20': 'skipped',
        '2025-11-21': 'completed',
        '2025-11-22': 'skipped',
        '2025-11-23': 'completed',
    },
    timeOfDay: '10:00 PM'
  }
];

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
        const saved = localStorage.getItem('habits');
        return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch (e) {
        return INITIAL_HABITS;
    }
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Notification Checker
  useEffect(() => {
    // Check permission on mount
    if (Notification.permission === 'default') {
        // We don't force request here, we wait for user interaction in AddHabit, 
        // but checking avoids errors.
    }

    const interval = setInterval(() => {
        if (Notification.permission !== 'granted') return;

        const now = new Date();
        const currentHM = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        // Also get seconds to avoid multiple triggers in the same minute if interval drifts, 
        // but 60000ms usually aligns well enough. To be safe, we can track 'lastTriggered'.
        // For simplicity in this demo, strict minute checking:
        
        habits.forEach(habit => {
            if (habit.reminderEnabled && habit.reminderTime === currentHM) {
                // Check if we already logged completion for today to avoid nagging? 
                // Optional logic. For now, always remind.
                const dateKey = formatDate(now);
                if (habit.logs[dateKey] !== 'completed') {
                    // Send notification
                    const n = new Notification(`Time for ${habit.title}!`, {
                        body: `Stay consistent! Goal: ${habit.goal}`,
                        icon: '/vite.svg', // Fallback icon
                        tag: `reminder-${habit.id}-${dateKey}` // Prevent duplicate notifications for same event
                    });
                }
            }
        });

    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [habits]);

  const addHabit = (newHabitData: Omit<Habit, 'id' | 'streak' | 'totalCompleted' | 'totalTarget' | 'logs'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: Math.random().toString(36).substr(2, 9),
      streak: 0,
      totalCompleted: 0,
      totalTarget: 365, // Default annual
      logs: {},
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id' | 'logs'>>) => {
    setHabits(prevHabits => prevHabits.map(h => 
      h.id === id ? { ...h, ...updates } : h
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const resetHabits = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        setHabits(INITIAL_HABITS);
        localStorage.removeItem('habits');
    }
  };

  const refreshHabits = () => {
    try {
        const saved = localStorage.getItem('habits');
        if (saved) {
            setHabits(JSON.parse(saved));
        } else {
            setHabits(INITIAL_HABITS);
        }
    } catch (e) {
        console.error("Failed to refresh habits", e);
    }
  };

  const toggleStatus = (habitId: string, date: Date) => {
    const dateKey = formatDate(date);
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id !== habitId) return habit;

      const currentStatus = habit.logs[dateKey];
      let newStatus: HabitStatus = 'completed';
      
      if (currentStatus === 'completed') newStatus = 'skipped';
      else if (currentStatus === 'skipped') newStatus = null;
      
      const newLogs = { ...habit.logs };
      if (newStatus === null) {
        delete newLogs[dateKey];
      } else {
        newLogs[dateKey] = newStatus;
      }

      // Simple Recalculate stats (mock logic for demo)
      let completedCount = Object.values(newLogs).filter(s => s === 'completed').length;

      return {
        ...habit,
        logs: newLogs,
        totalCompleted: completedCount,
        streak: newStatus === 'completed' ? habit.streak + 1 : habit.streak
      };
    }));
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleStatus, deleteHabit, updateHabit, resetHabits, refreshHabits }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabits must be used within a HabitProvider');
  return context;
};