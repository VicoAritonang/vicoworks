'use client';

import { useEffect, useState } from 'react';
import { incrementVisitorCount } from '@/app/actions';

/* The visitor count survives, but as a footnote rather than as one of three
   headline figures. It is a fact about the website; the numbers at the top of
   the page should be facts about the work.

   Runs after hydration, so the page it sits on stays statically rendered. */

export function VisitorCounter({ className = '' }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    incrementVisitorCount().then((value) => {
      if (active && value !== null) setCount(value);
    });
    return () => {
      active = false;
    };
  }, []);

  if (count === null) return null;

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {count.toLocaleString('en-US')} visits
    </span>
  );
}
