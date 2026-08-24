'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * Site-wide ambient background.
 *
 * A graphite field with two barely-there washes — one warm, one cool. No grid,
 * no particles, no glow. Every value comes from a --bg-* token in globals.css,
 * so the dark and light compositions are authored independently.
 */
export function Background() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  const warmY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const coolY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  const drift = reduceMotion ? undefined : { scale: [1, 1.06, 1] };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-bg pointer-events-none"
    >
      {/* Base field */}
      <div className="absolute inset-0" style={{ background: 'var(--bg-field)' }} />

      {/* Warm wash, lower right — the only place the accent hue appears at scale */}
      <motion.div
        className="absolute -bottom-[30%] -right-[20%] w-[70vw] h-[70vw] rounded-full"
        style={{ y: warmY, background: 'var(--bg-warm)', filter: 'blur(90px)' }}
        animate={drift}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cool wash, upper left */}
      <motion.div
        className="absolute -top-[25%] -left-[20%] w-[65vw] h-[65vw] rounded-full"
        style={{ y: coolY, background: 'var(--bg-cool)', filter: 'blur(90px)' }}
        animate={drift}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      {/* Grounding: settle the lower edge back to the base colour */}
      <div className="absolute inset-0" style={{ background: 'var(--bg-ground)' }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: 'var(--bg-vignette)' }} />

      {/* Dither: static noise, purely to stop the wide gradients from banding */}
      <div className="dither-overlay" />
    </div>
  );
}
