export type HabitStatus = 'completed' | 'skipped' | null;

export interface LogData {
  [date: string]: HabitStatus; // Format YYYY-MM-DD
}

export interface Habit {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  color: string;
  goal: string; // e.g., "Daily", "3x/week"
  streak: number;
  totalCompleted: number;
  totalTarget: number; // For the "303/365" stat
  logs: LogData;
  timeOfDay?: string;
  reminderEnabled?: boolean;
  reminderTime?: string; // "HH:MM" 24h format
}

export const ICONS = [
  'Activity', 'BookOpen', 'CigaretteOff', 'Droplets', 'Dumbbell', 
  'Heart', 'Moon', 'Music', 'Sun', 'Utensils', 'Zap', 'CheckCircle'
];

export const COLORS = [
  '#2196F3', // Blue
  '#F44336', // Red
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#009688', // Teal
];