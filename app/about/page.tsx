import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BlockTitle, PageShell } from '@/components/site/PageShell';
import { FloodButton } from '@/components/site/ui';
import { TechIcon } from '@/components/site/TechIcon';
import { EXPERTISE, PROFILE, PROFILE_PHOTO, STATUS } from '@/content/home';
import { SITE_URL } from '@/lib/seo';
import { ABOUT, USES } from '@/content/pages';

export const metadata: Metadata = {
  title: 'About Vico Aritonang',
  description:
    'Who is Vico Aritonang? An AI engineer in Jakarta, Indonesia, building agentic AI systems, RAG pipelines, Go services and cloud infrastructure. Co-founder of Avagenc.',
  alternates: { canonical: '/about' },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/about#page`,
    url: `${SITE_URL}/about`,
    name: 'About Vico Aritonang',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@id': `${SITE_URL}/#vico` },
    about: { '@id': `${SITE_URL}/#vico` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ABOUT.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export default function AboutPage() {
  const stack = USES.filter((g) => g.label !== 'Dev Tools').flatMap((g) => g.items);

  return (
    <PageShell eyebrow="Behind the code" title="About" accent="Vico Aritonang" description="Who I am, what I build, and how I like to work.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Portrait */}
        <div className="lg:col-span-5">
          <div className="group relative mx-auto w-full max-w-sm lg:sticky lg:top-32">
            <div className="pointer-events-none absolute -inset-6 rounded-full bg-indigo-500/30 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
            <div className="relative rounded-[28px] border border-neutral-300 p-3 transition-colors duration-500 group-hover:border-indigo-400/60 dark:border-neutral-700">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={PROFILE_PHOTO}
                  alt="Vico Aritonang"
                  fill
                  priority
                  sizes="(min-width: 1024px) 384px, 90vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <FloodButton href={PROFILE.resume}>Download résumé</FloodButton>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-neutral-700 uppercase underline-offset-4 hover:underline dark:text-white/70"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-14 lg:col-span-7">
          <section>
            <BlockTitle>Bio</BlockTitle>
            <div className="flex flex-col gap-5 text-lg leading-relaxed font-light text-neutral-700 dark:text-neutral-300">
              {ABOUT.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <BlockTitle>Right now</BlockTitle>
            <div className="grid gap-3 sm:grid-cols-3">
              {STATUS.map((s) => (
                <div key={s.tag} className="rounded-xl p-4 ring-1 ring-line">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 ${s.color}`} />
                    <span className="font-mono text-xs text-foreground/55 uppercase">{s.tag}</span>
                  </div>
                  <p className="mt-3 font-medium">{s.title}</p>
                  <p className="text-sm text-foreground/55">{s.sub}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <BlockTitle>How I work</BlockTitle>
            <div className="flex flex-col gap-4">
              {ABOUT.principles.map((p, i) => (
                <div key={p.title} className="flex gap-4">
                  <span className="font-mono text-xs text-neutral-400">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-xl">{p.title}</h3>
                    <p className="mt-1 font-light text-neutral-600 dark:text-neutral-400">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <BlockTitle>What I do</BlockTitle>
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {EXPERTISE.map((e) => (
                <div key={e.title}>
                  <dt className="font-mono text-xs tracking-wide text-indigo-500 uppercase dark:text-indigo-300">{e.title}</dt>
                  <dd className="mt-1 font-light text-neutral-700 dark:text-neutral-300">{e.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <BlockTitle>FAQ</BlockTitle>
            <div className="divide-y divide-line">
              {ABOUT.faq.map((f, i) => (
                <details key={f.q} className="group py-4" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-foreground">
                    <h3>{f.q}</h3>
                    <span className="text-muted transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 font-light text-neutral-700 dark:text-neutral-300">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <BlockTitle>Stack</BlockTitle>
            <div className="flex flex-wrap gap-2">
              {stack.map((t) => (
                <span key={t.title} className="flex items-center rounded-md bg-foreground/5 px-2.5 py-[5px] font-mono shadow-border">
                  <TechIcon name={t.icon ?? t.title} className="mr-1.5 size-3.5" />
                  <span className="text-[11px] font-medium tracking-wide text-neutral-600 uppercase dark:text-neutral-300">{t.title}</span>
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">
              Full experience, education and certificates live on{' '}
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                LinkedIn
              </a>{' '}
              and in my{' '}
              <a href={PROFILE.resume} className="underline underline-offset-4">
                résumé
              </a>
              . See the tools I use on the{' '}
              <Link href="/uses" className="underline underline-offset-4">
                uses page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
