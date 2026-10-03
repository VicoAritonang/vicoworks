import type { ReactNode } from 'react';

/**
 * The page skeleton: a centred column flanked by two diagonal-hatched rails
 * that run the full height of the page.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl grow flex-col max-sm:px-1">
      <div className="grid flex-1 grid-cols-[12px_1fr_12px] lg:grid-cols-[32px_1fr_32px]">
        <div className="hatch w-full border-x" aria-hidden="true" />
        <div className="relative min-w-0">{children}</div>
        <div className="hatch w-full border-x" aria-hidden="true" />
      </div>
    </div>
  );
}
