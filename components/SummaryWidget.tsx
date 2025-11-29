import React from 'react';
import { useHabits } from '../context/HabitContext';
import { formatDate } from '../utils';
import { Flame, Smile, Meh, Frown, CheckCircle2 } from 'lucide-react';

const SummaryWidget: React.FC = () => {
  const { habits } = useHabits();
  const today = new Date();
  const dateKey = formatDate(today);
  
  const activeHabits = habits; 
  const completedCount = activeHabits.filter(h => h.logs[dateKey] === 'completed').length;
  const totalCount = activeHabits.length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Determine State
  let status: 'perfect' | 'good' | 'bad' = 'bad';
  if (percentage === 100) status = 'perfect';
  else if (percentage >= 50) status = 'good';

  // Config based on status
  const config = {
    perfect: {
        icon: Smile,
        title: "Mission Complete",
        quote: "Discipline equals freedom.",
        color: "text-orange-500", 
        borderColor: "border-orange-500/20",
        bgGlow: "bg-orange-500/20"
    },
    good: {
        icon: Meh,
        title: "Halfway There",
        quote: "Keep pushing.",
        color: "text-zinc-300",
        borderColor: "border-zinc-700",
        bgGlow: "bg-zinc-700/20"
    },
    bad: {
        icon: Frown,
        title: "Stay Hard",
        quote: "Don't get comfortable.",
        color: "text-zinc-500",
        borderColor: "border-zinc-800",
        bgGlow: "bg-zinc-800/20"
    }
  }[status];

  const MainIcon = config.icon;

  return (
    <div className={`w-full bg-zinc-950 rounded-[2rem] p-6 text-white mb-8 relative overflow-hidden border-2 shadow-2xl transition-colors duration-500 ${config.borderColor}`}>
      {/* Background Texture/Effects */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#52525b 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl transition-colors duration-500 ${config.bgGlow}`} />
      
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
           {/* Header */}
           <div className="flex items-center gap-2 mb-2">
             <div className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Flame size={10} fill="currentColor" />
                <span>TODAY</span>
             </div>
           </div>

           {/* Title & Quote */}
           <div className="mb-4">
             <h2 className="text-2xl font-black tracking-tighter leading-none text-white mb-1">
               {config.title}
             </h2>
             <p className={`text-xs font-bold uppercase tracking-wide ${status === 'perfect' ? 'text-orange-400' : 'text-zinc-500'}`}>
               "{config.quote}"
             </p>
           </div>
           
           {/* Progress Bars */}
           <div className="flex items-center gap-1.5 h-1.5 w-full max-w-[120px]">
                {Array.from({ length: Math.max(totalCount, 1) }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-full rounded-full flex-1 transition-colors duration-300 ${i < completedCount ? 'bg-orange-500' : 'bg-zinc-800'}`} 
                    />
                ))}
           </div>
           <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-wide">
             {completedCount} of {totalCount} Habits Done
           </p>
        </div>

        {/* Big Face Icon */}
        <div className={`w-24 h-24 flex-shrink-0 flex items-center justify-center transition-colors duration-500 ${config.color}`}>
           <MainIcon size={80} strokeWidth={1.5} />
           {status === 'perfect' && (
                <div className="absolute top-2 right-2">
                    <CheckCircle2 size={20} className="text-orange-500 fill-orange-500/20" />
                </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SummaryWidget;