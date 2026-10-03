import Link from 'next/link';
import { HERO, PROFILE, STATUS } from '@/content/home';
import { ArrowSwap, FloodButton } from '@/components/site/ui';
import { CardFan, CardStack } from './CardStack';

function Headline({ size }: { size: 'mobile' | 'desktop' }) {
  const mobile = size === 'mobile';
  return (
    <div
      className={`font-serif tracking-tight animate-headline-in ${
        mobile
          ? 'text-center text-[clamp(3rem,12vw,4.75rem)] leading-[1.02] [animation-delay:0.08s]'
          : 'text-[clamp(3.2rem,7.5vw,7.5rem)] leading-[0.95] [animation-delay:0.1s]'
      }`}
    >
      <span className="inline-block pr-[0.12em] text-foreground">{HERO.headlineTop}</span>
      {!mobile && <br />}{' '}
      <span
        className="mask-sweep animate-mask-sweep inline-block pr-[0.12em] pb-[0.08em]"
        style={{ animationDelay: mobile ? '0.08s' : '0.1s' }}
      >
        <span className="px-1 pb-1 italic text-colorful animate-gradient-x">{HERO.headlineAccent}</span>
      </span>
    </div>
  );
}

function Meta({ className = '' }: { className?: string }) {
  return (
    <p
      className={`font-mono text-[10px] tracking-[0.28em] text-black/80 uppercase animate-rise-in dark:text-white/70 ${className}`}
    >
      {HERO.meta}
    </p>
  );
}

function LaunchPill() {
  return (
    <a
      href={HERO.launch.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center rounded-full border border-black/0 text-sm backdrop-blur-xs transition-colors duration-300 hover:bg-black/10 dark:hover:bg-white/10"
    >
      <span className="mx-1 rounded-full bg-blue-700 px-1.5 text-xs leading-relaxed text-white">New</span>
      <span className="shiny-text px-1 py-0.5 text-black/65 dark:text-white/70">
        {HERO.launch.name} – {HERO.launch.caption}
      </span>
      <svg
        viewBox="0 0 24 24"
        className="mr-2 size-3 text-black/50 transition-transform group-hover:translate-x-0.5 dark:text-white/60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </a>
  );
}

function LaunchLink() {
  return (
    <a href={HERO.launch.href} target="_blank" rel="noopener noreferrer" className="group w-fit">
      <div className="flex w-fit flex-col text-left">
        <div className="flex items-center gap-2.5 animate-rise-in [animation-delay:0.15s]">
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-blue-500" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.28em] text-foreground/65 uppercase">
            {HERO.launch.label}
          </span>
          <span className="h-px w-10 origin-left bg-linear-to-r from-blue-500/55 to-blue-500/0 transition-transform duration-[550ms] ease-[var(--ease-out-quint)] animate-draw-in [animation-delay:0.6s] group-hover:scale-x-[2.4]" />
        </div>
        <div className="relative mt-3 w-fit animate-rise-in [animation-delay:0.27s]">
          <span className="absolute inset-0 -z-10 scale-125 bg-blue-500/30 opacity-0 blur-3xl transition-opacity duration-[600ms] group-hover:opacity-100" />
          <span className="block font-serif text-[2.5rem] leading-[0.95] tracking-[-0.02em] text-foreground">
            {HERO.launch.name}
          </span>
          <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-linear-to-r from-blue-500 via-blue-400 to-blue-500/0 transition-transform duration-[650ms] ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-foreground/55 uppercase transition-colors duration-300 animate-rise-in [animation-delay:0.39s] group-hover:text-foreground">
          <span>{HERO.launch.caption}</span>
          <ArrowSwap />
        </div>
      </div>
    </a>
  );
}

function StatusStrip() {
  const cell = 'group block h-full';
  const body = (s: (typeof STATUS)[number]) => (
    <div className="relative h-full px-4 py-4 transition-colors group-hover:bg-foreground/[0.02] lg:px-5 lg:py-5">
      <div className="flex h-full flex-col transition-[translate] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
        <div className="flex items-center gap-2.5">
          <span className={`inline-block size-2.5 shrink-0 ${s.color}`} />
          <span className="font-mono text-xs tracking-wide text-foreground/55 uppercase">{s.tag}</span>
          <svg
            viewBox="0 0 24 24"
            className="ml-auto size-3.5 text-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </div>
        <p className="mt-4 text-base leading-tight font-medium text-foreground lg:text-[17px]">{s.title}</p>
        <div className="mt-auto pt-3 text-sm leading-relaxed text-foreground/55">{s.sub}</div>
      </div>
    </div>
  );

  return (
    <div className="-mx-3 grid grid-cols-2 border-t md:-mx-4 lg:grid-cols-4 lg:border-b">
      {STATUS.map((s, i) => (
        <div
          key={s.tag}
          className={`relative animate-rise-in ${
            i === 0 ? 'border-r border-b lg:border-b-0' : i === 1 ? 'hidden lg:block lg:border-r' : 'border-b lg:border-r lg:border-b-0'
          }`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <Link href={s.href} className={cell}>
            {body(s)}
          </Link>
        </div>
      ))}
      <div className="relative col-span-2 animate-rise-in [animation-delay:0.24s] lg:col-span-1">
        <div className="relative h-full px-4 py-4 lg:px-5 lg:py-5">
          <div className="flex h-full flex-col items-center lg:items-stretch">
            <div className="hidden items-center gap-2.5 lg:flex">
              <span className="inline-block size-2.5 shrink-0 bg-rose-500" />
              <span className="font-mono text-xs tracking-wide text-foreground/55 uppercase">Reach out</span>
            </div>
            <div className="mt-auto py-8 lg:pt-3 lg:pb-0">
              <FloodButton href={`mailto:${PROFILE.email}`}>Start a conversation</FloodButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative isolate min-h-svh w-full overflow-hidden pt-20 md:pt-18 lg:overflow-visible lg:pb-6 xl:flex xl:flex-col xl:justify-center xl:pb-8"
    >
      {/* Two soft blurred blobs behind everything. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[12%] -left-[18%] size-[min(42vw,420px)] rounded-full bg-neutral-400/10 blur-3xl dark:bg-neutral-200/[0.04]" />
        <div className="absolute -right-[12%] bottom-[18%] size-[min(36vw,360px)] rounded-full bg-neutral-400/10 blur-3xl dark:bg-neutral-200/[0.05]" />
      </div>

      <h1 className="sr-only">
        {PROFILE.firstName} {PROFILE.lastName} – AI Engineer in Jakarta, Indonesia, building agentic AI
        systems, automation pipelines and cloud infrastructure.
      </h1>

      <div className="relative z-10 mx-auto h-full w-full px-3 md:h-auto md:px-4">
        {/* ---------- Mobile / tablet ---------- */}
        <div className="flex h-full flex-col justify-center gap-5 py-4 sm:py-6 lg:hidden">
          <div className="flex justify-center animate-rise-in">
            <LaunchPill />
          </div>
          <Headline size="mobile" />
          <Meta className="text-center [animation-delay:0.18s]" />
          <CardFan />
          <div className="flex flex-col gap-1">
            <div className="text-center font-serif text-[clamp(1.75rem,9vw,3.25rem)] leading-[0.95] tracking-tight animate-headline-in [animation-delay:0.4s]">
              <span className="text-chrome inline-block pb-[0.15em]">
                {PROFILE.firstName} {PROFILE.lastName}
              </span>
            </div>
            <p className="text-center font-serif text-2xl leading-snug text-neutral-600 animate-rise-in [animation-delay:0.55s] dark:text-neutral-400">
              {HERO.tagline.join(' ')}
            </p>
          </div>
        </div>

        {/* ---------- Desktop ---------- */}
        <div className="hidden flex-col gap-5 py-6 lg:flex lg:justify-start lg:gap-6 lg:py-10">
          <div className="grid grid-cols-12 items-start gap-x-6 gap-y-6">
            <div className="col-span-12 flex justify-end lg:order-2 lg:col-span-5">
              <LaunchLink />
            </div>
            <div className="col-span-12 lg:order-1 lg:col-span-7 lg:text-left">
              <Headline size="desktop" />
              <Meta className="mt-5 [animation-delay:0.3s]" />
            </div>
          </div>

          <div className="grid grid-cols-12 items-start gap-x-6 gap-y-8">
            <div className="col-span-12 lg:order-2 lg:col-span-5">
              <div className="mb-6 max-w-md animate-rise-in [animation-delay:0.45s] lg:ml-auto lg:text-right">
                <p className="font-serif text-2xl leading-snug text-neutral-600 lg:text-3xl dark:text-neutral-400">
                  {HERO.tagline[0]}
                  <br />
                  {HERO.tagline[1]}
                </p>
              </div>
              <div className="font-serif text-[clamp(2.8rem,6vw,6rem)] leading-[0.95] tracking-tight animate-headline-in [animation-delay:0.55s] lg:text-right">
                <span className="text-chrome inline-block pb-[0.15em]">{PROFILE.firstName}</span>
                <br />
                <span className="text-chrome inline-block pb-[0.15em]">{PROFILE.lastName}</span>
              </div>
            </div>
            <div className="col-span-12 max-w-180 lg:order-1 lg:col-span-7">
              <CardStack />
            </div>
          </div>
        </div>

        <StatusStrip />
      </div>
    </section>
  );
}
