import type { Metadata } from 'next';
import { BlockTitle, PageShell } from '@/components/site/PageShell';
import { TechIcon } from '@/components/site/TechIcon';
import { USES } from '@/content/pages';

export const metadata: Metadata = {
  title: 'Uses',
  description: 'The tools, languages and cloud services Vico Aritonang uses to build agentic AI systems.',
  alternates: { canonical: '/uses' },
};

export default function UsesPage() {
  return (
    <PageShell eyebrow="Uses" title="My digital" accent="workspace" description="The editor, the stack and the services behind everything I ship.">
      <div className="flex flex-col gap-14">
        {USES.map((group) => (
          <section key={group.label}>
            <BlockTitle count={group.items.length}>{group.label}</BlockTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {group.items.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 rounded-xl bg-surface p-5 text-center ring-1 ring-line transition-colors duration-300 hover:bg-surface-hover"
                >
                  <div className="rounded-[20px] border-2 p-2 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-indigo-400/60">
                    <div className="grid size-16 place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0] shadow-inner transition-colors duration-500 group-hover:bg-indigo-50 dark:border-white/[0.06] dark:bg-white/[0.04] dark:group-hover:bg-indigo-500/10">
                      <TechIcon name={item.icon ?? item.title} className="size-8" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.note && <div className="text-xs text-muted">{item.note}</div>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
