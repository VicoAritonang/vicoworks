'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { GrainGradient } from '@paper-design/shaders-react';
import { CONTACT, PROFILE } from '@/content/home';
import { FloodButton } from '@/components/site/ui';

/** Animated grainy cyan gradient; only ticks while near the viewport. */
function GradientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '200px' });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 transform-gpu">
      <div className="absolute inset-0 z-[1] dark:bg-black/35" />
      {ready && (
        <GrainGradient
          className="animate-[fade-in_0.8s_ease]"
          colorBack="#0a0a0a00"
          colors={['hsl(193, 85%, 66%)', 'hsl(196, 100%, 83%)', 'hsl(195, 100%, 50%)']}
          intensity={0.45}
          maxPixelCount={2073600}
          minPixelRatio={1}
          noise={0}
          offsetX={0}
          offsetY={0}
          rotation={0}
          scale={1}
          shape="corners"
          softness={0.76}
          speed={inView ? 1 : 0}
          style={{ height: '100%', width: '100%' }}
        />
      )}
    </div>
  );
}

/** Element drifts towards the cursor while hovered, then springs back. */
function Magnet({ children, distance = 0.6, className = '' }: { children: React.ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 100, stiffness: 400 });
  const sy = useSpring(y, { damping: 100, stiffness: 400 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseEnter={() => {
        if (ref.current) rect.current = ref.current.getBoundingClientRect();
      }}
      onMouseMove={(e) => {
        const r = rect.current;
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * distance);
        y.set((e.clientY - (r.top + r.height / 2)) * distance);
      }}
      onMouseLeave={() => {
        rect.current = null;
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Spinning circular "OPEN TO WORK" seal. Draggable, springs home on release. */
function OpenToWorkBadge({ constraints }: { constraints: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.div
      drag
      dragConstraints={constraints}
      dragSnapToOrigin
      dragElastic={0.35}
      whileDrag={{ scale: 1.08 }}
      className="absolute top-10 left-1/2 z-50 -translate-x-1/2 cursor-grab touch-none overflow-hidden rounded-full select-none active:cursor-grabbing lg:top-1/2 lg:left-1/2 lg:translate-x-[280px] lg:-translate-y-[70px]"
      style={{ WebkitTouchCallout: 'none' }}
    >
      <div className="relative rounded-full bg-blue-700 p-1.5 leading-none font-medium">
        <div className="relative size-[95px] rounded-full bg-black p-2 text-white">
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          >
            <defs>
              <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-white text-[10px] tracking-[0.12em]">
              <textPath href="#badge-circle">{CONTACT.badge}</textPath>
            </text>
          </motion.svg>
          <svg viewBox="0 0 24 24" className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
          <span className="sr-only">Open to work</span>
        </div>
      </div>
    </motion.div>
  );
}

export function ContactCta() {
  const box = useRef<HTMLDivElement>(null);

  return (
    <section id="contact" className="relative z-0 scroll-mt-20 py-pagebuilder">
      <div className="w-full border-t" />
      <div ref={box} className="relative isolate w-full overflow-hidden rounded-2xl ring-1 ring-line">
        <GradientBackground />
        <OpenToWorkBadge constraints={box} />

        <div className="relative z-10 mx-auto flex w-full flex-col items-center justify-center gap-y-2 px-4 pt-40 pb-12 text-center lg:py-10">
          <span className="mt-4 text-2xl font-light tracking-wide text-black sm:text-4xl lg:text-5xl dark:text-white">
            <h3 className="text-nowrap">
              {CONTACT.lineOne[0]} <span className="font-extrabold">{CONTACT.lineOne[1]}</span>
            </h3>
            <h3 className="mt-3 text-nowrap">
              {CONTACT.lineTwo[0]} <span className="font-extrabold">{CONTACT.lineTwo[1]}</span>
            </h3>
          </span>
          <Magnet className="my-6">
            <FloodButton href={`mailto:${PROFILE.email}`}>{CONTACT.cta}</FloodButton>
          </Magnet>
          <p className="font-display text-base lg:text-2xl">{CONTACT.availability}</p>
          <p className="my-2 text-sm font-extralight tracking-wide text-balance opacity-75 lg:text-xl">
            {CONTACT.body[0]}
            <br className="max-sm:hidden" /> {CONTACT.body[1]}
          </p>
        </div>

        {['bottom-6 left-8', 'right-8 bottom-6'].map((pos) => (
          <span key={pos} className={`absolute ${pos} z-10 text-foreground/40`} aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4v16M4 12h16" />
            </svg>
          </span>
        ))}
      </div>
      <div className="w-full border-t" />
    </section>
  );
}
