import React, { useEffect, useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, YAxis } from 'recharts';
import { Trophy, Target, Crown, Medal, Award, Sparkles, TrendingUp, Zap, ArrowUpRight } from 'lucide-react';
import { Activity, BookOpen, CigaretteOff, Droplets, Dumbbell, Heart, Moon, Music, Sun, Utensils, CheckCircle, Smartphone } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
    Activity, BookOpen, CigaretteOff, Droplets, Dumbbell, 
    Heart, Moon, Music, Sun, Utensils, Zap, CheckCircle, Smartphone
};

const Stats: React.FC = () => {
  const { habits } = useHabits();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Delay render to allow framer-motion page transition to settle (350ms)
    // This prevents Recharts from calculating width(-1) during the 'enter' phase
    const timer = setTimeout(() => {
        setIsMounted(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const totalCompletedAll = habits.reduce((acc, h) => acc + h.totalCompleted, 0);
  const totalTargetAll = habits.reduce((acc, h) => acc + h.totalTarget, 0);
  const completionRate = totalTargetAll > 0 ? Math.round((totalCompletedAll / totalTargetAll) * 100) : 0;

  const data = habits.map(h => ({
    name: h.title.split(' ')[0], // First word only for cleaner x-axis
    fullName: h.title,
    completed: h.totalCompleted,
    target: h.totalTarget,
    color: h.color,
    streak: h.streak
  }));

  const sortedHabits = [...habits].sort((a,b) => b.streak - a.streak);

  // Circular Progress Component
  const CircularProgress = ({ value, size = 60, strokeWidth = 6, color = "currentColor" }: any) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-zinc-100 dark:text-zinc-800"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black">{value}%</span>
            </div>
        </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 text-white text-xs p-3 rounded-xl shadow-xl border border-zinc-800">
          <p className="font-bold mb-1">{payload[0].payload.fullName}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: payload[0].payload.color }} />
            <span>{payload[0].value} completed</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-32 pt-8 px-5 max-w-md mx-auto min-h-screen transition-colors duration-300">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-violet-500" />
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Analytics</p>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
            Stats & <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Glory</span>
        </h1>
      </div>

      {/* Bento Grid Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total Completed Card */}
        <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-5 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-44 shadow-lg group">
             {/* Gradient Blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
            
            <div className="relative z-10 flex justify-between items-start">
                <div className="p-2 bg-white/10 dark:bg-zinc-100 rounded-xl backdrop-blur-md">
                    <Sparkles size={20} className="text-yellow-300 dark:text-yellow-600" />
                </div>
                <ArrowUpRight size={20} className="text-zinc-500 dark:text-zinc-400" />
            </div>

            <div className="relative z-10">
                <p className="text-5xl font-black tracking-tighter mb-1">{totalCompletedAll}</p>
                <p className="text-zinc-400 dark:text-zinc-500 font-bold text-xs uppercase tracking-wide">Total Reps</p>
            </div>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white dark:bg-dark-surface p-5 rounded-[2rem] border-2 border-black dark:border-zinc-800 flex flex-col justify-between h-44 shadow-soft dark:shadow-none transition-colors relative overflow-hidden">
             <div className="flex justify-between items-start mb-2">
                 <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <Target size={20} className="text-zinc-900 dark:text-white" />
                 </div>
                 <CircularProgress value={completionRate} size={44} strokeWidth={5} color="#8b5cf6" />
             </div>
             
             <div>
                <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{completionRate}%</p>
                </div>
                <p className="text-zinc-400 font-bold text-xs uppercase tracking-wide mt-1">Success Rate</p>
                <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-white rounded-full" style={{ width: `${completionRate}%` }} />
                </div>
            </div>
        </div>
      </div>

      {/* High Contrast Performance Chart */}
      <div className="bg-zinc-900 text-white p-6 rounded-[2.5rem] shadow-xl mb-8 relative overflow-hidden group">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-zinc-800/50 to-transparent pointer-events-none opacity-50" />
        
        <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
                <h3 className="text-xl font-bold tracking-tight">Performance</h3>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Weekly Overview</p>
            </div>
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-zinc-300 border border-white/10">
                Last 30 Days
            </div>
        </div>

        <div className="h-52 w-full min-w-0 relative z-10" style={{ minHeight: '208px' }}>
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={48}>
                <defs>
                    {data.map((entry, index) => (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.4}/>
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#a1a1aa', fontWeight: 600 }}
                    dy={10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 12 }} />
                <Bar 
                    dataKey="completed" 
                    radius={[10, 10, 4, 4]} 
                    animationDuration={1500}
                    animationEasing="ease-out"
                >
                    {data.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#gradient-${index})`}
                        strokeWidth={0}
                    />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
                <span className="text-xs font-bold animate-pulse">Loading data...</span>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard List */}
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight flex items-center gap-2">
        <Crown size={20} className="text-yellow-500 fill-yellow-500" />
        Leaderboard
      </h3>
      
      <div className="space-y-3">
        {sortedHabits.map((h, i) => {
            const Icon = iconMap[h.icon] || Zap;
            const rank = i + 1;
            const isTop3 = rank <= 3;
            
            // Progress towards next 100 milestone
            const progress = (h.streak % 100); 

            return (
                <div key={h.id} className="group bg-white dark:bg-dark-surface p-4 rounded-[2rem] border-2 border-black dark:border-zinc-800 shadow-soft dark:shadow-none flex items-center gap-4 relative overflow-hidden transition-all hover:scale-[1.01]">
                    
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center justify-center w-8 shrink-0">
                        <span className={`text-sm font-black ${isTop3 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                            {String(rank).padStart(2, '0')}
                        </span>
                        {rank === 1 && <Crown size={12} className="text-yellow-500 fill-yellow-500 mt-0.5" />}
                    </div>

                    {/* Icon Box */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700" style={{ backgroundColor: `${h.color}15`, color: h.color }}>
                        <Icon size={20} strokeWidth={2.5} />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 py-1">
                        <h4 className="text-base font-bold text-zinc-900 dark:text-white truncate leading-tight">{h.title}</h4>
                        
                        {/* Streak Progress Bar */}
                        <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%`, backgroundColor: h.color }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400">{progress}% to lvl up</span>
                        </div>
                    </div>

                    {/* Streak Count */}
                    <div className="text-right shrink-0">
                         <div className="flex items-center justify-end gap-1">
                            <FlameIcon color={h.color} />
                            <span className="text-xl font-black text-zinc-900 dark:text-white leading-none">{h.streak}</span>
                         </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

// Simple flame SVG component for reusability
const FlameIcon = ({ color }: { color: string }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 14.5C8.5 14.5 13.5 14.5 13.5 9C13.5 7.18 12.3 6.13 11.5 5.5C13.43 5.75 16.5 7.17 16.5 11C16.5 11 17 10.5 17 9.5C18.63 11.13 19 13.29 19 14.5C19 18.09 16.09 21 12.5 21C8.91 21 6 18.09 6 14.5C6 13.1 6.3 11.23 7.5 9.5C7.5 9.5 8.5 11.5 8.5 14.5Z" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default Stats;