'use client';

import { Moon, Sun } from 'lucide-react';

export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'vw-theme';

const THEME_COLOR: Record<Theme, string> = {
  dark: '#0d0f12',
  light: '#faf9f7',
};

/**
 * Write a theme to the document. `data-theme` on <html> is the single source of
 * truth — every palette token in globals.css hangs off it — so this is the only
 * function that ever sets it.
 */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode — the theme still applies for this session */
  }
}

export function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
}

/**
 * The button renders both icons and lets CSS pick one off `[data-theme]`. Doing
 * it in state instead would mean the server rendering an icon it cannot know is
 * correct, then correcting it after hydration.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  return (
    <button
      onClick={toggleTheme}
      className={`p-1.5 rounded-md border border-line bg-tint text-muted hover:text-accent hover:border-line-2 transition-colors ${className}`}
      aria-label="Toggle dark and light theme"
      title="Toggle theme"
    >
      <Sun size={14} className="theme-icon-dark" />
      <Moon size={14} className="theme-icon-light" />
    </button>
  );
}
