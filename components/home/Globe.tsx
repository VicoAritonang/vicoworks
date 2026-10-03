'use client';

import createGlobe from 'cobe';
import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from 'react';
import { GLOBE_MARKERS } from '@/content/home';

const HUB = GLOBE_MARKERS[0];
const ARCS = GLOBE_MARKERS.slice(1).map((m) => ({ id: `${HUB.id}-${m.id}`, from: HUB.location, to: m.location }));

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
}
const readDark = () => document.documentElement.classList.contains('dark');
const noopSubscribe = () => () => {};

/**
 * Dotted WebGL globe. Spins slowly, can be flung with inertia, tilts within
 * ±0.4 rad, and shows a label over each city while it faces the camera.
 */
export function Globe({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dark = useSyncExternalStore(subscribeTheme, readDark, () => true);
  /* City labels rely on CSS anchor positioning; hidden where unsupported. */
  const supportsAnchor = useSyncExternalStore(
    noopSubscribe,
    () => typeof CSS !== 'undefined' && !!CSS.supports?.('position-anchor: --x'),
    () => false
  );

  const inView = useRef(true);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const velocity = useRef({ phi: 0, theta: 0 });
  const phiOffset = useRef(0);
  const thetaOffset = useRef(0);
  const dragging = useRef(false);
  const resume = useRef<(() => void) | null>(null);

  /* Pause the render loop while the globe is off-screen. */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting) resume.current?.();
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Drag, with release velocity carried into an inertial spin. */
  useEffect(() => {
    const isMobile = () => window.matchMedia('(max-width: 1023px)').matches;
    const move = (e: PointerEvent) => {
      if (!pointer.current) return;
      const dx = e.clientX - pointer.current.x;
      const dy = e.clientY - pointer.current.y;
      const mobile = isMobile();
      dragOffset.current = { phi: dx / 300, theta: mobile ? 0 : dy / 1000 };
      const now = Date.now();
      if (last.current) {
        const dt = Math.max(now - last.current.t, 1);
        velocity.current = {
          phi: Math.max(-0.15, Math.min(0.15, ((e.clientX - last.current.x) / dt) * 0.3)),
          theta: mobile ? 0 : Math.max(-0.15, Math.min(0.15, ((e.clientY - last.current.y) / dt) * 0.08)),
        };
      }
      last.current = { x: e.clientX, y: e.clientY, t: now };
    };
    const up = () => {
      if (!pointer.current) return;
      phiOffset.current += dragOffset.current.phi;
      thetaOffset.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
      last.current = null;
      pointer.current = null;
      if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
      dragging.current = false;
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let raf: number | null = null;
    /* Start with the hub (Jakarta) facing the camera, a touch left of centre
       so the spin carries it across the front. cobe's phi for a longitude is
       π − (lon·π/180 − π/2). */
    let phi = Math.PI - ((HUB.location[1] * Math.PI) / 180 - Math.PI / 2) - 0.35;
    let prev = 0;
    let dead = false;

    const tick = (t: number) => {
      if (dead) return;
      if (!inView.current) {
        raf = null;
        return;
      }
      const step = prev ? Math.min(t - prev, 50) / 16.667 : 1;
      prev = t;
      if (!dragging.current) {
        phi += 0.003 * step;
        const v = velocity.current;
        if (Math.abs(v.phi) > 1e-4 || Math.abs(v.theta) > 1e-4) {
          phiOffset.current += v.phi * step;
          thetaOffset.current += v.theta * step;
          const decay = 0.95 ** step;
          v.phi *= decay;
          v.theta *= decay;
        }
        /* Ease the tilt back inside ±0.4 rad. */
        if (thetaOffset.current < -0.4) thetaOffset.current += (-0.4 - thetaOffset.current) * (1 - 0.9 ** step);
        else if (thetaOffset.current > 0.4) thetaOffset.current += (0.4 - thetaOffset.current) * (1 - 0.9 ** step);
      }
      globe?.update({
        phi: phi + phiOffset.current + dragOffset.current.phi,
        theta: 0.2 + thetaOffset.current + dragOffset.current.theta,
      });
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf === null && !dead) {
        prev = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const init = () => {
      const w = canvas.offsetWidth;
      if (w === 0 || globe) return;
      const blue: [number, number, number] = [0.3, 0.45, 0.85];
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: w,
        height: w,
        phi: 0,
        theta: 0.2,
        dark: dark ? 1 : 0,
        diffuse: dark ? 2 : 1.5,
        mapSamples: 10000,
        mapBrightness: dark ? 6 : 10,
        baseColor: dark ? [0.3, 0.3, 0.3] : [1, 1, 1],
        markerColor: blue,
        glowColor: dark ? [1, 1, 1] : [0.94, 0.93, 0.91],
        markerElevation: 0.01,
        markers: GLOBE_MARKERS.map((m) => ({ location: m.location, size: 0.025, id: m.id })),
        arcs: ARCS,
        arcColor: blue,
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: dark ? 0.6 : 0.7,
      });
      start();
      requestAnimationFrame(() => {
        if (!dead) canvas.style.opacity = '1';
      });
    };
    resume.current = start;

    let ro: ResizeObserver | null = null;
    if (canvas.offsetWidth > 0) init();
    else {
      ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro?.disconnect();
          ro = null;
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      dead = true;
      if (raf !== null) cancelAnimationFrame(raf);
      globe?.destroy();
      ro?.disconnect();
      resume.current = null;
    };
  }, [dark]);

  return (
    <div ref={boxRef} aria-hidden="true" className={`relative aspect-square select-none ${className}`} style={{ contain: 'layout style paint' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointer.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.style.cursor = 'grabbing';
          dragging.current = true;
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 1.2s ease',
          borderRadius: '50%',
          touchAction: 'none',
        }}
      />
      {GLOBE_MARKERS.map((m) => {
        const style: CSSProperties & Record<string, string | number> = {
          position: 'absolute',
          marginBottom: 5,
          padding: '1px 4px',
          background: dark ? '#fff' : '#1a1a2e',
          color: dark ? '#1a1a2e' : '#fff',
          fontFamily: 'monospace',
          fontSize: '0.5rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: `var(--cobe-visible-${m.id}, 0)`,
          filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
          transition: 'opacity 0.8s, filter 0.8s',
        };
        if (supportsAnchor) {
          Object.assign(style, {
            positionAnchor: `--cobe-${m.id}`,
            bottom: 'anchor(top)',
            left: 'anchor(center)',
            translate: '-51% 0',
          });
        } else style.display = 'none';
        return (
          <div key={m.id} style={style}>
            {m.label}
            <span
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translate3d(-50%, -1px, 0)',
                border: '4px solid transparent',
                borderTopColor: dark ? '#fff' : '#1a1a2e',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
