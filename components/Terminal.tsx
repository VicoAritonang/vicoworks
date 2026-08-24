'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Minus, TerminalSquare, X } from 'lucide-react';
import { profile } from '@/content/profile';
import { allProjects, getProject } from '@/content/projects';
import { skillLayers } from '@/content/skills';
import { applyTheme } from './theme';

/* Kept as an easter egg, not as a feature. Nothing on the page points at it —
   it answers to the backtick key and to the command palette, and that is the
   whole invitation.

   The copy was trimmed of the lines that undercut the work: a shell that
   opens with "unauthorized access is a compliment" and prints a full bar for
   every skill is doing the same thing the old skills grid did. */

interface Line {
  type: 'input' | 'output' | 'system' | 'success' | 'error';
  text: string;
}

const BANNER = String.raw`
 __   __ ___  ___  ___
 \ \ / /|_ _|/ __|/ _ \
  \ V /  | || (__| (_) |
   \_/  |___|\___|\___/  .WORKS
`;

export function Terminal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // The banner is static, so it is the initial state rather than something an
  // effect prints on first open — no effect, no `booted` ref, no extra render.
  const [lines, setLines] = useState<Line[]>(() => [
    { type: 'system', text: BANNER },
    { type: 'system', text: `${profile.name} — ${profile.role}` },
    { type: 'system', text: "Type 'help' for the list of commands." },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const print = useCallback((newLines: Line[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (e.key === '`' && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener('keydown', onKey);
    window.addEventListener('vw:toggle-terminal', onToggle);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('vw:toggle-terminal', onToggle);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    print([{ type: 'input', text: cmd }]);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);

    switch (name) {
      case 'help':
        print([
          { type: 'output', text: 'COMMANDS' },
          { type: 'output', text: '  whoami          the short version' },
          { type: 'output', text: '  work            list every project' },
          { type: 'output', text: '  open <name>     open a case study' },
          { type: 'output', text: '  skills          what I work with, by layer' },
          { type: 'output', text: '  contact         how to reach me' },
          { type: 'output', text: '  github          open GitHub' },
          { type: 'output', text: '  linkedin        open LinkedIn' },
          { type: 'output', text: '  cv              open my CV' },
          { type: 'output', text: '  stats           toggle the render stats panel' },
          { type: 'output', text: '  theme           switch dark / light' },
          { type: 'output', text: '  sudo hire-me    the only command that matters' },
          { type: 'output', text: '  clear           clear the screen' },
          { type: 'output', text: '  exit            close the terminal' },
        ]);
        break;

      case 'whoami':
        print([
          { type: 'success', text: profile.claim },
          { type: 'output', text: profile.identity },
          { type: 'output', text: profile.availability },
        ]);
        break;

      case 'work':
      case 'projects':
        print([
          { type: 'success', text: `${allProjects.length} projects` },
          ...allProjects.map((p) => ({
            type: 'output' as const,
            text: `  ${p.slug.padEnd(20)} ${p.year.padEnd(16)} ${p.status}`,
          })),
          { type: 'output', text: "  open <name> to read one." },
        ]);
        break;

      case 'open': {
        const slug = args[0];
        const project = slug ? getProject(slug) : undefined;
        if (!project) {
          print([{ type: 'error', text: `open: no project called '${slug ?? ''}'. Try 'work'.` }]);
          break;
        }
        if (!project.caseStudy) {
          if (project.links.live) {
            print([{ type: 'success', text: `Opening ${project.links.live} ...` }]);
            window.open(project.links.live, '_blank');
          } else {
            print([{ type: 'error', text: `open: ${project.slug} has no write-up yet.` }]);
          }
          break;
        }
        print([{ type: 'success', text: `Opening /projects/${project.slug} ...` }]);
        setTimeout(() => router.push(`/projects/${project.slug}`), 400);
        break;
      }

      case 'skills':
      case 'stack':
        print([
          { type: 'success', text: 'By layer:' },
          ...skillLayers.flatMap((layer) => [
            { type: 'output' as const, text: `  ${layer.name}` },
            { type: 'output' as const, text: `    ${layer.items.join(', ')}` },
          ]),
        ]);
        break;

      case 'contact':
        print([
          { type: 'success', text: 'Reach me at:' },
          { type: 'output', text: `  email     ${profile.email}` },
          { type: 'output', text: `  github    ${profile.links.github}` },
          { type: 'output', text: `  linkedin  ${profile.links.linkedin}` },
          { type: 'output', text: `  whatsapp  ${profile.links.whatsapp}` },
        ]);
        break;

      case 'github':
        print([{ type: 'success', text: 'Opening GitHub ...' }]);
        window.open(profile.links.github, '_blank');
        break;

      case 'linkedin':
        print([{ type: 'success', text: 'Opening LinkedIn ...' }]);
        window.open(profile.links.linkedin, '_blank');
        break;

      case 'cv':
      case 'resume':
        print([{ type: 'success', text: 'Opening CV ...' }]);
        window.open(profile.links.resume, '_blank');
        break;

      case 'stats':
        window.dispatchEvent(new CustomEvent('vw:toggle-stats'));
        print([{ type: 'success', text: 'Render stats toggled (desktop only).' }]);
        break;

      case 'sudo':
        if (args.join(' ') === 'hire-me' || args.join(' ') === 'hire me') {
          print([
            { type: 'success', text: '[sudo] password for recruiter: ********' },
            { type: 'success', text: 'Access granted. Excellent decision.' },
            { type: 'output', text: 'Opening your email client.' },
          ]);
          setTimeout(
            () => window.open(`mailto:${profile.email}?subject=Let's%20work%20together`, '_blank'),
            800,
          );
        } else {
          print([
            {
              type: 'error',
              text: `sudo: ${args.join(' ') || '?'}: permission denied. Try 'sudo hire-me'.`,
            },
          ]);
        }
        break;

      case 'overdrive':
        print([{ type: 'success', text: 'Overdrive engaged.' }]);
        window.dispatchEvent(new CustomEvent('vw:overdrive'));
        break;

      case 'theme': {
        const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        print([{ type: 'success', text: `theme set to ${next}` }]);
        break;
      }

      case 'banner':
        print([{ type: 'system', text: BANNER }]);
        break;

      case 'ls':
        print([{ type: 'output', text: 'work/  skills/  research/  about/  contact/' }]);
        break;

      case 'date':
        print([{ type: 'output', text: new Date().toString() }]);
        break;

      case 'echo':
        print([{ type: 'output', text: raw.trim().slice(5) || '' }]);
        break;

      case 'clear':
      case 'cls':
        setLines([]);
        break;

      case 'exit':
      case 'quit':
        setOpen(false);
        break;

      default:
        print([{ type: 'error', text: `command not found: ${name}. Type 'help' for the list.` }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      if (history[next]) {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(next >= 0 ? history[next] : '');
    }
  };

  const lineColor = (type: Line['type']) => {
    switch (type) {
      case 'input':
        return 'text-fg';
      case 'system':
        return 'text-accent';
      case 'success':
        return 'text-ok';
      case 'error':
        return 'text-err';
      default:
        return 'text-muted';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-0 z-[85] w-full sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[600px] sm:max-w-[calc(100vw-3rem)]"
          role="dialog"
          aria-label="Interactive terminal"
        >
          <div className="overflow-hidden rounded-t-2xl border border-line bg-panel/95 shadow-[var(--shadow-panel)] backdrop-blur-2xl sm:rounded-2xl">
            <div className="flex items-center gap-2 border-b border-line bg-tint px-4 py-2.5">
              <TerminalSquare size={14} className="text-accent" aria-hidden="true" />
              <span className="font-mono text-xs tracking-wider text-muted">vico@works: ~</span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setLines([])}
                  className="p-1 text-faint transition-colors hover:text-fg"
                  aria-label="Clear terminal"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-faint transition-colors hover:text-err"
                  aria-label="Close terminal"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div
              ref={bodyRef}
              className="h-[320px] cursor-text overflow-y-auto p-4 font-mono text-[11px] leading-relaxed sm:h-[360px] sm:text-xs"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i} className={lineColor(line.type)}>
                  {line.type === 'input' && <span className="text-accent">❯ </span>}
                  <span className="whitespace-pre-wrap">{line.text}</span>
                </div>
              ))}

              <div className="flex items-center text-fg">
                <span className="mr-2 text-accent">❯</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent caret-accent focus:outline-none"
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
