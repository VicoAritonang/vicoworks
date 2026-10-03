import Link from 'next/link';
import type { ReactNode } from 'react';
import { TOOLS } from '@/content/home';
import { TechIcon } from '@/components/site/TechIcon';
import { Globe } from './Globe';
import { BucketVisual, ConnectionsVisual, TechCloudVisual } from './BentoVisuals';

const META_POSITION = {
  'top-left': 'absolute top-0 left-0 text-left',
  'top-center': 'absolute top-0 left-0 w-full text-center',
  bottom: 'w-full text-center',
} as const;

interface BentoCardProps {
  name?: string;
  description?: string;
  linkTo?: string;
  metaPosition?: keyof typeof META_POSITION;
  className?: string;
  children: ReactNode;
}

export function BentoCard({ name, description, linkTo, metaPosition = 'bottom', className = '', children }: BentoCardProps) {
  const base = `group relative flex w-full flex-col justify-between overflow-hidden rounded-xl bg-surface ring-1 ring-line transition-colors duration-300 hover:bg-surface-hover ${
    linkTo ? 'cursor-pointer' : ''
  } ${className}`;

  const inner = (
    <>
      <div className="size-full">{children}</div>
      {(name || description) && (
        <div className={`pointer-events-none z-10 flex flex-col gap-1 p-5 ${META_POSITION[metaPosition]}`}>
          {name && (
            <p className="font-mono text-xs text-neutral-400 uppercase transition-colors duration-500 group-hover:text-indigo-500/80 dark:text-neutral-500 dark:group-hover:text-indigo-300">
              {name}
            </p>
          )}
          {description && <p className="font-display text-lg tracking-wide text-neutral-700 dark:text-neutral-300">{description}</p>}
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-linear-to-br from-transparent via-transparent to-indigo-400/20 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 dark:to-white/5" />
      {linkTo && (
        <div className="absolute right-4 bottom-4 z-20 flex size-9 -translate-y-2 items-center justify-center rounded-2xl border-dashed bg-black/10 opacity-100 transition-all duration-300 ease-out max-md:border md:translate-y-0 md:opacity-0 md:group-hover:-translate-y-2 md:group-hover:opacity-100 dark:bg-white/10">
          <svg viewBox="0 0 24 24" className="size-[18px] text-neutral-700 dark:text-neutral-200" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      )}
    </>
  );

  if (!linkTo) return <div className={base}>{inner}</div>;
  /* Internal routes go through Link; files (e.g. the CV PDF) and external URLs stay plain anchors. */
  if ((linkTo.startsWith('/') && !/\.\w+$/.test(linkTo)) || linkTo.startsWith('#')) {
    return (
      <Link href={linkTo} className={base}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={linkTo} className={base} {...(linkTo.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  );
}

/** Five tool tiles that lift in a wave (centre first, edges last) on hover. */
export function UsesCard({ className = '', linkTo = '/uses' }: { className?: string; linkTo?: string }) {
  const tile = (i: number) => (i === 2 ? 'size-28 delay-0' : i === 1 || i === 3 ? 'size-24 delay-100' : 'size-24 delay-200');
  return (
    <BentoCard className={className} description="Check out my favorite tools" linkTo={linkTo} name="Uses">
      <div className="mt-10 flex items-center justify-center gap-3 md:mt-12">
        {TOOLS.slice(0, 5).map((t, i) => (
          <div key={t.title} className="inline-block text-center">
            <div className={`rounded-[20px] border-2 p-2 transition-all duration-500 group-hover:-translate-y-3 group-hover:border-indigo-400/60 ${tile(i)}`}>
              <div className="grid h-full place-items-center rounded-xl border-2 border-[#A5AEB81F]/10 bg-[#EDEEF0] shadow-inner transition-colors duration-500 group-hover:bg-indigo-50 dark:border-white/[0.06] dark:bg-white/[0.04] dark:group-hover:bg-indigo-500/10">
                <TechIcon name={t.title} className="size-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

export function Bento() {
  return (
    <div className="mb-pagebuilder grid grid-cols-1 gap-3 border-y md:grid-cols-12 lg:my-pagebuilder">
      <div className="col-span-1 md:col-span-6 lg:col-span-7 lg:row-span-5">
        <BentoCard className="h-full min-h-72" description="Clear communication, fast iterations, no surprises" linkTo="/#contact" name="Let's Build Together">
          <ConnectionsVisual />
        </BentoCard>
      </div>
      <div className="md:col-span-6 lg:col-span-5 lg:row-span-5">
        <BentoCard className="h-full min-h-72" description="The stack behind everything I ship" metaPosition="top-center" name="Tech Stack">
          <div className="absolute inset-0 -bottom-18">
            <TechCloudVisual />
          </div>
        </BentoCard>
      </div>
      <div className="md:col-span-6 lg:col-span-4 lg:row-span-6">
        <BentoCard className="h-full min-h-72" description="Agents, pipelines & infra – deployed and scaling" linkTo="/projects" metaPosition="top-left" name="What You Get">
          <div className="absolute inset-0 -bottom-10 flex items-end justify-center overflow-hidden">
            <BucketVisual />
          </div>
        </BentoCard>
      </div>
      <div className="md:col-span-6 lg:col-span-4 lg:row-span-6">
        <BentoCard className="h-full min-h-72" description="Based in Indonesia, available globally" metaPosition="top-left" name="Flexible With Timezones">
          <div className="absolute -bottom-36 left-1/2 w-sm -translate-x-1/2">
            <Globe />
          </div>
        </BentoCard>
      </div>
      <div className="col-span-1 md:col-span-12 lg:col-span-4 lg:row-span-6">
        <UsesCard className="h-72" />
      </div>
    </div>
  );
}
