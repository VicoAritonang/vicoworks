import type { Metadata } from 'next';
import { BlockTitle, PageShell } from '@/components/site/PageShell';
import { getGuestbookEntries } from './actions';
import { GuestbookForm } from './GuestbookForm';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'Leave a note for Vico Aritonang – say hi, share feedback, or just let him know you were here.',
  alternates: { canonical: '/guestbook' },
};

/* New signatures revalidate the page immediately; this is the fallback. */
export const revalidate = 60;

const GRADIENTS = [
  'linear-gradient(135deg,#4f46e5,#a855f7)',
  'linear-gradient(135deg,#059669,#34d399)',
  'linear-gradient(135deg,#ea580c,#fbbf24)',
  'linear-gradient(135deg,#0284c7,#38bdf8)',
  'linear-gradient(135deg,#db2777,#f472b6)',
];

function avatarFor(name: string) {
  const n = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[n % GRADIENTS.length];
}

function timeAgo(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  const steps: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [30, 'day'],
    [12, 'month'],
  ];
  let v = s;
  for (const [size, unit] of steps) {
    if (v < size) return `${v} ${unit}${v === 1 ? '' : 's'} ago`;
    v = Math.floor(v / size);
  }
  return `${v} year${v === 1 ? '' : 's'} ago`;
}

export default async function GuestbookPage() {
  const { entries, unavailable } = await getGuestbookEntries();

  return (
    <PageShell eyebrow="Guestbook" title="Let me know" accent="you were here" description="Say hi, leave some feedback, or drop a note for whoever visits next.">
      <div className="mx-auto flex max-w-2xl flex-col gap-12">
        <GuestbookForm />

        <section>
          <BlockTitle count={entries.length}>Signatures</BlockTitle>
          {unavailable ? (
            <p className="py-8 text-center text-sm text-muted">The guestbook is warming up – signatures will appear here soon.</p>
          ) : entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No signatures yet. Be the first!</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {entries.map((e, i) => (
                <li
                  key={e.id}
                  className="flex gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line animate-rise-in"
                  style={{ animationDelay: `${Math.min(i, 10) * 0.04}s` }}
                >
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
                    style={{ background: avatarFor(e.name) }}
                  >
                    {e.name[0]?.toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate font-medium">{e.name}</span>
                      <time dateTime={e.created_at} className="shrink-0 font-mono text-[10px] text-muted uppercase">
                        {timeAgo(e.created_at)}
                      </time>
                    </div>
                    <p className="mt-1 font-light break-words text-neutral-700 dark:text-neutral-300">{e.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}
