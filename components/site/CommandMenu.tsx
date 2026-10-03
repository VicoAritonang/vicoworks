'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FEATURED_PROJECTS, PROFILE } from '@/content/home';

type View = 'commands' | 'connect';

interface CommandMenuState {
  open: boolean;
  view: View;
  openCommands: () => void;
  openConnect: () => void;
  close: () => void;
}

const Ctx = createContext<CommandMenuState | null>(null);

export function useCommandMenu() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCommandMenu must be used inside <CommandMenuProvider>');
  return ctx;
}

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('commands');

  const openCommands = useCallback(() => {
    setView('commands');
    setOpen(true);
  }, []);
  const openConnect = useCallback(() => {
    setView('connect');
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  /* ⌘K / Ctrl+K toggles the menu from anywhere. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setView('commands');
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ open, view, openCommands, openConnect, close }), [open, view, openCommands, openConnect, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <CommandMenu view={view} setView={setView} />
    </Ctx.Provider>
  );
}

/* ---------- Data ---------- */

interface Item {
  id: string;
  group: string;
  title: string;
  description?: string;
  keywords?: string;
  href?: string;
  external?: boolean;
  action?: () => void;
  icon: ReactNode;
}

const PLACEHOLDERS = [
  'Search pages, projects, links...',
  "Try 'agents' or 'aws'...",
  'Jump to a project...',
  'What are you looking for?',
];

const EMPTY = [
  "Nothing here. Maybe it's still in my head.",
  'Nope, not that one. Try something else?',
  "Hmm, I haven't built that one yet.",
  'Drawing a blank. Try a different search?',
];

const Ico = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const ICONS = {
  home: <Ico d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  grid: <Ico d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  folder: <Ico d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  mail: <Ico d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  doc: <Ico d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />,
  link: <Ico d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  sparkle: <Ico d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />,
  theme: <Ico d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" />,
  search: <Ico d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4" />,
  send: <Ico d="M4 12l16-8-6 16-2-7z" />,
  x: <Ico d="M6 6l12 12M18 6L6 18" />,
};

/* ---------- Menu ---------- */

function CommandMenu({ view, setView }: { view: View; setView: (v: View) => void }) {
  const { open, close } = useCommandMenu();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [ph, setPh] = useState(0);
  const [empty, setEmpty] = useState(EMPTY[0]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const toggleTheme = useCallback(() => {
    const dark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
  }, []);

  const items: Item[] = useMemo(
    () => [
      { id: 'home', group: 'Pages', title: 'Home', href: '/', icon: ICONS.home },
      { id: 'work', group: 'Pages', title: 'Work', description: 'Curated case studies', href: '/#work', icon: ICONS.grid },
      { id: 'projects', group: 'Pages', title: 'Projects', description: 'The full archive', href: '/projects', icon: ICONS.folder },
      { id: 'about', group: 'Pages', title: 'About', description: 'Bio, focus and stack', href: '/about', icon: ICONS.home },
      { id: 'blog', group: 'Pages', title: 'Blog', description: 'Thoughts & writings', href: '/blog', icon: ICONS.doc },
      { id: 'guestbook', group: 'Pages', title: 'Guestbook', description: 'Let me know you were here', href: '/guestbook', icon: ICONS.sparkle },
      { id: 'uses', group: 'Pages', title: 'Uses', description: 'Tools and stack', href: '/uses', icon: ICONS.grid },
      { id: 'bucket', group: 'Pages', title: 'Bucket List', description: 'Dreams with a deadline', href: '/bucket-list', icon: ICONS.sparkle },
      { id: 'links', group: 'Pages', title: 'Links', description: 'Everything in one place', href: '/links', icon: ICONS.link },
      { id: 'contact', group: 'Pages', title: 'Contact', href: '/#contact', icon: ICONS.mail },
      ...FEATURED_PROJECTS.map((p) => ({
        id: `p-${p.slug}`,
        group: 'Projects',
        title: p.name,
        description: p.body,
        keywords: p.stack + ' ' + p.tech.join(' '),
        href: p.href,
        external: true,
        icon: ICONS.sparkle,
      })),
      { id: 'resume', group: 'Links', title: 'Résumé', description: 'Download the PDF', href: PROFILE.resume, external: true, icon: ICONS.doc },
      { id: 'github', group: 'Links', title: 'GitHub', href: PROFILE.github, external: true, icon: ICONS.link },
      { id: 'linkedin', group: 'Links', title: 'LinkedIn', href: PROFILE.linkedin, external: true, icon: ICONS.link },
      { id: 'theme', group: 'Actions', title: 'Toggle theme', description: 'Switch light / dark', keywords: 'dark light mode appearance', action: toggleTheme, icon: ICONS.theme },
    ],
    [toggleTheme]
  );

  const connectItems: Item[] = useMemo(
    () => [
      { id: 'c-email', group: 'Reach out', title: 'Email', description: PROFILE.email, href: `mailto:${PROFILE.email}`, external: true, icon: ICONS.mail },
      { id: 'c-linkedin', group: 'Reach out', title: 'LinkedIn', description: 'Message me on LinkedIn', href: PROFILE.linkedin, external: true, icon: ICONS.link },
      { id: 'c-github', group: 'Reach out', title: 'GitHub', description: 'See what I am building', href: PROFILE.github, external: true, icon: ICONS.link },
      { id: 'c-resume', group: 'Reach out', title: 'Résumé', description: 'Download the PDF', href: PROFILE.resume, external: true, icon: ICONS.doc },
    ],
    []
  );

  const results = useMemo(() => {
    if (view === 'connect') return connectItems;
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.title} ${i.description ?? ''} ${i.keywords ?? ''} ${i.group}`.toLowerCase().includes(q));
  }, [items, connectItems, query, view]);

  const groups = useMemo(() => {
    const g: Record<string, Item[]> = {};
    for (const r of results) (g[r.group] ??= []).push(r);
    return g;
  }, [results]);

  /* Reset on open; focus the input on pointer devices. */
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, view]);

  /* Rotating placeholder while the box is empty. */
  useEffect(() => {
    if (!open || query) return;
    const id = setInterval(() => setPh((p) => (p + 1) % PLACEHOLDERS.length), 4000);
    return () => clearInterval(id);
  }, [open, query]);

  useEffect(() => {
    if (query.trim()) setEmpty(EMPTY[Math.floor(Math.random() * EMPTY.length)]);
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current?.querySelector('[data-selected=true]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  /* Escape: back out of "connect" first, then close. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (view === 'connect') setView('commands');
      else close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, view, setView, close]);

  const select = (item: Item) => {
    if (item.action) item.action();
    else if (item.href) {
      if (item.external) window.open(item.href, item.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener,noreferrer');
      else router.push(item.href);
    }
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select(results[active]);
    }
  };

  const chrome =
    'rounded-3xl bg-white/90 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] shadow-border backdrop-blur-xl dark:bg-neutral-900/90';
  const roundBtn =
    'flex size-13 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-border backdrop-blur-xl transition-colors hover:text-neutral-950 dark:bg-neutral-900/90 dark:text-white/70 dark:hover:text-white';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmd"
          className="fixed inset-0 z-[6000] flex items-start justify-center px-3 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onKeyDown={onKeyDown}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={close} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={view === 'commands' ? 'Command menu' : 'Reach out'}
            className="relative flex w-full max-w-xl flex-col gap-2.5"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            {/* Top bar */}
            <div className="flex h-13 items-center gap-2.5">
              <div className={`relative flex h-13 flex-1 items-center gap-2.5 px-4 focus-within:ring-2 focus-within:ring-indigo-500/20 ${chrome} rounded-full`}>
                <AnimatePresence mode="wait" initial={false}>
                  {view === 'commands' ? (
                    <motion.div key="search" className="flex flex-1 items-center gap-2.5" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} transition={{ duration: 0.14 }}>
                      <span className="text-neutral-400">{ICONS.search}</span>
                      <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={PLACEHOLDERS[ph]}
                        className="h-full flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-neutral-400"
                        aria-label="Search"
                      />
                    </motion.div>
                  ) : (
                    <motion.button key="back" type="button" onClick={() => setView('commands')} className="flex cursor-pointer items-center gap-2 text-[15px] text-foreground" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.14 }}>
                      <Ico d="M15 6l-6 6 6 6" />
                      Reach out
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <button type="button" aria-label={view === 'commands' ? 'Reach out' : 'Back to search'} className={roundBtn} onClick={() => setView(view === 'commands' ? 'connect' : 'commands')}>
                {view === 'commands' ? ICONS.send : ICONS.search}
              </button>
              <button type="button" aria-label="Close" className={roundBtn} onClick={close}>
                {ICONS.x}
              </button>
            </div>

            {/* Results */}
            <div ref={listRef} className={`relative h-[min(430px,58dvh)] overflow-y-auto p-2 ${chrome}`}>
              {results.length === 0 ? (
                <div className="grid h-full place-items-center px-6 text-center text-sm text-neutral-500">{empty}</div>
              ) : (
                Object.entries(groups).map(([group, list]) => (
                  <div key={group} className="mb-2">
                    <div className="px-3 pt-2 pb-1.5 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">{group}</div>
                    {list.map((item) => {
                      const idx = results.indexOf(item);
                      const selected = idx === active;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          data-selected={selected}
                          onMouseMove={() => setActive(idx)}
                          onClick={() => select(item)}
                          className={`relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${
                            selected ? 'text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-white/70'
                          }`}
                        >
                          {selected && (
                            <motion.span layoutId="cmd-active" className="absolute inset-0 rounded-2xl bg-black/5 dark:bg-white/10" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
                          )}
                          <span className="relative grid size-8 shrink-0 place-items-center rounded-lg border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
                            {item.icon}
                          </span>
                          <span className="relative min-w-0 flex-1">
                            <span className="block text-sm font-medium">{item.title}</span>
                            {item.description && <span className="block truncate text-xs text-neutral-500 dark:text-white/40">{item.description}</span>}
                          </span>
                          {item.external && (
                            <span className="relative text-neutral-400">
                              <Ico d="M7 17L17 7M9 7h8v8" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
