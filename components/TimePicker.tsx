import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimePickerProps {
    value: string; // HH:MM 24h format
    onChange: (val: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    // Parse time safely
    const [h, m] = (value || '09:00').split(':').map(Number);
    const [mode, setMode] = useState<'hour' | 'minute'>('hour');
    
    // 12h conversion
    const isPm = h >= 12;
    const displayH = h % 12 || 12;
    const displayM = m;

    const updateTime = (newH: number, newM: number) => {
        onChange(`${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
    };

    const handleHourClick = (val: number) => {
        let newH = val;
        if (newH === 12) newH = 0;
        if (isPm) newH += 12;
        updateTime(newH, m);
        setMode('minute');
    };

    const handleMinuteClick = (val: number) => {
        updateTime(h, val);
    };

    const toggleAmPm = (shouldBePm: boolean) => {
        if (isPm === shouldBePm) return; // No change
        
        let newH = h;
        if (shouldBePm && newH < 12) newH += 12;
        if (!shouldBePm && newH >= 12) newH -= 12;
        updateTime(newH, m);
    };

    // Clock Face Geometry (Reduced size for mobile compactness)
    const size = 180;
    const radius = 70;
    const center = size / 2;

    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    return (
        <div className="w-full flex flex-col items-center select-none py-1">
            {/* Digital Display */}
            <div className="flex items-center gap-1 mb-4">
                <div className="flex items-baseline gap-1">
                    <button 
                        onClick={() => setMode('hour')}
                        className={`text-4xl font-black tracking-tighter transition-colors ${mode === 'hour' ? 'text-violet-500' : 'text-zinc-300 dark:text-zinc-700'}`}
                    >
                        {String(displayH).padStart(2, '0')}
                    </button>
                    <span className="text-4xl font-black text-zinc-300 dark:text-zinc-700 -mt-1">:</span>
                    <button 
                        onClick={() => setMode('minute')}
                        className={`text-4xl font-black tracking-tighter transition-colors ${mode === 'minute' ? 'text-violet-500' : 'text-zinc-300 dark:text-zinc-700'}`}
                    >
                        {String(displayM).padStart(2, '0')}
                    </button>
                </div>
                
                <div className="flex flex-col gap-1 ml-3">
                    <button 
                        onClick={() => toggleAmPm(false)}
                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md transition-colors ${!isPm ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}
                    >
                        AM
                    </button>
                    <button 
                        onClick={() => toggleAmPm(true)}
                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md transition-colors ${isPm ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}
                    >
                        PM
                    </button>
                </div>
            </div>

            {/* Clock Face */}
            <div className="relative bg-zinc-50 dark:bg-zinc-900 rounded-full shadow-inner border border-zinc-100 dark:border-zinc-800" style={{ width: size, height: size }}>
                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-violet-500 rounded-full z-10 shadow-lg" />

                {/* Hand Visual */}
                 <div 
                    className="absolute top-1/2 left-1/2 h-[2px] bg-violet-500 origin-left z-0 opacity-100 transition-transform duration-300 ease-out pointer-events-none"
                    style={{ 
                        width: radius, 
                        transform: `rotate(${(mode === 'hour' ? (displayH * 30 - 90) : (displayM * 6 - 90))}deg)` 
                    }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-violet-500 rounded-full shadow-lg shadow-violet-500/40" />
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'hour' ? (
                        <motion.div 
                            key="hours"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                        >
                            {hours.map((hr, i) => {
                                const angle = (hr * 30 - 90) * (Math.PI / 180);
                                const x = center + radius * Math.cos(angle);
                                const y = center + radius * Math.sin(angle);
                                const isSelected = displayH === hr;
                                return (
                                    <button
                                        type="button"
                                        key={hr}
                                        onClick={() => handleHourClick(hr)}
                                        className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${isSelected ? 'text-white' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                                        style={{ left: x, top: y }}
                                    >
                                        {hr}
                                    </button>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="minutes"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                        >
                            {minutes.map((mn, i) => {
                                // Calculate position
                                const angle = (mn * 6 - 90) * (Math.PI / 180); 
                                const x = center + radius * Math.cos(angle);
                                const y = center + radius * Math.sin(angle);
                                const isSelected = displayM === mn;
                                return (
                                    <button
                                        type="button"
                                        key={mn}
                                        onClick={() => handleMinuteClick(mn)}
                                        className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${isSelected ? 'text-white' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                                        style={{ left: x, top: y }}
                                    >
                                        {String(mn).padStart(2, '0')}
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <p className="mt-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Select {mode}
            </p>
        </div>
    );
};

export default TimePicker;