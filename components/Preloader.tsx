'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  '> INITIALIZING VICOWORKS.SYS ...',
  '> LOADING NEURAL MODULES ......... OK',
  '> MOUNTING PORTFOLIO DATA ........ OK',
  '> CALIBRATING VISUAL CORTEX ...... OK',
  '> ESTABLISHING UPLINK ............ OK',
  '> ACCESS GRANTED. WELCOME.',
];

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [progress, setProgress] = useState(0);

  // Only run the boot sequence once per browser session
  useEffect(() => {
    const seen = sessionStorage.getItem('vw-booted');
    if (!seen) {
      setVisible(true);
      document.documentElement.style.overflow = 'hidden';
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const lineTimer = setInterval(() => {
      setLineCount(prev => {
        if (prev >= BOOT_LINES.length) {
          clearInterval(lineTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 260);

    const progressTimer = setInterval(() => {
      setProgress(prev => Math.min(100, prev + Math.random() * 12 + 4));
    }, 130);

    const doneTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        sessionStorage.setItem('vw-booted', '1');
        setVisible(false);
        document.documentElement.style.overflow = '';
      }, 450);
    }, 2100);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
      document.documentElement.style.overflow = '';
    };
  }, [visible]);

  if (!checked) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#030305] flex items-center justify-center px-6"
          exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.04 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          {/* Scanline texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40" />

          <div className="w-full max-w-md font-mono">
            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-cyan-500 animate-pulse" />
              <span className="text-cyan-400 tracking-[0.4em] text-sm">VICOWORKS://BOOT</span>
            </motion.div>

            {/* Boot log */}
            <div className="space-y-1.5 min-h-[150px] text-xs sm:text-sm">
              {BOOT_LINES.slice(0, lineCount).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={i === BOOT_LINES.length - 1 ? 'text-cyan-300' : 'text-gray-500'}
                >
                  {line}
                </motion.div>
              ))}
              <span className="inline-block w-2 h-4 bg-cyan-500 align-middle animate-[blink-caret_0.8s_steps(1)_infinite]" />
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="flex justify-between text-[10px] text-gray-600 mb-2 tracking-widest">
                <span>SYSTEM LOAD</span>
                <span className="text-cyan-500">{Math.floor(progress)}%</span>
              </div>
              <div className="h-[3px] w-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
