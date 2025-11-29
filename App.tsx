import React, { useState, useEffect, useRef } from 'react';
import { HabitProvider } from './context/HabitContext';
import { ThemeProvider } from './context/ThemeContext';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import Stats from './pages/Stats';
import AddHabit from './pages/AddHabit';
import Settings from './pages/Settings';
import Overview from './pages/Overview';
import { AnimatePresence, motion, Variants } from 'framer-motion';

// Order of tabs for swipe logic - Calendar is excluded as it's a sub-view
const TABS = ['dashboard', 'overview', 'stats', 'settings'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(undefined);
  const [habitIdToEdit, setHabitIdToEdit] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [direction, setDirection] = useState(0);

  // Scroll to top immediately when tab changes for a "clean" slate
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleNavigate = (tab: string, habitId?: string) => {
    if (tab === 'add') {
        setHabitIdToEdit(undefined);
        setShowModal(true);
        return;
    }
    if (tab === 'edit') {
        setHabitIdToEdit(habitId);
        setShowModal(true);
        return;
    }

    // Special case for entering Calendar detail view
    if (tab === 'calendar') {
        setDirection(1); // Slide in from right
        setSelectedHabitId(habitId);
        setActiveTab(tab);
        return;
    }

    // Determine direction
    const currentIdx = TABS.indexOf(activeTab);
    const newIdx = TABS.indexOf(tab);

    // If leaving Calendar (which isn't in TABS), slide back to left
    if (activeTab === 'calendar') {
        setDirection(-1);
    } 
    // Standard tab navigation
    else if (currentIdx !== -1 && newIdx !== -1) {
        setDirection(newIdx > currentIdx ? 1 : -1);
    } else {
        setDirection(0);
    }

    setSelectedHabitId(habitId);
    setActiveTab(tab);
  };

  // Swipe Logic
  const touchStartRef = useRef<number | null>(null);
  const minSwipeDistance = 40; 

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStartRef.current - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Don't swipe if not on a main tab
    const currentIdx = TABS.indexOf(activeTab);
    if (currentIdx === -1) return; 

    if (isLeftSwipe && currentIdx < TABS.length - 1) {
        handleNavigate(TABS[currentIdx + 1]);
    }

    if (isRightSwipe && currentIdx > 0) {
        handleNavigate(TABS[currentIdx - 1]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard onNavigate={handleNavigate} />;
        case 'calendar':
            return (
                <CalendarView 
                    initialHabitId={selectedHabitId} 
                    onBack={() => handleNavigate('dashboard')} 
                />
            );
        case 'overview':
            return <Overview />;
        case 'stats':
            return <Stats />;
        case 'settings':
            return <Settings />;
        default:
            return null;
    }
  };

  // Optimized Tween Transition (smoother, less laggy than spring)
  const pageVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
      position: 'absolute',
      zIndex: 1,
      width: '100%',
      top: 0,
      left: 0,
    }),
    center: {
      x: '0%',
      opacity: 1,
      zIndex: 1,
      position: 'relative',
      transition: {
        duration: 0.35,
        ease: [0.32, 0.725, 0.25, 1], // iOS-style cubic-bezier
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1,
      zIndex: 0,
      position: 'absolute',
      width: '100%',
      top: 0,
      left: 0,
      transition: {
        duration: 0.35,
        ease: [0.32, 0.725, 0.25, 1],
      }
    }),
  };

  return (
    <ThemeProvider>
        <HabitProvider>
        <div 
            className="min-h-screen bg-white dark:bg-dark-bg font-sans text-zinc-900 dark:text-white selection:bg-violet-500 selection:text-white relative overflow-x-hidden touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                    key={activeTab}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full min-h-screen will-change-transform bg-white dark:bg-dark-bg"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
            
            {/* Nav remains visible even in detail views like Calendar, though unselected */}
            <BottomNav currentTab={activeTab} onChange={(t) => handleNavigate(t)} />

            <AnimatePresence>
                {showModal && (
                    <AddHabit 
                        habitId={habitIdToEdit} 
                        onClose={() => setShowModal(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
        </HabitProvider>
    </ThemeProvider>
  );
};

export default App;