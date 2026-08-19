'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

interface Burst {
  angle: number;
  distance: number;
  size: number;
  color: string;
  delay: number;
}

/** Konami-code easter egg: ↑↑↓↓←→←→BA (or the `overdrive` command) triggers a power surge. */
export function Overdrive() {
  const [active, setActive] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    let progress = 0;

    const trigger = () => {
      setBursts(
        Array.from({ length: 40 }, () => ({
          angle: Math.random() * Math.PI * 2,
          distance: 150 + Math.random() * 500,
          size: 2 + Math.random() * 5,
          color: Math.random() > 0.5 ? '#22d3ee' : '#c084fc',
          delay: Math.random() * 0.3,
        }))
      );
      setActive(true);
      setTimeout(() => setActive(false), 3000);
    };

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress]) {
        progress++;
        if (progress === KONAMI.length) {
          progress = 0;
          trigger();
        }
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
    };

    const onEvent = () => trigger();

    window.addEventListener('keydown', onKey);
    window.addEventListener('vw:overdrive', onEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('vw:overdrive', onEvent);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[96] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Chromatic flash */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3, 0.8, 0] }}
            transition={{ duration: 0.6, times: [0, 0.1, 0.3, 0.5, 1] }}
          />

          {/* Shockwave rings */}
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full border-2 border-cyan-400/60"
              style={{ translateX: '-50%', translateY: '-50%' }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: '150vmax', height: '150vmax', opacity: 0 }}
              transition={{ duration: 1.6, delay, ease: 'easeOut' }}
            />
          ))}

          {/* Particle burst */}
          {bursts.map((b, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{ width: b.size, height: b.size, background: b.color, boxShadow: `0 0 12px ${b.color}` }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos(b.angle) * b.distance,
                y: Math.sin(b.angle) * b.distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 1.4, delay: b.delay, ease: 'easeOut' }}
            />
          ))}

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.15, 1], opacity: [0, 1, 1] }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono font-bold text-4xl sm:text-6xl tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]"
            >
              OVERDRIVE
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-mono text-xs sm:text-sm tracking-[0.4em] text-cyan-400"
            >
              MAXIMUM POWER UNLOCKED
            </motion.div>
          </div>

          {/* Scanline sweep */}
          <motion.div
            className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
            initial={{ top: '-20%' }}
            animate={{ top: '120%' }}
            transition={{ duration: 0.8, repeat: 2, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
