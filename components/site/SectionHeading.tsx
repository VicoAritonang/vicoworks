'use client';

import { motion, type Variants } from 'framer-motion';

/* The italic accent word sweeps in every time the heading scrolls into view. */
/* Framer animates the --sweep custom property; the mask reads it. */
const SWEEP: Variants = {
  hidden: { '--sweep': '0%' },
  visible: { '--sweep': '200%', transition: { duration: 1.8, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const MASK = {
  WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
  maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
  WebkitMaskSize: 'var(--sweep) 100%',
  maskSize: 'var(--sweep) 100%',
  WebkitMaskPosition: 'left',
  maskPosition: 'left',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
} as const;

/** Mono eyebrow + serif heading with a colourful italic tail. */
export function SectionHeading({ eyebrow, lead, accent }: { eyebrow: string; lead: string; accent: string }) {
  return (
    <motion.h2
      className="relative z-[2] mx-auto mb-pagebuilder max-w-xl text-center text-5xl font-medium tracking-tight text-balance max-sm:px-5 md:text-6xl"
      style={{ textShadow: '0px 4px 8px rgba(255,255,255,.05),0px 8px 30px rgba(255,255,255,.20)' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-50px' }}
    >
      <span className="mb-4 block font-mono text-xs font-normal tracking-widest text-black/80 uppercase dark:text-white/70">{eyebrow}</span>
      <span className="inline-block font-serif">
        {lead}{' '}
        <motion.span variants={SWEEP} style={MASK} className="inline-block px-1 pb-1 italic text-colorful animate-gradient-x">
          {accent}
        </motion.span>
      </span>
    </motion.h2>
  );
}
