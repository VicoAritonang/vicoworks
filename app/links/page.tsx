import type { Metadata } from 'next';
import Image from 'next/image';
import { BlockTitle, PageShell } from '@/components/site/PageShell';
import { TechIcon } from '@/components/site/TechIcon';
import { PROFILE, PROFILE_PHOTO } from '@/content/home';
import { LINKS } from '@/content/pages';

export const metadata: Metadata = {
  title: 'Links',
  description: 'All of Vico Aritonang’s links in one place – GitHub, LinkedIn, email, résumé and live projects.',
  alternates: { canonical: '/links' },
};

export default function LinksPage() {
  return (
    <PageShell eyebrow="Links" title="All my links," accent="one place">
      <div className="mx-auto flex max-w-xl flex-col gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src={PROFILE_PHOTO}
            alt="Vico Aritonang"
            width={96}
            height={96}
            className="size-24 rounded-full border-2 border-neutral-200 object-cover object-top dark:border-neutral-800"
          />
          <div>
            <div className="font-display text-2xl">
              {PROFILE.firstName} {PROFILE.lastName}
            </div>
            <div className="font-mono text-xs tracking-widest text-muted uppercase">{PROFILE.tagline}</div>
          </div>
        </div>
        {LINKS.map((group) => (
          <section key={group.group}>
            <BlockTitle>{group.group}</BlockTitle>
            <div className="flex flex-col gap-3">
              {group.items.map((l) => (
                <a
                  key={l.title}
                  href={l.href}
                  {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-black/[0.03] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
                    {l.icon ? <TechIcon name={l.icon} className="size-5" /> : <span className="font-display text-lg">{l.title[0]}</span>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{l.title}</span>
                    <span className="block truncate text-sm text-muted">{l.description}</span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
