'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionTemplate, useMotionValue, type Variants } from 'framer-motion';
import { BUCKET_ITEMS, PROFILE_PHOTO } from '@/content/home';
import { TechIcon } from '@/components/site/TechIcon';

/* =====================================================================
 * Let's Build Together – portrait in a ring, with collaborators popping
 * in around it on hover.
 * ===================================================================== */

const POP: Variants = {
  idle: { scale: 0, opacity: 0, y: 0 },
  active: { y: [-20, 0, 4, 0], scale: [0.75, 1], opacity: [0, 1] },
};

/* Desktop: these pop in on hover. Mobile: always shown, in fixed corners. */
const BUBBLES = [
  { name: 'Gmail', left: '28%', top: '58%', size: 'size-12', delay: 0.1 },
  { name: 'Google Calendar', left: '63%', top: '56%', size: 'size-14', delay: 0.3 },
  { name: 'Claude', left: '32%', top: '4%', size: 'size-13', delay: 0.2 },
  { name: 'Spotify', left: '80%', top: '8%', size: 'size-10', delay: 0.4 },
  { name: 'Gemini', left: '11%', top: '7%', size: 'size-9', delay: 0.5 },
];
const MOBILE_BUBBLES = [
  { name: 'Gmail', className: 'absolute top-6 left-4', size: 'size-10' },
  { name: 'Google Calendar', className: 'absolute bottom-20 left-18', size: 'size-9' },
  { name: 'Claude', className: 'absolute top-4 right-16', size: 'size-14' },
  { name: 'Spotify', className: 'absolute right-4 bottom-20', size: 'size-11' },
];

function Ring({ size, className = '', children }: { size: string; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`grid place-items-center rounded-full border border-neutral-200 bg-surface transition-colors delay-300 duration-500 group-hover:border-indigo-400 dark:border-white/10 dark:group-hover:border-indigo-400/70 ${size} ${className}`}
    >
      {children}
    </div>
  );
}

/** Concentric half-rings behind the portrait; they tint indigo on hover. */
function Radar() {
  return (
    <svg className="absolute top-0 left-1/2 -translate-x-1/2" width="704" height="250" viewBox="0 0 704 250" aria-hidden="true">
      {[240, 190, 140].map((r, i) => (
        <circle
          key={r}
          cx="352"
          cy="104"
          r={r}
          className={`transition-colors delay-[400ms] duration-700 ${
            i === 0
              ? 'fill-neutral-100/40 group-hover:fill-indigo-300/20 dark:fill-white/[0.015] dark:group-hover:fill-indigo-500/[0.06]'
              : i === 1
                ? 'fill-neutral-200/30 group-hover:fill-indigo-300/25 dark:fill-white/[0.025] dark:group-hover:fill-indigo-500/10'
                : 'fill-neutral-300/30 group-hover:fill-indigo-400/30 dark:fill-white/[0.04] dark:group-hover:fill-indigo-500/15'
          }`}
        />
      ))}
    </svg>
  );
}

export function ConnectionsVisual() {
  return (
    <motion.div aria-hidden="true" className="absolute flex h-[300px] w-full flex-col overflow-hidden max-sm:bottom-2" initial="idle" whileHover="active">
      <div className="relative size-full [mask-image:linear-gradient(to_right,transparent,black_40%,black_60%,transparent)]">
        <Radar />
        <span className="absolute top-2.5 left-1/2 -translate-x-1/2">
          <div className="relative mt-9">
            <svg className="mx-auto" width="148" height="148" viewBox="0 0 148 148" fill="none">
              <rect className="fill-surface" x="16" y="16" width="116" height="116" rx="58" />
              <rect
                className="stroke-neutral-300 transition-colors delay-200 duration-500 group-hover:stroke-indigo-400 dark:stroke-neutral-700 dark:group-hover:stroke-indigo-400"
                x="16.75"
                y="16.75"
                width="114.5"
                height="114.5"
                rx="57.25"
                strokeWidth="1.5"
              />
            </svg>
            <Image
              src={PROFILE_PHOTO}
              alt="Vico Aritonang"
              width={96}
              height={96}
              className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-200 object-cover object-top transition-colors delay-100 duration-500 group-hover:border-indigo-400 dark:border-neutral-800"
            />
          </div>
        </span>
        <span className="hidden lg:block">
          {BUBBLES.map((b) => (
            <motion.div
              key={b.name}
              className={`absolute z-10 p-1 ${b.size}`}
              style={{ top: b.top, left: b.left }}
              variants={POP}
              transition={{ duration: 0.25, delay: b.delay, ease: 'easeOut' }}
            >
              <Ring size="size-full">
                <TechIcon name={b.name} className="size-1/2" />
              </Ring>
            </motion.div>
          ))}
        </span>
        <span className="lg:hidden">
          {MOBILE_BUBBLES.map((b) => (
            <Ring key={b.name} size={b.size} className={b.className}>
              <TechIcon name={b.name} className="size-1/2" />
            </Ring>
          ))}
        </span>
      </div>
    </motion.div>
  );
}

/* =====================================================================
 * Tech Stack – three marquee rows of badges with a draggable magnifying
 * glass. Under the lens the rows are drawn 1.4× and brighter; the base
 * layer has a matching hole punched out.
 * ===================================================================== */

const CLOUD = [
  'Go', 'Python', 'TypeScript', 'Next.js', 'React', 'Tailwind CSS',
  'Docker', 'Google Cloud', 'AWS', 'Lambda', 'Step Functions', 'Supabase',
  'PostgreSQL', 'n8n', 'Gemini', 'Claude', 'Vercel', 'GitHub',
  'Android', 'Figma', 'Linear', 'Zed', 'Ghostty', 'Spotify',
];
const per = Math.ceil(CLOUD.length / 3);
const second = Math.ceil((CLOUD.length - per) / 2);
const ROWS = [CLOUD.slice(0, per), CLOUD.slice(per, per + second), CLOUD.slice(per + second)].map((r) => [...r, ...r, ...r]);

function Badge({ name }: { name: string }) {
  return (
    <span
      aria-label={name}
      className="inline-flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-md bg-surface px-3 py-1 font-mono text-xs whitespace-nowrap text-neutral-600 shadow-border transition-shadow delay-200 duration-500 group-hover:ring-1 group-hover:ring-indigo-400/40 dark:text-neutral-300 dark:group-hover:ring-indigo-400/30"
    >
      <TechIcon name={name} className="mr-1 size-3.5" />
      <span>{name}</span>
    </span>
  );
}

function Row({ index }: { index: number }) {
  return (
    <motion.div
      className="flex w-max gap-3"
      animate={{ x: index % 2 === 0 ? ['0%', '-33.333%'] : ['-33.333%', '0%'] }}
      transition={{ duration: 50, ease: 'linear', repeat: Infinity }}
    >
      {ROWS[index].map((n, i) => (
        <Badge key={`${n}-${i}`} name={n} />
      ))}
    </motion.div>
  );
}

/** Magnifying glass: steel rim and handle around a clear lens. */
function Magnifier({ size = 105 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" aria-hidden="true">
      <path d="M322 334l36-36 132 132a25 25 0 0 1-36 36z" fill="#333333" />
      <path d="M322 334l36-36 26 26-36 36z" fill="#7A858C" />
      <circle cx="210" cy="210" r="160" stroke="#B0BDC6" strokeWidth="26" />
      <circle cx="210" cy="210" r="145" stroke="#DFE9EF" strokeWidth="6" />
      <circle cx="210" cy="210" r="174" stroke="#575B5E" strokeOpacity="0.4" strokeWidth="3" />
      <path d="M118 168a104 104 0 0 1 56-60" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

export function TechCloudVisual() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const R = 25.2;
  const at = useMotionTemplate`calc(50% + ${x}px - 12px) calc(50% + ${y}px + 10px - 12px)`;
  const clip = useMotionTemplate`circle(${R}px at ${at})`;
  const hole = useMotionTemplate`radial-gradient(circle ${R}px at ${at}, transparent 100%, black 100%)`;

  return (
    <div className="relative flex size-full flex-col items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <motion.div className="relative z-10 flex size-full flex-col justify-center gap-10 opacity-80" style={{ WebkitMaskImage: hole, maskImage: hole }}>
        {ROWS.map((_, i) => (
          <Row key={`base-${i}`} index={i} />
        ))}
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex h-full flex-col justify-center gap-10 brightness-150 select-none"
        style={{ clipPath: clip, scale: 1.4, transformOrigin: at }}
      >
        {ROWS.map((_, i) => (
          <Row key={`lens-${i}`} index={i} />
        ))}
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 cursor-grab drop-shadow-xl active:cursor-grabbing"
        drag
        dragSnapToOrigin
        style={{ x, y, marginTop: 10 }}
      >
        <Magnifier />
      </motion.div>
    </div>
  );
}

/* =====================================================================
 * What You Get – an open box; every 2.5s a pill card drops in from above
 * and the previous one sinks behind the front panel.
 * ===================================================================== */

const BUCKET_ICONS: Record<string, string> = {
  clock: 'M12 7v5l3 2M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z',
  bolt: 'M13 3L5 14h6l-1 7 8-11h-6z',
  wrench: 'M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-.7-.7-2.6z',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4',
  chat: 'M4 5h16v11H8l-4 4zM8 10h.01M12 10h.01M16 10h.01',
  code: 'M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14',
  shield: 'M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6zM9 12l2 2 4-4',
  cloud: 'M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-1 9z',
};

const EASE = [0.455, 0.03, 0.515, 0.955] as const;

/** Open cardboard-style box drawn in currentColor, so it tints on hover. */
function BoxBack() {
  return (
    <svg className="absolute inset-0 z-0 text-neutral-800 transition-colors delay-300 duration-500 group-hover:text-indigo-500 dark:text-white dark:group-hover:text-indigo-400" width="100%" height="100%" viewBox="0 0 655 352" fill="none" aria-hidden="true">
      {/* back flap */}
      <path d="M171 43H488L536 79H123z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
      {/* left flap */}
      <path d="M123 79L171 43L95 12L52 36z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
      {/* right flap */}
      <path d="M536 79L488 43L564 12L604 36z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
      {/* inner walls */}
      <path d="M171 79V43L123 79z" fill="currentColor" fillOpacity="0.2" />
      <path d="M488 79V43L536 79z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}
function BoxFront() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden text-neutral-800 transition-colors delay-300 duration-500 group-hover:text-indigo-500 dark:text-white dark:group-hover:text-indigo-400"
      width="100%"
      height="100%"
      viewBox="0 0 655 352"
      fill="none"
      style={{ transform: 'translate3d(0,0,0)' }}
      aria-hidden="true"
    >
      {/* Opaque front panel: the sinking card disappears behind it. */}
      <path className="fill-[#f9f9fa] dark:fill-[#0b0b0b]" d="M124 79H537V351H124z" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
      {/* front lip folding outwards */}
      <path d="M75 164L123 79H536L582 164C588 176 591 182 589 187C586 191 579 191 565 191H91C77 191 70 191 67 187C65 182 69 176 75 164z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.5" />
    </svg>
  );
}

export function BucketVisual() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '200px' });
  const item = BUCKET_ITEMS[index];

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % BUCKET_ITEMS.length), 2500);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="relative flex h-fit w-full flex-col items-center justify-center gap-4">
      <div className="relative isolate w-full max-w-xs" style={{ aspectRatio: '655/352' }}>
        <BoxBack />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative flex size-full items-center justify-center" style={{ paddingBottom: '65%' }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={item.title}
                className="pointer-events-auto absolute z-10 flex w-48 origin-bottom items-center gap-1.5 rounded-full border border-line bg-white p-1 pl-1.5 shadow-sm transition-[border-color,box-shadow] delay-100 duration-500 group-hover:border-indigo-400/50 group-hover:shadow-indigo-500/10 dark:bg-neutral-900"
                initial={{ y: -70, opacity: 0, scale: 0.7, transition: { duration: 2, delay: 0.5, ease: EASE } }}
                animate={{ y: 0, opacity: 1, scale: 1.05 }}
                exit={{ y: 90, scale: 0.7, transition: { duration: 0.8 } }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-500/10 text-muted transition-colors delay-200 duration-500 group-hover:bg-indigo-500/15 group-hover:text-indigo-500 dark:group-hover:bg-indigo-400/15 dark:group-hover:text-indigo-400">
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={BUCKET_ICONS[item.icon]} />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs leading-none font-medium text-foreground">{item.title}</span>
                  <span className="line-clamp-1 text-[10px] text-muted">{item.description}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <BoxFront />
      </div>
    </div>
  );
}
