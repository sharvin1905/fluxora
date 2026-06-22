'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingTexts = [
  'Initializing Neural Engine...',
  'Loading Trend Database...',
  'Connecting Prediction Models...',
  'Training Forecast Engine...',
  'Ready.'
];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 4000; // 4 seconds total loading
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      // Update text based on progress
      if (newProgress < 25) setTextIndex(0);
      else if (newProgress < 50) setTextIndex(1);
      else if (newProgress < 75) setTextIndex(2);
      else if (newProgress < 95) setTextIndex(3);
      else setTextIndex(4);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(onComplete, 500); // Wait half a second at 100% before completing
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Core AI Pulse Animation */}
        <div className="relative flex items-center justify-center mb-12">
          <motion.div
            className="absolute inset-0 rounded-full border border-[var(--color-crimson)]"
            animate={{
              scale: [1, 2, 3],
              opacity: [0.8, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-[var(--color-crimson)]"
            animate={{
              scale: [1, 2, 3],
              opacity: [0.8, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1
            }}
          />
          
          {/* Main Logo Sphere */}
          <motion.div
            className="w-24 h-24 rounded-full bg-black border border-[var(--color-crimson)] shadow-[0_0_40px_rgba(220,20,60,0.6)] flex items-center justify-center relative z-10 overflow-hidden"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Golden Feather SVG Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">
              <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/>
              <path d="M16 8 2 22"/>
              <path d="M17.5 15H9"/>
            </svg>
          </motion.div>
        </div>

        {/* Progress Display */}
        <div className="w-64 flex flex-col items-center">
          <motion.h1 
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[var(--color-soft-gray)] font-mono text-sm h-6 text-center mb-4 tracking-wider"
          >
            {loadingTexts[textIndex]}
          </motion.h1>

          <div className="w-full h-1 bg-[#111111] rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[var(--color-crimson)] shadow-[0_0_10px_rgba(220,20,60,0.8)]"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>

          <div className="text-[var(--color-crimson)] font-mono text-lg mt-4 font-bold">
            {progress}%
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
