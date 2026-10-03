import type { Metadata } from 'next';
import { PageShell } from '@/components/site/PageShell';
import { BUCKET_LIST, type BucketStatus } from '@/content/pages';

export const metadata: Metadata = {
  title: 'Bucket List',
  description: 'Things Vico Aritonang has done and still wants to do – dreams with a deadline.',
  alternates: { canonical: '/bucket-list' },
};

const STATUS: Record<BucketStatus, { label: string; dot: string; text: string }> = {
  done: { label: 'Done', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  doing: { label: 'In progress', dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  todo: { label: 'Someday', dot: 'bg-neutral-400', text: 'text-neutral-500' },
};

export default function BucketListPage() {
  const done = BUCKET_LIST.filter((b) => b.status === 'done').length;
  const pct = Math.round((done / BUCKET_LIST.length) * 100);

  return (
    <PageShell eyebrow="Bucket List" title="Dreams with a" accent="deadline">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <div className="mb-2 flex justify-between font-mono text-xs text-muted uppercase">
            <span>Progress</span>
            <span>
              {done} / {BUCKET_LIST.length} done
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#04f,#f0c,#ff8000)]" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ol className="flex flex-col gap-3">
          {BUCKET_LIST.map((item, i) => {
            const s = STATUS[item.status];
            return (
              <li
                key={item.title}
                className="flex items-start gap-4 rounded-xl bg-surface p-4 ring-1 ring-line animate-rise-in"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border ${
                    item.status === 'done' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {item.status === 'done' && (
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`font-medium ${item.status === 'done' ? 'text-muted line-through decoration-1' : ''}`}>{item.title}</div>
                  <div className="text-sm font-light text-muted">{item.note}</div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className={`flex items-center gap-1.5 font-mono text-[10px] uppercase ${s.text}`}>
                    <span className={`size-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                  {item.when && <span className="font-mono text-[10px] text-muted">{item.when}</span>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </PageShell>
  );
}
