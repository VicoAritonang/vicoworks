import type { ReactNode } from 'react';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';
import { PageFrame } from './PageFrame';

interface PageShellProps {
  eyebrow: string;
  /** Plain part of the h1. */
  title: string;
  /** Colourful italic tail of the h1. */
  accent?: string;
  description?: ReactNode;
  children: ReactNode;
}

/**
 * Chrome shared by every secondary page: floating nav, hatched frame, a
 * centred serif header, and the footer.
 */
export function PageShell({ eyebrow, title, accent, description, children }: PageShellProps) {
  return (
    <>
      <SiteNav />
      <main id="main" className="relative flex min-h-screen flex-col">
        <PageFrame>
          <div className="relative px-3 pt-28 pb-16 sm:px-6 sm:pt-32">
            <header className="mb-12 flex flex-col items-center gap-5 text-center sm:mb-16">
              <span className="font-mono text-xs tracking-widest text-black/80 uppercase animate-rise-in dark:text-white/70">
                {eyebrow}
              </span>
              <h1 className="font-serif text-5xl tracking-tight text-balance animate-headline-in [animation-delay:0.08s] md:text-7xl">
                {title}
                {accent && (
                  <>
                    {' '}
                    <span className="mask-sweep animate-mask-sweep inline-block px-1 pb-1 italic text-colorful animate-gradient-x [animation-delay:0.08s]">
                      {accent}
                    </span>
                  </>
                )}
              </h1>
              {description && (
                <p className="max-w-2xl text-base leading-relaxed font-light text-muted animate-rise-in [animation-delay:0.2s] sm:text-lg">
                  {description}
                </p>
              )}
            </header>
            <div className="-mx-3 border-t sm:-mx-6" />
            <div className="pt-10 sm:pt-14">{children}</div>
          </div>
        </PageFrame>
      </main>
      <SiteFooter />
    </>
  );
}

/** Mono label + hairline, used to open a block inside a page. */
export function BlockTitle({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="font-mono text-xs tracking-widest text-neutral-600 uppercase dark:text-neutral-400">{children}</h2>
      <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      {count !== undefined && <span className="font-mono text-[10px] text-neutral-500">{String(count).padStart(2, '0')}</span>}
    </div>
  );
}
