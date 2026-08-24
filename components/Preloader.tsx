'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { profile } from '@/content/profile';

/* =========================================================================
   PRELOADER
   -------------------------------------------------------------------------
   This used to print `LOADING NEURAL MODULES ......... OK` for 2.5 seconds
   while holding `overflow: hidden` on the document — a progress bar for work
   that was not happening, in front of the one visitor who mattered.

   What survives is the moment, not the theatre: the name resolves, a rule
   draws under it, and the whole thing lifts away inside 700ms. It never locks
   scrolling, it never intercepts a click, it runs once per session, and it
   does not run at all for anyone who asked for less motion.
   ========================================================================= */

const HOLD_MS = 420;
const SESSION_KEY = 'vw-booted';

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let booted = true;
    try {
      booted = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* private mode — treat as already booted and show nothing */
    }

    if (!booted && !reduceMotion) {
      // sessionStorage and the motion preference are client-only reads; the
      // server has to render nothing here or hydration mismatches.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          /* nothing to persist to; the overlay is already gone */
        }
      }, HOLD_MS);
      setChecked(true);
      return () => clearTimeout(timer);
    }

    setChecked(true);
  }, [reduceMotion]);

  if (!checked) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-bg px-6"
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="display-2 text-fg"
            >
              {profile.name}
            </motion.p>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className="mx-auto mt-4 block h-px w-40 origin-left bg-accent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
