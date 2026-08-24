import type { ProjectStatus } from '@/content/types';

/* Small shared pieces. Server components — none of them need the client. */

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-development': 'In development',
  research: 'Research',
  archived: 'Archived',
};

/** Only a live system gets the accent dot. Status is information, not decoration. */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
      <span
        className={`h-1.5 w-1.5 rounded-full ${status === 'live' ? 'bg-ok' : 'bg-line-2'}`}
        aria-hidden="true"
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StackList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-2 gap-y-2 ${className}`} aria-label="Technologies used">
      {items.map((item) => (
        <li
          key={item}
          className="rounded border border-line px-2 py-1 font-mono text-[11px] text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SectionHeading({
  kicker,
  title,
  lede,
  id,
}: {
  kicker: string;
  title: string;
  lede?: string;
  id?: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="kicker">{kicker}</p>
      <h2 id={id} className="display-2 mt-3 text-fg">
        {title}
      </h2>
      {lede && <p className="lede mt-4">{lede}</p>}
    </header>
  );
}
