'use client';

import { useEffect, useState } from 'react';

/** Fixed sci-fi frame around the viewport: corner brackets + micro-labels. Desktop only. */
export function HUDFrame() {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-[55] pointer-events-none hidden lg:block font-mono select-none" aria-hidden="true">
      {/* Corner brackets */}
      <div className="absolute top-20 left-4 w-6 h-6 border-t border-l border-cyan-500/30" />
      <div className="absolute top-20 right-4 w-6 h-6 border-t border-r border-cyan-500/30" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-cyan-500/30" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-cyan-500/30" />

      {/* Side labels */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 origin-left text-[9px] tracking-[0.4em] text-cyan-500/25 whitespace-nowrap">
        VICOWORKS // PORTFOLIO.SYS
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[9px] tracking-[0.3em] text-cyan-500/25 [writing-mode:vertical-rl]">
        SCROLL {String(scrollPct).padStart(3, '0')}% — 6.2°S 106.8°E
      </div>
    </div>
  );
}
