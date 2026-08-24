'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, X } from 'lucide-react';

/* =========================================================================
   RENDER STATS
   -------------------------------------------------------------------------
   Kept, but no longer worn. It used to sit on screen permanently labelled
   SYS.TELEMETRY / STATUS: NOMINAL, running a requestAnimationFrame loop for
   the lifetime of every page — including on phones, where `hidden lg:block`
   made it invisible but not idle.

   Now it is off by default and opened deliberately from the command palette
   ("Show render stats") or the `stats` terminal command. The rAF loop starts
   when the panel opens, stops when it closes, and pauses when the tab is
   hidden. Numbers about the page belong to whoever asks for them.
   ========================================================================= */

interface PerformanceMemory {
  usedJSHeapSize: number;
}

const HISTORY = 30;

export function SystemMonitor() {
  const [open, setOpen] = useState(false);
  const [fps, setFps] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [mem, setMem] = useState<number | null>(null);
  const frames = useRef(0);

  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    window.addEventListener('vw:toggle-stats', toggle);
    return () => window.removeEventListener('vw:toggle-stats', toggle);
  }, []);

  const sample = useCallback(() => {
    const perf = performance as unknown as { memory?: PerformanceMemory };
    if (perf.memory) setMem(Math.round(perf.memory.usedJSHeapSize / 1048576));
  }, []);

  useEffect(() => {
    if (!open) return;

    let raf = 0;
    let last = performance.now();
    let running = true;

    const loop = () => {
      if (!running) return;
      frames.current += 1;
      const now = performance.now();
      if (now - last >= 500) {
        const current = Math.round((frames.current * 1000) / (now - last));
        setFps(current);
        setHistory((prev) => [...prev.slice(-(HISTORY - 1)), current]);
        sample();
        frames.current = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        frames.current = 0;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [open, sample]);

  const peak = Math.max(60, ...history);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 left-4 z-[60] hidden w-52 select-none rounded-xl border border-line bg-panel/95 p-3.5 font-mono shadow-[var(--shadow-panel)] backdrop-blur-2xl sm:bottom-6 sm:left-6 lg:block"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-muted">
              <Activity size={12} aria-hidden="true" />
              RENDER STATS
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-faint transition-colors hover:text-fg"
              aria-label="Close render stats"
            >
              <X size={13} />
            </button>
          </div>

          <div className="mb-3">
            <div className="mb-1 flex justify-between text-[10px]">
              <span className="text-faint">FPS</span>
              <span className="text-fg tabular-nums">{fps}</span>
            </div>
            <div className="flex h-8 items-end gap-[2px]" aria-hidden="true">
              {history.map((value, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${value >= 50 ? 'bg-line-2' : 'bg-accent'}`}
                  style={{ height: `${Math.max(8, (value / peak) * 100)}%` }}
                />
              ))}
            </div>
          </div>

          {mem !== null && (
            <div className="flex justify-between text-[10px]">
              <span className="text-faint">JS heap</span>
              <span className="text-muted tabular-nums">{mem} MB</span>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
