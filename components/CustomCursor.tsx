'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* Trailing ring + dot, fine pointers only.

   The previous version called setVisible(true) on every single mousemove —
   a React state update per pointer event, for a value that changes twice in a
   session. Visibility and hover state are now written through motion values
   and a ref guard, so moving the mouse re-renders nothing. */

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const opacity = useMotionValue(0);
  const size = useMotionValue(32);

  const ringX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 });
  const ringSize = useSpring(size, { stiffness: 260, damping: 26 });

  const hovering = useRef(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // A capability read has to happen after hydration; doing it during render
    // would make the server and client HTML disagree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (opacity.get() !== 1) opacity.set(1);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const next = Boolean(target?.closest('a, button, input, [role="button"]'));
      if (next === hovering.current) return;
      hovering.current = next;
      size.set(next ? 48 : 32);
    };

    const onLeave = () => opacity.set(0);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y, opacity, size]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[95]" aria-hidden="true">
      <motion.div
        className="absolute rounded-full border border-line-2"
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          opacity,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x, y, opacity, translateX: '-50%', translateY: '-50%' }}
      />
    </div>
  );
}
