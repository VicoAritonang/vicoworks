'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Minus, TerminalSquare } from 'lucide-react';
import type { ShellData } from './Shell';

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

export function Terminal({ data }: { data: ShellData }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  const print = useCallback((newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  // Toggle listeners: ` key + custom event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (e.key === '`' && !typing) {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onToggle = () => setOpen(o => !o);
    window.addEventListener('keydown', onKey);
    window.addEventListener('vw:toggle-terminal', onToggle);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('vw:toggle-terminal', onToggle);
    };
  }, []);

  // Boot banner on first open
  useEffect(() => {
    if (open && !booted.current) {
      booted.current = true;
      print([
        { type: 'system', text: BANNER },
        { type: 'system', text: 'vicoworks-shell v5.0.0 — unauthorized access is a compliment.' },
        { type: 'system', text: "Type 'help' to list available commands." },
        { type: 'output', text: '' },
      ]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open, print]);

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    setHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    print([{ type: 'input', text: cmd }]);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);

    switch (name) {
      case 'help':
        print([
          { type: 'output', text: 'AVAILABLE COMMANDS:' },
          { type: 'output', text: '  whoami          who is this guy?' },
          { type: 'output', text: '  skills          list technical arsenal' },
          { type: 'output', text: '  projects        open project archives' },
          { type: 'output', text: '  contact         ways to reach me' },
          { type: 'output', text: '  github          open GitHub profile' },
          { type: 'output', text: '  linkedin        open LinkedIn profile' },
          { type: 'output', text: '  resume          open my resume' },
          { type: 'output', text: '  overdrive       ⚡ do not press' },
          { type: 'output', text: '  sudo hire-me    the only command that matters' },
          { type: 'output', text: '  banner          reprint the banner' },
          { type: 'output', text: '  clear           clear the screen' },
          { type: 'output', text: '  exit            close terminal' },
        ]);
        break;

      case 'whoami':
        print([
          { type: 'success', text: 'vico@aritonang:~$ identity confirmed' },
          { type: 'output', text: data.overview || 'AI Engineer & Software Developer based in Indonesia.' },
          { type: 'output', text: 'Status: OPEN TO OPPORTUNITIES' },
        ]);
        break;

      case 'skills':
      case 'stack':
        if (data.skills.length) {
          print([
            { type: 'success', text: `LOADED ${data.skills.length} MODULES:` },
            ...data.skills.map((s, i) => ({
              type: 'output' as const,
              text: `  [${String(i + 1).padStart(2, '0')}] ${s} ${'▰'.repeat(8)}▱▱ ONLINE`,
            })),
          ]);
        } else {
          print([{ type: 'error', text: 'skill database unreachable.' }]);
        }
        break;

      case 'projects':
        print([{ type: 'success', text: 'Opening /projects ...' }]);
        setTimeout(() => router.push('/projects'), 400);
        break;

      case 'contact':
        print([
          { type: 'success', text: 'CONTACT CHANNELS:' },
          { type: 'output', text: `  email     ${data.email}` },
          ...(data.github ? [{ type: 'output' as const, text: `  github    ${data.github}` }] : []),
          ...(data.linkedin ? [{ type: 'output' as const, text: `  linkedin  ${data.linkedin}` }] : []),
          ...(data.whatsapp ? [{ type: 'output' as const, text: `  whatsapp  wa.me/${data.whatsapp}` }] : []),
        ]);
        break;

      case 'github':
        if (data.github) {
          print([{ type: 'success', text: 'Opening GitHub ...' }]);
          window.open(data.github, '_blank');
        } else print([{ type: 'error', text: 'github: remote not configured.' }]);
        break;

      case 'linkedin':
        if (data.linkedin) {
          print([{ type: 'success', text: 'Opening LinkedIn ...' }]);
          window.open(data.linkedin, '_blank');
        } else print([{ type: 'error', text: 'linkedin: remote not configured.' }]);
        break;

      case 'resume':
      case 'cv':
        if (data.resumeUrl) {
          print([{ type: 'success', text: 'Fetching resume.pdf ...' }]);
          window.open(data.resumeUrl, '_blank');
        } else print([{ type: 'error', text: 'resume: file not found.' }]);
        break;

      case 'sudo':
        if (args.join(' ') === 'hire-me' || args.join(' ') === 'hire me') {
          print([
            { type: 'success', text: '[sudo] password for recruiter: ********' },
            { type: 'success', text: 'ACCESS GRANTED. Excellent decision.' },
            { type: 'output', text: 'Composing offer letter ... just kidding. Opening email client.' },
          ]);
          setTimeout(() => window.open(`mailto:${data.email}?subject=Let's%20work%20together`, '_blank'), 800);
        } else {
          print([{ type: 'error', text: `sudo: ${args.join(' ') || '?'}: permission denied. Try 'sudo hire-me'.` }]);
        }
        break;

      case 'overdrive':
      case 'matrix':
        print([{ type: 'success', text: '⚡ OVERDRIVE ENGAGED. BRACE YOURSELF.' }]);
        window.dispatchEvent(new CustomEvent('vw:overdrive'));
        break;

      case 'banner':
        print([{ type: 'system', text: BANNER }]);
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

      case 'ls':
        print([{ type: 'output', text: 'home/  projects/  skills/  contact/  secrets/   <- nice try, it\'s empty' }]);
        break;

      case 'rm':
        print([{ type: 'error', text: 'rm: this portfolio is write-protected by pure willpower.' }]);
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
      case 'input': return 'text-white';
      case 'system': return 'text-cyan-400';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
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
          className="fixed bottom-0 sm:bottom-6 inset-x-0 sm:inset-x-auto sm:right-6 z-[85] w-full sm:w-[600px] sm:max-w-[calc(100vw-3rem)]"
          role="dialog"
          aria-label="Interactive terminal"
        >
          <div className="rounded-t-2xl sm:rounded-2xl border border-cyan-500/20 bg-[#050508]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
              <TerminalSquare size={14} className="text-cyan-500" />
              <span className="font-mono text-xs text-gray-400 tracking-wider">vico@works: ~/portfolio</span>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => setLines([])} className="p-1 text-gray-500 hover:text-white transition-colors" aria-label="Clear terminal">
                  <Minus size={14} />
                </button>
                <button onClick={() => setOpen(false)} className="p-1 text-gray-500 hover:text-red-400 transition-colors" aria-label="Close terminal">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div
              ref={bodyRef}
              className="h-[320px] sm:h-[360px] overflow-y-auto p-4 font-mono text-[11px] sm:text-xs leading-relaxed cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i} className={lineColor(line.type)}>
                  {line.type === 'input' && <span className="text-cyan-500">❯ </span>}
                  <span className="whitespace-pre-wrap">{line.text}</span>
                </div>
              ))}

              {/* Prompt */}
              <div className="flex items-center text-white">
                <span className="text-cyan-500 mr-2">❯</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent focus:outline-none caret-cyan-400"
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
