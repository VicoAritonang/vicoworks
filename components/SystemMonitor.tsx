'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronUp } from 'lucide-react';

interface PerformanceMemory {
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/** Live telemetry HUD: real FPS from rAF, JS heap when the browser exposes it. */
export function SystemMonitor() {
  const [openPanel, setOpenPanel] = useState(true);
  const [fps, setFps] = useState(0);
  const [mem, setMem] = useState<number | null>(null);
  const [uptime, setUptime] = useState(0);
  const frames = useRef(0);
  const fpsHistory = useRef<number[]>([]);
  const [, forceRender] = useState(0);

  // FPS via requestAnimationFrame
  useEffect(() => {
    let rafId: number;
    let last = performance.now();

    const loop = () => {
      frames.current++;
      const now = performance.now();
      if (now - last >= 500) {
        const current = Math.round((frames.current * 1000) / (now - last));
        setFps(current);
        fpsHistory.current = [...fpsHistory.current.slice(-29), current];
        forceRender(n => n + 1);
        frames.current = 0;
        last = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Memory + uptime
  useEffect(() => {
    const id = setInterval(() => {
      const perf = performance as unknown as { memory?: PerformanceMemory };
      if (perf.memory) {
        setMem(Math.round(perf.memory.usedJSHeapSize / 1048576));
      }
      setUptime(u => u + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fmtUptime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const fpsColor = fps >= 50 ? 'text-emerald-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400';
  const maxFps = Math.max(60, ...fpsHistory.current);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[60] hidden lg:block select-none">
      <AnimatePresence mode="wait">
        {openPanel ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-56 rounded-xl border border-white/10 bg-black/70 backdrop-blur-xl p-3.5 font-mono shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-cyan-400">
                <Activity size={12} />
                SYS.TELEMETRY
              </span>
              <button
                onClick={() => setOpenPanel(false)}
                className="text-gray-600 hover:text-white transition-colors rotate-180"
                aria-label="Collapse telemetry"
              >
                <ChevronUp size={13} />
              </button>
            </div>

            {/* FPS graph */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-500">RENDER.FPS</span>
                <span className={fpsColor}>{fps}</span>
              </div>
              <div className="flex items-end gap-[2px] h-8">
                {fpsHistory.current.map((f, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${f >= 50 ? 'bg-emerald-500/60' : f >= 30 ? 'bg-yellow-500/60' : 'bg-red-500/60'}`}
                    style={{ height: `${Math.max(8, (f / maxFps) * 100)}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Memory */}
            {mem !== null && (
              <div className="flex justify-between text-[10px] mb-1.5">
                <span className="text-gray-500">JS.HEAP</span>
                <span className="text-purple-400">{mem} MB</span>
              </div>
            )}

            {/* Session */}
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-gray-500">SESSION.TIME</span>
              <span className="text-cyan-400 tabular-nums">{fmtUptime(uptime)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-500">STATUS</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                NOMINAL
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setOpenPanel(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-black/70 backdrop-blur-xl font-mono text-[10px] text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shadow-xl"
            aria-label="Expand telemetry"
          >
            <Activity size={12} className="text-cyan-500" />
            <span className={fpsColor}>{fps} FPS</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
