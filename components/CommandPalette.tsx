'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Check,
  Copy,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Github,
  Home,
  Layers,
  Linkedin,
  Mail,
  Search,
  SunMoon,
  TerminalSquare,
} from 'lucide-react';
import { profile } from '@/content/profile';
import { featuredProjects } from '@/content/projects';
import { applyTheme } from './theme';

/* The one interactive flourish that is genuinely useful rather than
   decorative: a technical visitor tries ⌘K on reflex, and it works. */

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ReactNode;
  run: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelected(0);
  }, []);

  const commands = useMemo<Command[]>(
    () => [
      {
        id: 'home',
        label: 'Home',
        group: 'Navigate',
        icon: <Home size={16} />,
        run: () => router.push('/#hero'),
      },
      {
        id: 'work',
        label: 'Selected work',
        group: 'Navigate',
        icon: <Layers size={16} />,
        run: () => router.push('/#work'),
      },
      {
        id: 'skills',
        label: 'How I build',
        group: 'Navigate',
        icon: <Layers size={16} />,
        run: () => router.push('/#skills'),
      },
      {
        id: 'projects',
        label: 'All projects',
        group: 'Navigate',
        icon: <FolderGit2 size={16} />,
        run: () => router.push('/projects'),
      },
      {
        id: 'contact',
        label: 'Contact',
        group: 'Navigate',
        icon: <Mail size={16} />,
        run: () => router.push('/#contact'),
      },

      ...featuredProjects.map((project) => ({
        id: `case-${project.slug}`,
        label: project.name,
        hint: project.year,
        group: 'Case studies',
        icon: <FolderGit2 size={16} />,
        run: () => router.push(`/projects/${project.slug}`),
      })),

      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: profile.email,
        group: 'Actions',
        icon: copied ? <Check size={16} className="text-ok" /> : <Copy size={16} />,
        run: () => {
          navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
      },
      {
        id: 'cv',
        label: 'Open CV',
        hint: 'PDF',
        group: 'Actions',
        icon: <FileText size={16} />,
        run: () => window.open(profile.links.resume, '_blank'),
      },
      {
        id: 'theme',
        label: 'Switch theme',
        hint: 'dark / light',
        group: 'Actions',
        icon: <SunMoon size={16} />,
        run: () => applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'),
      },
      {
        id: 'stats',
        label: 'Show render stats',
        hint: 'FPS and heap, desktop only',
        group: 'Actions',
        icon: <Activity size={16} />,
        run: () => {
          close();
          window.dispatchEvent(new CustomEvent('vw:toggle-stats'));
        },
      },
      {
        id: 'terminal',
        label: 'Open terminal',
        hint: 'or press `',
        group: 'Actions',
        icon: <TerminalSquare size={16} />,
        run: () => {
          close();
          window.dispatchEvent(new CustomEvent('vw:toggle-terminal'));
        },
      },

      {
        id: 'github',
        label: 'GitHub',
        hint: 'github.com/VicoAritonang',
        group: 'Elsewhere',
        icon: <Github size={16} />,
        run: () => window.open(profile.links.github, '_blank'),
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        group: 'Elsewhere',
        icon: <Linkedin size={16} />,
        run: () => window.open(profile.links.linkedin, '_blank'),
      },
    ],
    [router, copied, close],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q),
    );
  }, [commands, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    filtered.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') close();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('vw:open-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('vw:open-palette', onOpen);
    };
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const execute = (cmd: Command) => {
    cmd.run();
    if (cmd.id !== 'copy-email') close();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      execute(filtered[selected]);
    }
  };

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-surface px-4 pt-[15vh] backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel/95 shadow-[var(--shadow-panel)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 sm:px-5">
              <Search size={18} className="shrink-0 text-faint" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search or jump to…"
                className="w-full bg-transparent py-4 text-sm text-fg placeholder-faint focus:outline-none sm:text-base"
              />
              <kbd className="hidden shrink-0 rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {groups.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-faint">
                  Nothing matches &ldquo;{query}&rdquo;
                </div>
              )}
              {groups.map(([group, cmds]) => (
                <div key={group}>
                  <div className="kicker px-5 pt-3 pb-1">{group}</div>
                  {cmds.map((cmd) => {
                    flatIndex++;
                    const isSelected = filtered[selected]?.id === cmd.id;
                    const idx = flatIndex;
                    return (
                      <button
                        key={cmd.id}
                        data-selected={isSelected}
                        onMouseEnter={() => setSelected(idx)}
                        onClick={() => execute(cmd)}
                        className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                          isSelected ? 'bg-tint text-fg' : 'text-muted'
                        }`}
                      >
                        <span className={`shrink-0 ${isSelected ? 'text-accent' : 'text-faint'}`}>
                          {cmd.icon}
                        </span>
                        <span className="flex-1 truncate text-sm">{cmd.label}</span>
                        {cmd.hint && (
                          <span className="max-w-[40%] truncate font-mono text-[11px] text-faint">
                            {cmd.hint}
                          </span>
                        )}
                        {isSelected && (
                          <CornerDownLeft size={13} className="shrink-0 text-accent" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-5 py-2.5 font-mono text-[10px] text-faint">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-line bg-tint px-1 py-0.5">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-line bg-tint px-1 py-0.5">↵</kbd> select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
