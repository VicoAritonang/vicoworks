'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { MORE_NAV, NAV_ITEMS } from '@/content/home';
import { CommandMenuProvider, useCommandMenu } from './CommandMenu';

/* Shared surface for the morphing pill and the search button. */
const SURFACE =
  'bg-white/90 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.22),0_3px_8px_-4px_rgba(0,0,0,0.08)] shadow-border backdrop-blur-md dark:bg-neutral-800/90 dark:shadow-none';
const FOCUS = 'rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-white/25';

const PILL_SPRING = { type: 'spring', stiffness: 170, damping: 26 } as const;
const LAMP_SPRING = { type: 'spring', stiffness: 350, damping: 30 } as const;

const CONTENT: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 28 } },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15, ease: 'easeIn' } },
};
const CONTENT_REDUCED: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};
const DROPDOWN: Variants = {
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const DROPDOWN_ITEM: Variants = {
  closed: { opacity: 0, y: 8, transition: { duration: 0.1 } },
  open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const GREETING_EMOJI: Record<string, string> = {
  'Good Morning': '🌅',
  'Good Afternoon': '☀️',
  'Good Evening': '🌙',
};

const noopSubscribe = () => () => {};

function getGreeting() {
  const h = new Date().getHours();
  return h >= 5 && h < 12 ? 'Good Morning' : h >= 12 && h < 17 ? 'Good Afternoon' : 'Good Evening';
}

function useIsMobile(breakpoint = 1023) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [breakpoint]);
  return mobile;
}

/* ---------- Small icons ---------- */

const Svg = ({ d, className = 'size-4' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const LINK_ICONS: Record<string, string> = {
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16M8 7h7M8 11h5',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
};
const MAGNIFIER = 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4';

/* ---------- Lamp: highlight pill + glowing bar that slides over the active item ---------- */

function Lamp({ rect, reduce }: { rect: { left: number; width: number } | null; reduce: boolean }) {
  if (!rect) return null;
  const { left, width } = rect;
  const barX = left + width / 2 - 16;
  return (
    <AnimatePresence>
      <motion.span
        key="lamp-pill"
        className="absolute inset-y-0 left-0 -z-10 rounded-full bg-neutral-900/[0.08] dark:bg-white/10"
        initial={{ x: left, width, opacity: 0 }}
        animate={{ x: left, width, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reduce ? { duration: 0 } : LAMP_SPRING}
      />
      {!reduce && (
        <motion.div
          key="lamp-glow"
          className="pointer-events-none absolute -top-2 left-0 -z-10 h-1 w-8 rounded-t-full bg-neutral-900 dark:bg-neutral-200"
          initial={{ x: barX, opacity: 0 }}
          animate={{ x: barX, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={LAMP_SPRING}
        >
          <div className="absolute -top-3 -left-2 h-7 w-12 rounded-full bg-[radial-gradient(farthest-side_at_50%_50%,rgba(23,23,23,0.6),transparent)] blur-md dark:bg-[radial-gradient(farthest-side_at_50%_50%,rgba(229,229,229,0.62),transparent)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Desktop content ---------- */

function DesktopNav({
  activeId,
  moreOpen,
  setMoreOpen,
  navRef,
  reduce,
  variants,
}: {
  activeId: string;
  moreOpen: boolean;
  setMoreOpen: (v: boolean) => void;
  navRef: (el: HTMLUListElement | null) => void;
  reduce: boolean;
  variants: Variants;
}) {
  const { openConnect } = useCommandMenu();
  const ulRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const moreBtn = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [rect, setRect] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    requestAnimationFrame(() => {
      const el = itemRefs.current.get(activeId);
      if (!el || !ulRef.current) return setRect(null);
      if (el.offsetWidth > 0) setRect({ left: el.offsetLeft, width: el.offsetWidth });
    });
  }, [activeId]);

  useEffect(measure, [measure]);
  useEffect(() => {
    const el = ulRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        moreBtn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [moreOpen, setMoreOpen]);

  const register = (id: string) => (el: HTMLElement | null) => {
    if (el) itemRefs.current.set(id, el);
  };
  const closeMore = () => setMoreOpen(false);

  return (
    <motion.div
      key="desktop"
      className="relative flex w-full flex-col items-center py-1"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onAnimationComplete={measure}
      onMouseLeave={() => {
        clearTimeout(hoverTimer.current);
        closeMore();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMore();
      }}
    >
      <div className="relative flex items-center">
        <Lamp rect={rect} reduce={reduce} />
        <ul
          className="relative flex items-center"
          ref={(el) => {
            ulRef.current = el;
            navRef(el);
          }}
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.id} ref={register(item.id)} className="relative list-none" onMouseEnter={() => moreOpen && closeMore()}>
              <Link
                href={item.href}
                aria-current={activeId === item.id ? 'page' : undefined}
                className={`block px-4 py-1.5 text-sm font-normal transition-colors duration-150 ${FOCUS} ${
                  activeId === item.id
                    ? 'text-neutral-950 dark:text-white'
                    : 'text-neutral-700 hover:text-neutral-950 dark:text-white/70 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li
            ref={register('more-dropdown')}
            className="relative list-none"
            onMouseEnter={() => {
              hoverTimer.current = setTimeout(() => setMoreOpen(true), 150);
            }}
            onMouseLeave={() => clearTimeout(hoverTimer.current)}
          >
            <button
              ref={moreBtn}
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="true"
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex cursor-pointer items-center gap-0.5 px-4 py-1.5 text-sm font-normal text-neutral-700 transition-colors duration-150 select-none hover:text-neutral-950 dark:text-white/70 dark:hover:text-white ${FOCUS}`}
            >
              {MORE_NAV.label}
              <Svg d="M6 9l6 6 6-6" className={`size-3.5 transition-transform duration-200 ease-out ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
          </li>
          <li className="ml-1 list-none" onMouseEnter={() => moreOpen && closeMore()}>
            <button
              type="button"
              onClick={openConnect}
              className="relative inline-block h-full cursor-pointer overflow-hidden rounded-full bg-neutral-200 px-4 py-1.5 text-sm font-normal whitespace-nowrap text-neutral-800 transition-colors duration-200 outline-none hover:bg-neutral-300 hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15 dark:hover:text-white dark:focus-visible:ring-white/25"
            >
              Book a Call
              <div aria-hidden="true" className="absolute bottom-0 h-1/3 w-full -translate-x-4 rounded-full bg-neutral-400/40 blur-sm dark:bg-white/35" />
            </button>
          </li>
        </ul>
      </div>

      <AnimatePresence>
        {moreOpen && (
          <motion.div
            key="more-dropdown-content"
            className="absolute top-full right-0 left-0 grid gap-3 px-2 pt-4 pb-2 md:grid-cols-3"
            variants={reduce ? {} : DROPDOWN}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {MORE_NAV.featured.map((f) => (
              <motion.div key={f.href} variants={reduce ? {} : DROPDOWN_ITEM}>
                <Link href={f.href} onClick={closeMore} className="group relative flex h-full min-h-48 w-full flex-col justify-end overflow-hidden rounded-xl p-3">
                  <div className="absolute inset-0 z-0 rounded-xl transition-transform duration-300 ease-out group-hover:scale-110" style={{ background: f.gradient }} />
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-white/85 via-white/40 to-transparent transition-colors duration-300 group-hover:from-white/95 group-hover:via-white/55 dark:from-black/90 dark:via-black/50 dark:group-hover:from-black/95 dark:group-hover:via-black/60" />
                  <div className="z-20 flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white">{f.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{f.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
            <motion.div variants={reduce ? {} : DROPDOWN_ITEM}>
              <div className="flex flex-col gap-3">
                {MORE_NAV.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                   
                    onClick={closeMore}
                    className="group flex w-full items-center gap-3 rounded-xl border border-black/10 bg-black/5 p-2.5 transition-colors duration-200 hover:border-black/15 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10"
                  >
                    <div className="flex shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white/50 p-2.5 transition-colors duration-200 group-hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/15">
                      <span className="text-neutral-500 transition-colors group-hover:text-neutral-900 dark:text-white/50 dark:group-hover:text-white">
                        <Svg d={LINK_ICONS[l.icon]} />
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-medium text-neutral-800 transition-colors group-hover:text-neutral-950 dark:text-white/90 dark:group-hover:text-white">{l.title}</span>
                      <span className="line-clamp-1 text-xs text-neutral-500 transition-colors group-hover:text-neutral-600 dark:text-white/40 dark:group-hover:text-white/60">{l.description}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- Mobile content ---------- */

const HINTS = [
  { icon: 'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z', text: 'tap to explore' },
  { icon: MAGNIFIER, text: 'search anything' },
  { icon: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2', text: 'book a call' },
];

function MobileNav({ hint, variants, onTap, onHintTap }: { hint: number; variants: Variants; onTap: () => void; onHintTap: () => void }) {
  const h = hint >= 0 ? HINTS[hint] : null;
  return (
    <motion.div key="mobile" className="mt-0.5" variants={variants} initial="hidden" animate="visible" exit="exit">
      <AnimatePresence mode="wait">
        {h ? (
          <motion.div
            key={`hint-${hint}`}
            className="mt-[5px] flex min-w-46 cursor-pointer items-center justify-center gap-2.5 px-2.5 py-1"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onHintTap}
          >
            <Svg d={h.icon} className="size-5 text-neutral-500 dark:text-white/60" />
            <span className="text-sm font-medium whitespace-nowrap text-neutral-600 select-none dark:text-white/70">{h.text}</span>
          </motion.div>
        ) : (
          <motion.button
            key="mobile-btn"
            type="button"
            aria-label="Open menu"
            className="flex min-w-46 cursor-pointer items-center justify-between px-2.5 py-1 select-none"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onTap}
          >
            <span className="grid size-6 place-items-center rounded-full bg-neutral-900 font-serif text-sm text-white italic dark:bg-white dark:text-black">v</span>
            <span className="text-lg font-medium text-neutral-600 dark:text-white/70">vico</span>
            <Svg d="M4 8h16M4 16h16" className="size-5 text-neutral-500 dark:text-white/60" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- The morphing pill ---------- */

function NavPill({ onDropdownOpenChange }: { onDropdownOpenChange: (open: boolean) => void }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const reduce = !!useReducedMotion();
  const variants = reduce ? CONTENT_REDUCED : CONTENT;
  const { openCommands, openConnect } = useCommandMenu();

  /* Client-only values: the pill renders nothing during SSR. */
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const greetText = useSyncExternalStore(noopSubscribe, getGreeting, () => '');
  const [greeting, setGreeting] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  /* Index of the hint currently showing on mobile, -1 for none. */
  const [hint, setHint] = useState(-1);
  const [navWidth, setNavWidth] = useState(460);

  const navRef = useCallback((el: HTMLUListElement | null) => {
    if (el) setNavWidth(el.offsetWidth + 8);
  }, []);

  useEffect(() => {
    const greetTimer = setTimeout(() => setGreeting(false), 2500);
    let hideTimer: ReturnType<typeof setTimeout>;
    let shown = 0;
    const showHint = () => {
      setHint(shown % HINTS.length);
      shown += 1;
      hideTimer = setTimeout(() => setHint(-1), 4000);
      if (shown >= 3) clearInterval(interval);
    };
    const first = setTimeout(showHint, 5000);
    const interval = setInterval(showHint, 15000);
    return () => {
      clearTimeout(greetTimer);
      clearTimeout(first);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  const expanded = !(isMobile || greeting) && moreOpen;
  const compact = greeting || isMobile;
  useEffect(() => onDropdownOpenChange(expanded), [expanded, onDropdownOpenChange]);

  const size = expanded ? { width: 720, height: 270 } : compact ? { width: 190, height: 42 } : { width: navWidth, height: 42 };
  const spacerWidth = expanded ? navWidth : size.width;

  const activeId = useMemo(() => {
    const hit = NAV_ITEMS.find((i) => (i.href === '/' ? pathname === '/' : pathname.startsWith(i.href)));
    return hit ? hit.id : 'more-dropdown';
  }, [pathname]);

  return (
    <div className="relative flex justify-center">
      <noscript>
        <ul className="relative flex min-h-10 items-center justify-center gap-2 rounded-[22px] bg-white px-4 py-1 shadow-border dark:bg-neutral-800">
          {NAV_ITEMS.map((i) => (
            <li key={i.id} className="list-none">
              <a href={i.href} className="block px-2 py-1.5 text-sm text-neutral-700 dark:text-white/70">
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </noscript>
      {mounted && (
        <>
          {/* Invisible spacer keeps the search button glued to the pill's edge. */}
          <motion.div aria-hidden="true" className="pointer-events-none invisible h-10 shrink-0" initial={{ width: 0 }} animate={{ width: spacerWidth }} transition={PILL_SPRING} />
          <motion.div
            className={`absolute top-0 left-1/2 flex min-h-10 -translate-x-1/2 items-start justify-center px-1 ${SURFACE}`}
            initial={{ opacity: 0, width: 0, height: 0 }}
            animate={{ opacity: 1, ...size }}
            transition={PILL_SPRING}
            style={{ borderRadius: 22, clipPath: expanded ? 'none' : 'inset(-44px -32px -32px -32px round 22px)' }}
          >
            <AnimatePresence initial={false} mode="wait">
              {greeting ? (
                <motion.div
                  key="greeting"
                  className="mt-1 flex min-w-46 cursor-pointer items-center justify-center gap-2 px-2.5 py-1"
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setGreeting(false)}
                >
                  {reduce ? (
                    <span className="text-base">{GREETING_EMOJI[greetText] ?? '👋'}</span>
                  ) : (
                    <motion.span
                      className="inline-block text-base"
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
                    >
                      {GREETING_EMOJI[greetText] ?? '👋'}
                    </motion.span>
                  )}
                  <span className="text-base font-light whitespace-nowrap text-neutral-700 select-none dark:text-white" suppressHydrationWarning>
                    {greetText}
                  </span>
                </motion.div>
              ) : isMobile ? (
                <MobileNav
                  hint={hint}
                  variants={variants}
                  onTap={openCommands}
                  onHintTap={() => {
                    setHint(-1);
                    if (hint === 2) openConnect();
                    else openCommands();
                  }}
                />
              ) : (
                <DesktopNav activeId={activeId} moreOpen={moreOpen} setMoreOpen={setMoreOpen} navRef={navRef} reduce={reduce} variants={variants} />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
}

/** Round search button; flashes a ⌘K hint once, ten seconds in. */
function SearchButton({ hidden }: { hidden: boolean }) {
  const { openCommands } = useCommandMenu();
  const [tip, setTip] = useState(false);
  useEffect(() => {
    let off: ReturnType<typeof setTimeout>;
    const on = setTimeout(() => {
      setTip(true);
      off = setTimeout(() => setTip(false), 3000);
    }, 10000);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Open search (⌘K)"
      onClick={openCommands}
      className={`relative mt-0.5 hidden size-9 cursor-pointer items-center justify-center rounded-full text-neutral-700 transition-all duration-150 hover:text-neutral-900 active:scale-95 lg:inline-flex dark:text-white/85 dark:hover:text-white ${SURFACE} ${
        hidden ? 'pointer-events-none scale-90 opacity-0' : ''
      }`}
    >
      <Svg d={MAGNIFIER} className="size-[18px]" />
      <AnimatePresence>
        {tip && (
          <motion.span
            className="pointer-events-none absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-[3px] rounded-lg border border-white/20 bg-neutral-900 px-2 py-1 whitespace-nowrap shadow-lg shadow-black/20 dark:border-neutral-200 dark:bg-white dark:shadow-black/5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <span className="text-[11px] leading-none font-semibold text-white/70 dark:text-neutral-500">⌘</span>
            <span className="text-[11px] leading-none font-semibold text-white/80 dark:text-neutral-600">K</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 h-22 w-full select-none backdrop-blur-[2px] lg:h-25"
        style={{
          maskImage: 'linear-gradient(to bottom, black 50%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent)',
        }}
      />
      <header className="fixed top-2.5 z-[5000] w-full md:top-4">
        <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-start px-3 py-1.5">
          <Link href="/" aria-label="Homepage" className="sr-only">
            Home
          </Link>
          <div className="mx-auto flex items-start gap-3.5">
            <NavPill onDropdownOpenChange={setDropdownOpen} />
            <SearchButton hidden={dropdownOpen} />
          </div>
        </nav>
      </header>
    </>
  );
}

export function SiteNav() {
  return (
    <CommandMenuProvider>
      <NavBar />
    </CommandMenuProvider>
  );
}
