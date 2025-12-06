'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';
import { NeuralNetwork } from './NeuralNetwork';

export function BrainCursor() {
  const [isActive, setIsActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
    };
  }, [isActive]);

  return (
    <>
      <NeuralNetwork isActive={isActive} />

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsActive(!isActive)}
        className={`fixed bottom-10 right-10 z-[60] p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-500/50 backdrop-blur-md transition-all duration-300 ${
          isActive ? 'bg-cyan-500 text-white rotate-180' : 'bg-black/50 text-cyan-400 hover:scale-110'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Brain size={24} className={isActive ? "animate-pulse" : ""} />
      </motion.button>

      {/* Custom Cursor */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[60] mix-blend-screen"
            animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
            transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
          >
            {/* Main Cursor */}
            <div className="relative w-8 h-8">
               <div className="absolute inset-0 rounded-full border-2 border-cyan-500 animate-[spin_2s_linear_infinite]" />
               <div className="absolute inset-2 rounded-full bg-purple-500/50 blur-sm animate-pulse" />
               <div className="absolute -inset-4 border border-dashed border-purple-500/30 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
            </div>
            
            {/* Trailing Particles - Simplified as user requested removal of old mouse effect, 
                but this is part of the 'new' cursor itself. Keeping it minimal. */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
