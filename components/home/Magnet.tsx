'use client';

import { useState, type ReactNode } from 'react';

/** CTA that drifts toward the cursor (max ~7px each way) and springs back on leave. */
export function Magnet({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform .2s ease-out',
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setOffset({
          x: ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 14,
          y: ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 14,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </span>
  );
}
