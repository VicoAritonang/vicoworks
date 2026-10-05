'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { FEATURED_PROJECTS, type FeaturedProject } from '@/content/home';
import { TechIcon } from '@/components/site/TechIcon';
import { MonoLink, SectionHeading } from '@/components/site/ui';
import { ProjectMock } from './ProjectMock';

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
const LAYOUT = { duration: 0.45, ease: EASE_OUT_QUINT };

const ACCENT = {
  purple: { fill: 'fill-purple-500 dark:fill-purple-400', bg: 'bg-purple-500 dark:bg-purple-400', glow: 'drop-shadow-[0_0_16px_rgb(168_85_247/0.9)]', text: 'text-purple-600 dark:text-purple-400' },
  emerald: { fill: 'fill-emerald-500 dark:fill-emerald-400', bg: 'bg-emerald-500 dark:bg-emerald-400', glow: 'drop-shadow-[0_0_16px_rgb(16_185_129/0.9)]', text: 'text-emerald-600 dark:text-emerald-400' },
  blue: { fill: 'fill-blue-500 dark:fill-blue-400', bg: 'bg-blue-500 dark:bg-blue-400', glow: 'drop-shadow-[0_0_16px_rgb(59_130_246/0.9)]', text: 'text-blue-600 dark:text-blue-400' },
  orange: { fill: 'fill-orange-500 dark:fill-orange-400', bg: 'bg-orange-500 dark:bg-orange-400', glow: 'drop-shadow-[0_0_16px_rgb(249_115_22/0.9)]', text: 'text-orange-600 dark:text-orange-400' },
  amber: { fill: 'fill-amber-500 dark:fill-amber-400', bg: 'bg-amber-500 dark:bg-amber-400', glow: 'drop-shadow-[0_0_16px_rgb(245_158_11/0.9)]', text: 'text-amber-600 dark:text-amber-400' },
} as const;

/* ---------- Cursor follower ---------- */

const noopSubscribe = () => () => {};

/**
 * Replaces the cursor with a spinning "OPEN · EXPLORE · DISCOVER" seal while
 * the pointer is over the parent element. Desktop only.
 */
function Pointer() {
  const anchor = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 25, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 300, damping: 25, mass: 0.1 });
  const [over, setOver] = useState(false);
  /* true on the client, false during SSR – gates the portal. */
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    const parent = anchor.current?.parentElement;
    if (!parent || window.matchMedia('(max-width: 1023px)').matches) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const enter = (e: MouseEvent) => {
      move(e);
      setOver(true);
    };
    const leave = () => setOver(false);
    parent.addEventListener('mousemove', move);
    parent.addEventListener('mouseenter', enter);
    parent.addEventListener('mouseleave', leave);
    return () => {
      parent.removeEventListener('mousemove', move);
      parent.removeEventListener('mouseenter', enter);
      parent.removeEventListener('mouseleave', leave);
    };
  }, [x, y]);

  return (
    <>
      <div ref={anchor} className="hidden" />
      {mounted &&
        createPortal(
          <AnimatePresence mode="wait">
            {over && (
              <motion.div
                className="pointer-events-none fixed top-0 left-0 z-[999]"
                style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <div className="pointer-events-none rounded-full border border-dotted border-zinc-200/90 p-1">
                  <div className="relative">
                    <div className="grid size-[92px] place-items-center rounded-full bg-zinc-200/90 text-black">
                      <motion.svg viewBox="0 0 100 100" className="size-20" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} aria-hidden="true">
                        <defs>
                          <path id="pointer-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                        </defs>
                        <text className="fill-current text-[11.5px] font-medium tracking-[0.12em]">
                          <textPath href="#pointer-circle">OPEN · EXPLORE · DISCOVER · </textPath>
                        </text>
                      </motion.svg>
                    </div>
                    <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black">
                      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

/* ---------- Card ---------- */

function ProjectVisual({ p, large = false }: { p: FeaturedProject; large?: boolean }) {
  return (
    <a
      href={p.caseStudy ? `/projects/${p.slug}` : p.href}
      {...(p.caseStudy ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      aria-label={p.caseStudy ? `${p.name} case study` : `Open ${p.name}`}
      draggable={false}
      className="group relative block aspect-[16/11] w-full cursor-pointer overflow-hidden rounded-2xl bg-white p-1 shadow-border sm:aspect-video md:aspect-[16/10] lg:aspect-[16/11] lg:rounded-3xl lg:p-2 dark:bg-white/[0.06]"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-px bg-[linear-gradient(90deg,transparent_5%,rgba(255,255,255,0.8)_35%,#fff_50%,rgba(255,255,255,0.8)_65%,transparent_95%)] dark:block" />
      <div className="relative flex size-full flex-col items-center justify-between overflow-hidden rounded-xl bg-white max-lg:pt-2 lg:rounded-2xl dark:bg-black">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] transition-[transform,filter] duration-500 ease-in-out group-hover:scale-105 lg:brightness-95 lg:saturate-90 lg:group-hover:brightness-110 lg:group-hover:saturate-125"
          style={{ background: p.gradient }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 hidden h-[0.8px] bg-[linear-gradient(90deg,transparent_20%,#fff_50%,transparent_80%)] opacity-70 dark:block" />
        <div className={`z-10 flex w-full flex-row items-center justify-between gap-8 px-4 py-2 text-white/70 md:px-6 md:py-4 ${large ? 'lg:px-10 lg:py-8' : 'lg:px-5 lg:py-5'}`}>
          <h3 className={`text-sm text-balance sm:text-base ${large ? 'md:text-2xl' : 'md:text-lg'}`}>{p.headline}</h3>
          <svg viewBox="0 0 24 24" className={`hidden size-5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 sm:block ${large ? 'md:size-6' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
        <div className="absolute top-14 right-0 left-0 z-10 flex w-full flex-col items-center justify-center px-6 md:top-20 md:px-12 lg:top-28">
          {p.image ? (
            <Image src={p.image} alt={`${p.name} screenshot`} width={1600} height={1000} className="h-auto w-full rounded-t-sm border-2 border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.4),0_15px_50px_-5px_rgba(0,0,0,0.5)] lg:border-3" />
          ) : (
            p.mock && <ProjectMock kind={p.mock} />
          )}
        </div>
      </div>
      {large && <Pointer />}
    </a>
  );
}

function TechChips({ tech, className = '' }: { tech: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  return (
    <div ref={ref} className={`flex flex-wrap gap-1.5 sm:gap-2 ${className}`}>
      {tech.map((t, i) => (
        <motion.div key={t} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : undefined} transition={{ delay: 0.05 * i, duration: 0.3 }}>
          <span className="flex items-center rounded-md bg-foreground/5 px-2 py-1 font-mono shadow-border sm:px-2.5 sm:py-[5px]">
            <TechIcon name={t} className="mr-1.5 size-3 sm:size-3.5" />
            <span className="text-[10px] font-medium tracking-wide text-neutral-600 uppercase sm:text-[11px] dark:text-neutral-300">{t}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Desktop: cards left, sticky details right ---------- */

function Star({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`me-1.5 mt-[2px] size-5 shrink-0 transition-all duration-300 ${className}`} aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  );
}

function DetailPanel({ p }: { p: FeaturedProject }) {
  const a = ACCENT[p.color];
  return (
    <div className="flex">
      <div aria-hidden="true" className={`my-4 me-4 h-[2px] min-w-6 transition-all duration-300 ${a.bg} ${a.glow}`} />
      <motion.div layout transition={LAYOUT}>
        <motion.h3 layout transition={LAYOUT} className="font-display text-2xl text-foreground">
          {p.name}
        </motion.h3>
        <motion.p layout transition={LAYOUT} className="my-2 text-sm font-light text-foreground/90 xl:text-base">
          {p.body}
        </motion.p>
        <motion.ul layout transition={LAYOUT} className="mt-4 flex flex-col gap-y-2 text-sm text-foreground/90 xl:text-base">
          {p.bullets.map((b) => (
            <motion.li key={b} layout transition={LAYOUT} className="flex items-start">
              <Star className={`${a.fill} ${a.glow}`} />
              <span>{b}</span>
            </motion.li>
          ))}
        </motion.ul>
        <motion.div layout transition={LAYOUT}>
          <TechChips key={p.slug} tech={p.tech} className="mt-6" />
        </motion.div>
        <motion.div layout transition={LAYOUT} className="mt-6">
          <a
            href={p.caseStudy ? `/projects/${p.slug}` : p.href}
            {...(p.caseStudy ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="group inline-flex items-center gap-2 font-mono text-xs text-neutral-800 uppercase hover:text-black dark:text-white/80 dark:hover:text-white"
          >
            {p.caseStudy ? 'Read the case study' : 'Visit live site'}
            <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProjectsListDesktop() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = refs.current.indexOf(e.target as HTMLDivElement);
            if (i !== -1) setActive(i);
          }
        });
      },
      { threshold: 0, rootMargin: '-50% 0px -50% 0px' }
    );
    refs.current.filter(Boolean).forEach((el) => io.observe(el!));
    return () => io.disconnect();
  }, []);

  return (
    <div aria-label="Projects list" className="relative hidden w-full lg:flex">
      <div className="mx-auto flex w-full flex-col gap-y-20 md:ps-2 lg:max-w-[60%] lg:gap-y-32 2xl:px-6">
        {FEATURED_PROJECTS.map((p, i) => (
          <motion.div
            key={p.slug}
            role="article"
            aria-label={`Project ${p.name}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="group relative flex w-full flex-col gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="relative w-full transition-all duration-500 group-hover:-translate-y-2">
              <ProjectVisual p={p} large />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="hidden py-4 lg:sticky lg:block lg:w-[40%] lg:pl-8">
        <div className="sticky top-32">
          <DetailPanel p={FEATURED_PROJECTS[active]} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile / tablet ---------- */

function ProjectHeader({ p, index }: { p: FeaturedProject; index: number }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-wider text-neutral-600 uppercase dark:text-neutral-400">{String(index + 1).padStart(2, '0')}</span>
          <div className="h-px w-8 bg-neutral-200 dark:bg-neutral-800" />
          <span className="font-mono text-[10px] tracking-wider text-neutral-600 uppercase dark:text-neutral-400">{p.kind}</span>
        </div>
        <a href={p.caseStudy ? `/projects/${p.slug}` : p.href} className="group flex items-center gap-2">
          <h3 className="font-display text-2xl leading-tight text-neutral-900 dark:text-white">{p.name}</h3>
        </a>
      </div>
      <span className="inline-flex w-fit items-center justify-center rounded-md px-2 py-1 font-mono text-[11px] whitespace-nowrap text-neutral-600 shadow-border dark:text-neutral-300">{p.year}</span>
    </div>
  );
}

export function CuratedWork() {
  return (
    <section id="work" className="relative w-full scroll-mt-20 px-2 py-pagebuilder">
      <SectionHeading eyebrow="Case Studies" lead="Curated" accent="work" />

      <div className="flex flex-col gap-pagebuilder lg:hidden">
        {FEATURED_PROJECTS.map((p, i) => (
          <div key={p.slug} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <ProjectHeader p={p} index={i} />
              <ProjectVisual p={p} />
            </div>
            <TechChips tech={p.tech} />
          </div>
        ))}
      </div>

      <ProjectsListDesktop />

      <MonoLink href="/projects">See more projects</MonoLink>
    </section>
  );
}
