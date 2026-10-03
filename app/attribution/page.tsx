import type { Metadata } from 'next';
import { BlockTitle, PageShell } from '@/components/site/PageShell';
import { ATTRIBUTION } from '@/content/pages';

export const metadata: Metadata = {
  title: 'Attribution',
  description: 'Credits for the design inspiration, typefaces and open-source libraries behind vicoworks.com.',
  alternates: { canonical: '/attribution' },
};

export default function AttributionPage() {
  return (
    <PageShell
      eyebrow="Attribution"
      title="Standing on"
      accent="shoulders"
      description="This site borrows from people who did the hard work first. Credit where it is due."
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        {ATTRIBUTION.map((group) => (
          <section key={group.group}>
            <BlockTitle count={group.items.length}>{group.group}</BlockTitle>
            <ul className="divide-y divide-line">
              {group.items.map((item) => (
                <li key={item.title}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-6 py-4">
                    <span className="font-display text-xl transition-colors group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
                      {item.title}
                    </span>
                    <span className="text-right text-sm font-light text-muted">{item.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
