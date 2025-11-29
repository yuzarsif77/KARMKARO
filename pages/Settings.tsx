import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitContext';
import { exportToCSV } from '../utils';
import SummaryWidget from '../components/SummaryWidget';
import { 
    User, 
    Moon, 
    Sun, 
    Download, 
    Trash2, 
    ChevronRight, 
    Shield, 
    HelpCircle, 
    Smartphone
} from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { habits, resetHabits } = useHabits();

  const handleExport = () => {
    exportToCSV(habits);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pb-32 transition-colors duration-300 pt-10 px-5 max-w-md mx-auto">
      <div className="mb-8">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-1">Preferences</p>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Profile Section (Placeholder) */}
        <div className="bg-white dark:bg-dark-surface rounded-[2rem] p-6 border-2 border-black dark:border-zinc-800 flex items-center gap-4 shadow-soft dark:shadow-none">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <User size={32} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Guest User</h3>
                <p className="text-zinc-400 text-sm font-medium">Sync disabled</p>
            </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] overflow-hidden border-2 border-black dark:border-zinc-800 shadow-soft dark:shadow-none">
            <div className="p-6 border-b-2 border-zinc-100 dark:border-zinc-800">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Appearance</h4>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-violet-100 text-violet-600'}`}>
                            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-white">Dark Mode</span>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-violet-600' : 'bg-zinc-200'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile Widget */}
        <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] overflow-hidden border-2 border-black dark:border-zinc-800 shadow-soft dark:shadow-none">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Smartphone size={16} className="text-violet-500" />
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Mobile Widget</h4>
                </div>
                
                <div className="mb-4 transform scale-[0.95] origin-top">
                    <SummaryWidget />
                </div>
                
                <button 
                    onClick={() => alert("To add this widget to your home screen:\n\n1. Tap 'Share' (iOS) or 'Menu' (Android)\n2. Select 'Add to Home Screen'")}
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                >
                    <Smartphone size={18} />
                    Add to Home Screen
                </button>
                <p className="text-center text-[10px] text-zinc-400 font-bold mt-3">
                    Preview of your home screen widget
                </p>
            </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] overflow-hidden border-2 border-black dark:border-zinc-800 shadow-soft dark:shadow-none">
            <div className="p-6">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Data</h4>
                
                <button 
                    onClick={handleExport}
                    className="w-full flex items-center justify-between py-3 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                            <Download size={20} />
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-white">Export CSV</span>
                    </div>
                    <ChevronRight size={20} className="text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-600" />
                </button>

                <div className="h-px bg-zinc-50 dark:bg-zinc-800 my-1" />

                <button 
                    onClick={resetHabits}
                    className="w-full flex items-center justify-between py-3 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                            <Trash2 size={20} />
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-white">Reset Data</span>
                    </div>
                    <ChevronRight size={20} className="text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-600" />
                </button>
            </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] overflow-hidden border-2 border-black dark:border-zinc-800 shadow-soft dark:shadow-none">
             <div className="p-6">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">About</h4>
                <div className="space-y-1">
                     <button className="w-full flex items-center justify-between py-3 group">
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-zinc-400" />
                            <span className="font-medium text-zinc-600 dark:text-zinc-300">Privacy Policy</span>
                        </div>
                    </button>
                     <button className="w-full flex items-center justify-between py-3 group">
                        <div className="flex items-center gap-3">
                            <HelpCircle size={20} className="text-zinc-400" />
                            <span className="font-medium text-zinc-600 dark:text-zinc-300">Help & Support</span>
                        </div>
                    </button>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-xs font-bold text-zinc-300 dark:text-zinc-600">Version 1.0.0 (Beta)</p>
                    <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-1">Made with ❤️ by KARM Karo Team</p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;