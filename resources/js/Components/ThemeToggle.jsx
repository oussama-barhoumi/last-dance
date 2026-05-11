import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/Contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 p-1 flex items-center transition-colors duration-500 focus:outline-none overflow-hidden"
            aria-label="Toggle Theme"
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className="w-5 h-5 rounded-full bg-white dark:bg-zinc-950 shadow-md flex items-center justify-center relative z-10"
                animate={{ x: theme === 'dark' ? 28 : 0 }}
            >
                <AnimatePresence mode="wait">
                    {theme === 'light' ? (
                        <motion.div
                            key="sun"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <Sun className="w-3 h-3 text-orange-500" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <Moon className="w-3 h-3 text-blue-400" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            
            {/* Background Icons */}
            <div className="absolute inset-0 flex justify-between px-2 items-center opacity-30 pointer-events-none">
                <Sun className="w-3 h-3 text-gray-400" />
                <Moon className="w-3 h-3 text-gray-400" />
            </div>
        </button>
    );
}
