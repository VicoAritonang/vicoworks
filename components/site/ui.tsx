import Link from 'next/link';
import type { ReactNode } from 'react';

function ArrowIcon({ diagonal }: { diagonal: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-3.5 ${diagonal ? '-rotate-45' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * The little dashed square with an arrow that slides out diagonally while a
 * fresh one slides in on hover. Needs a `group` ancestor.
 */
export function ArrowSwap({ diagonal = true }: { diagonal?: boolean }) {
  const inFrom = diagonal ? '-translate-x-full translate-y-full' : '-translate-x-full';
  const outTo = diagonal
    ? 'group-hover:translate-x-full group-hover:-translate-y-full'
    : 'group-hover:translate-x-full';
  return (
    <span className="relative inline-block size-[25px] shrink-0 overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-white/50 transition-colors duration-500 group-hover:bg-neutral-200 dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/10">
      <span
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 ${inFrom}`}
      >
        <ArrowIcon diagonal={diagonal} />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${outTo}`}
      >
        <ArrowIcon diagonal={diagonal} />
      </span>
    </span>
  );
}

/**
 * Pill button whose black knob on the right floods the whole pill on hover
 * (a clip-path transition), inverting the label.
 */
export function FloodButton({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    'group relative inline-flex w-fit cursor-pointer items-center justify-between overflow-hidden rounded-full border border-black/30 bg-black/10 py-1 pr-1 pl-3 text-base font-medium backdrop-blur-xs transition-all dark:border-white/20 dark:bg-white/10';
  const inner = (
    <>
      <span className="z-10 flex-1 px-3 text-center text-black transition-colors duration-[450ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:text-white dark:text-white dark:group-hover:text-black">
        {children}
      </span>
      <span className="absolute inset-1 rounded-full bg-black transition-[clip-path] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] [clip-path:inset(0_0_0_calc(100%-40px)_round_9999px)] group-hover:[clip-path:inset(0_round_9999px)] dark:bg-white" />
      <span className="relative z-10 flex size-9 items-center justify-center overflow-hidden rounded-full text-white dark:text-black">
        <svg
          viewBox="0 0 24 24"
          className="absolute size-4 transition-transform duration-500 group-hover:translate-x-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="absolute size-4 -translate-x-8 transition-transform duration-500 group-hover:translate-x-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </>
  );

  if (external || href.startsWith('mailto:') || href.startsWith('http')) {
    return (
      <a
        href={href}
        className={className}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

/** "SEE MORE PROJECTS ⧉" – mono uppercase link with the ArrowSwap box. */
export function MonoLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group mx-auto mt-pagebuilder flex w-fit items-center justify-center gap-2 font-mono text-xs text-neutral-800 uppercase transition-colors hover:text-black dark:text-white/80 dark:hover:text-white"
    >
      {children}
      <ArrowSwap diagonal={false} />
    </Link>
  );
}

export { SectionHeading } from './SectionHeading';

/** Full-width hairline divider. */
export function Rule() {
  return <div className="w-full border-t" />;
}
