'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PROFILE } from '@/content/home';

const SECTIONS = [
  { href: '/#home', label: 'HOME' },
  { href: '/#expertise', label: 'EXPERTISE' },
  { href: '/#experience', label: 'EXPERIENCE' },
  { href: '/#work', label: 'WORK' },
  { href: '/#contact', label: 'CONTACT' },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-100 transition-[background-color,border-color] duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,12,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : undefined,
        borderBottom: `1px solid ${scrolled ? 'var(--border-soft)' : 'transparent'}`,
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-5 px-[clamp(20px,4vw,48px)]">
        <Link href="/#home" className="flex shrink-0 items-center gap-2.5">
          <span className="inline-block h-2 w-2 rotate-45 bg-accent" />
          <span className="font-mono text-[13px] font-bold tracking-[0.22em] text-foreground">
            VICOWORKS<span className="text-accent">.COM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-[22px] font-mono text-[11px] tracking-[0.12em] lg:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="border-b border-transparent py-1 text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 md:gap-[18px]">
          <span className="hidden items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-success sm:flex">
            <span
              className="inline-block h-1.5 w-1.5 bg-success"
              style={{ animation: 'breathe 2.4s ease-in-out infinite' }}
            />
            ONLINE
          </span>
          <span
            suppressHydrationWarning
            className="hidden min-w-[64px] font-mono text-[11px] tabular-nums text-muted-2 md:inline"
          >
            {time}
          </span>
          <Link
            href="/projects"
            className="hidden whitespace-nowrap font-mono text-[11px] tracking-[0.1em] text-muted transition-colors hover:text-accent sm:inline"
          >
            PROJECTS →
          </Link>
          <a
            href={PROFILE.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[10px] bg-accent px-4 py-2 font-mono text-[11px] font-bold tracking-[0.1em] text-accent-ink transition-colors hover:bg-accent-hover"
          >
            RESUME
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-hairline text-foreground transition-colors hover:border-accent lg:hidden"
          >
            <span className="relative block h-[9px] w-4">
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-200"
                style={{ top: menuOpen ? 4 : 0, transform: menuOpen ? 'rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-200"
                style={{ top: menuOpen ? 4 : 8, transform: menuOpen ? 'rotate(-45deg)' : 'none' }}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-hairline-soft bg-background lg:hidden">
          <nav className="mx-auto flex max-w-[1280px] flex-col px-[clamp(20px,4vw,48px)] py-2">
            {SECTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-hairline-soft py-3.5 font-mono text-[12px] tracking-[0.14em] text-muted transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
            <Link
              href="/projects"
              onClick={() => setMenuOpen(false)}
              className="py-3.5 font-mono text-[12px] tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              PROJECTS →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
