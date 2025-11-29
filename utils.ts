import { Habit } from './types';

// Simple date format YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const getDayOfWeek = (date: Date): number => {
  return date.getDay(); // 0 = Sunday
};

export const getMonthName = (year: number, month: number): string => {
  return new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
};

// Returns an array of 7 dates (Mon-Sun) representing the week containing the provided date
export const getCurrentWeek = (date: Date = new Date()): Date[] => {
  const current = new Date(date);
  const day = current.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Calculate difference to get to Monday
  // If today is Sunday (0), we subtract 6 days.
  // If today is Mon (1), we subtract 0 days.
  // If today is Tue (2), we subtract 1 day... etc.
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  
  const monday = new Date(current);
  monday.setDate(diff);
  
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
};

export const getWeekDays = (startDate: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i - startDate.getDay()); // Adjust to start on Sunday
    days.push(d);
  }
  return days;
};

export const exportToCSV = (habits: Habit[]) => {
  const headers = ['ID', 'Title', 'Goal', 'Streak', 'Total Completed', 'Logs (JSON)'];
  const rows = habits.map(h => [
    h.id,
    `"${h.title}"`,
    h.goal,
    h.streak,
    h.totalCompleted,
    `"${JSON.stringify(h.logs).replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `karmkaro_export_${formatDate(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const QUOTES = [
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Success is the product of daily habits—not once-in-a-lifetime transformations.",
  "The secret of your future is hidden in your daily routine.",
  "Small habits, when performed consistently, lead to massive results.",
  "First we make our habits, then our habits make us.",
  "It's easier to prevent bad habits than to break them.",
  "Habit is a cable; we weave a thread of it each day, and at last we cannot break it.",
  "Discipline is choosing between what you want now and what you want most."
];