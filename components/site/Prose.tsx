import type { ReactNode } from 'react';

/** Long-form text column for legal and similar pages. */
export function Prose({ updated, children }: { updated: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl text-[17px] leading-relaxed font-light text-neutral-700 dark:text-neutral-300 [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-indigo-300 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_li]:my-1.5 [&_p]:my-4 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-indigo-400">
      <p className="!mt-0 font-mono text-xs tracking-widest text-muted uppercase">Last updated {updated}</p>
      {children}
    </article>
  );
}
