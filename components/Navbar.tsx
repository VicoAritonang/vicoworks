'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Command } from 'lucide-react';
import { profile } from '@/content/profile';
import { ThemeToggle } from './theme';

/* The clock is gone. It re-rendered the header once a second on every page
   for the whole session, and told a visitor the time they already knew.

   The terminal button is gone too — not the terminal, just the advertisement.
   It is still on the backtick key and still in the command palette; finding it
   should feel like finding something. */

const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#skills', label: 'How I build' },
  { href: '/projects', label: 'Projects' },
  { href: '/#contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative block h-2 w-2">
            <span className="absolute inset-0 rotate-45 bg-accent transition-transform duration-500 group-hover:rotate-[135deg]" />
          </span>
          <span className="text-sm font-medium text-fg">{profile.name}</span>
        </Link>

        {/* There is no mobile menu, and a hamburger for four in-page anchors
            would be ceremony. Projects is the only destination that is not
            reachable by scrolling, so it is the one link that stays. */}
        <div className="flex items-center gap-7">
          {LINKS.map((link) => {
            const active = link.href === '/projects' && pathname.startsWith('/projects');
            const mobileVisible = link.href === '/projects';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${mobileVisible ? '' : 'hidden md:inline'} ${
                  active ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('vw:open-palette'))}
            className="flex items-center gap-1.5 rounded-md border border-line bg-tint px-2 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-line-2 hover:text-fg"
            aria-label="Open command palette"
            title="Command palette (Ctrl+K)"
          >
            <Command size={12} aria-hidden="true" />
            <span className="hidden sm:inline">K</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
