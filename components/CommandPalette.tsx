'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Home, FolderGit2, Cpu, Mail, Github, Linkedin, MessageCircle,
  FileText, TerminalSquare, Zap, Copy, Check, CornerDownLeft, Search,
} from 'lucide-react';
import type { ShellData } from './Shell';

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ReactNode;
  run: () => void;
}

export function CommandPalette({ data }: { data: ShellData }) {
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

  const commands = useMemo<Command[]>(() => {
    const cmds: Command[] = [
      { id: 'home', label: 'Go to Home', hint: 'Landing page', group: 'NAVIGATE', icon: <Home size={16} />, run: () => router.push('/#hero') },
      { id: 'projects', label: 'Go to Projects', hint: 'Project archives', group: 'NAVIGATE', icon: <FolderGit2 size={16} />, run: () => router.push('/projects') },
      { id: 'skills', label: 'Go to Expertise', hint: 'Skills & stack', group: 'NAVIGATE', icon: <Cpu size={16} />, run: () => router.push('/#skills') },
      { id: 'contact', label: 'Go to Contact', hint: 'Transmission', group: 'NAVIGATE', icon: <Mail size={16} />, run: () => router.push('/#contact') },
      {
        id: 'copy-email', label: 'Copy Email Address', hint: data.email, group: 'ACTIONS',
        icon: copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />,
        run: () => {
          navigator.clipboard.writeText(data.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        },
      },
      {
        id: 'terminal', label: 'Open Terminal', hint: 'Press ` anywhere', group: 'ACTIONS',
        icon: <TerminalSquare size={16} />,
        run: () => { close(); window.dispatchEvent(new CustomEvent('vw:toggle-terminal')); },
      },
      {
        id: 'overdrive', label: 'Activate Overdrive', hint: 'Or try the Konami code…', group: 'ACTIONS',
        icon: <Zap size={16} />,
        run: () => { close(); window.dispatchEvent(new CustomEvent('vw:overdrive')); },
      },
    ];

    if (data.github) cmds.push({ id: 'github', label: 'Open GitHub', hint: 'Source code', group: 'LINKS', icon: <Github size={16} />, run: () => window.open(data.github!, '_blank') });
    if (data.linkedin) cmds.push({ id: 'linkedin', label: 'Open LinkedIn', hint: 'Professional profile', group: 'LINKS', icon: <Linkedin size={16} />, run: () => window.open(data.linkedin!, '_blank') });
    if (data.whatsapp) cmds.push({ id: 'whatsapp', label: 'Chat on WhatsApp', hint: 'Direct message', group: 'LINKS', icon: <MessageCircle size={16} />, run: () => window.open(`https://wa.me/${data.whatsapp}`, '_blank') });
    if (data.resumeUrl) cmds.push({ id: 'resume', label: 'View Resume', hint: 'PDF document', group: 'LINKS', icon: <FileText size={16} />, run: () => window.open(data.resumeUrl!, '_blank') });

    return cmds;
  }, [router, data, copied, close]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(c => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    filtered.forEach(c => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Global hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
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

  const execute = (cmd: Command) => {
    cmd.run();
    if (cmd.id !== 'copy-email') close();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      execute(filtered[selected]);
    }
  };

  // Keep the selected row in view
  useEffect(() => {
    listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-xl rounded-2xl border border-cyan-500/20 bg-[#07070d]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 sm:px-5 border-b border-white/5">
              <Search size={18} className="text-cyan-500 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Type a command or search..."
                className="w-full bg-transparent py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none font-mono"
              />
              <kbd className="hidden sm:block px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-gray-500 shrink-0">ESC</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {groups.length === 0 && (
                <div className="px-5 py-8 text-center font-mono text-sm text-gray-500">
                  NO_MATCH: '{query}'
                </div>
              )}
              {groups.map(([group, cmds]) => (
                <div key={group}>
                  <div className="px-5 pt-3 pb-1 font-mono text-[10px] tracking-[0.25em] text-gray-600">{group}</div>
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
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                          isSelected ? 'bg-cyan-500/10 text-white' : 'text-gray-400'
                        }`}
                      >
                        <span className={`shrink-0 ${isSelected ? 'text-cyan-400' : 'text-gray-500'}`}>{cmd.icon}</span>
                        <span className="text-sm flex-1 truncate">{cmd.label}</span>
                        {cmd.hint && <span className="text-[11px] font-mono text-gray-600 truncate max-w-[40%]">{cmd.hint}</span>}
                        {isSelected && <CornerDownLeft size={13} className="text-cyan-500/70 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/5 font-mono text-[10px] text-gray-600">
              <span className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 rounded border border-white/10 bg-white/5">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 rounded border border-white/10 bg-white/5">↵</kbd> execute</span>
              <span className="ml-auto text-cyan-500/50">VICO.WORKS OS v5.0</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
