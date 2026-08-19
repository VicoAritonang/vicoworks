'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TerminalSquare, Command } from 'lucide-react';

const LINKS = [
  { href: '/#hero', label: 'HOME' },
  { href: '/#skills', label: 'EXPERTISE' },
  { href: '/projects', label: 'PROJECTS' },
  { href: '/#contact', label: 'CONTACT' },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-[70] transition-all duration-500 ${
        scrolled
          ? 'bg-[#030305]/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Scroll progress */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <nav className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <div className="relative w-2.5 h-2.5">
            <span className="absolute inset-0 bg-cyan-500 rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
            <span className="absolute inset-0 bg-cyan-500/40 rotate-45 blur-[6px]" />
          </div>
          <span className="font-mono font-bold tracking-[0.25em] text-sm text-white">
            VICO<span className="text-cyan-400">.WORKS</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === '/projects' ? pathname.startsWith('/projects') : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 font-mono text-[11px] tracking-[0.2em] transition-colors group ${
                  active ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-cyan-500/0 group-hover:text-cyan-500/80 transition-colors text-[9px]">
                  &gt;
                </span>
                {link.label}
                <span className="absolute bottom-0.5 left-4 right-4 h-px bg-gradient-to-r from-cyan-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            );
          })}
        </div>

        {/* Status cluster */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px] text-gray-500 tracking-widest shrink-0">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('vw:toggle-terminal'))}
            className="p-1.5 rounded-md border border-white/10 bg-white/5 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            aria-label="Open terminal"
            title="Terminal ( ` )"
          >
            <TerminalSquare size={14} />
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('vw:open-palette'))}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-white/10 bg-white/5 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            aria-label="Open command palette"
            title="Command palette (Ctrl+K)"
          >
            <Command size={12} />
            <span className="hidden sm:inline">K</span>
          </button>
          <span className="hidden md:flex items-center gap-1.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-emerald-500/80">ONLINE</span>
          </span>
          <span className="hidden md:inline text-gray-700">|</span>
          <span suppressHydrationWarning className="hidden md:inline text-cyan-500/70 tabular-nums min-w-[62px]">{time}</span>
        </div>
      </nav>
    </motion.header>
  );
}
