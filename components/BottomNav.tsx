import React from 'react';
import { Home, BarChart2, Settings, LayoutGrid, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentTab: string;
  onChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChange }) => {
  const navItems = [
    { id: 'dashboard', icon: Home },
    { id: 'overview', icon: LayoutGrid },
    { id: 'add', icon: Plus }, // Central Action Button
    { id: 'stats', icon: BarChart2 },
    { id: 'settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] sm:max-w-md pointer-events-none">
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md saturate-150 px-2 py-2 rounded-[2rem] shadow-island dark:shadow-black/50 flex items-center justify-between pointer-events-auto border-2 border-black dark:border-zinc-800 mx-auto transition-colors duration-300">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isAddButton = item.id === 'add';

          if (isAddButton) {
            return (
                <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    className="relative h-14 w-14 -my-2 mx-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center shadow-lg shadow-zinc-900/30 dark:shadow-white/20 active:scale-95 transition-transform z-20"
                >
                    <Plus size={28} strokeWidth={3} />
                </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-full transition-transform duration-200 active:scale-90 z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'}`} 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;