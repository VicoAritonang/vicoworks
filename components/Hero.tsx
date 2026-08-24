import Link from 'next/link';
import { ArrowDown, ArrowRight, Download } from 'lucide-react';
import { profile } from '@/content/profile';

/* The h1 is a claim, not a name. A recruiter arrives knowing nothing and
   leaves five seconds later with either an answer to "what does this person
   build" or nothing at all — the name is on the page anyway, in the navbar,
   the identity line and the footer.

   No framer-motion here, and no entrance animation on the h1 itself. This
   used to be a client component whose server HTML shipped the headline as
   `style="opacity:0"`, so the most important sentence on the site waited for
   hydration before it existed. Everything below it rises via CSS, which runs
   at first paint instead of after the bundle. */

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[88vh] items-center px-4 pt-28 pb-16 sm:px-6 sm:pt-32"
    >
      <div className="container mx-auto">
        <p
          className="rise inline-flex items-center gap-2 rounded-full border border-line bg-tint px-3 py-1 font-mono text-[11px] tracking-wide text-muted"
          style={{ animationDelay: '40ms' }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
          {profile.availability}
        </p>

        <h1 className="display-1 mt-6 max-w-[19ch] text-fg">{profile.claim}</h1>

        <p className="rise lede mt-7" style={{ animationDelay: '120ms' }}>
          {profile.identity}
        </p>

        <div
          className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: '200ms' }}
        >
          <Link
            href="#work"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Read the case studies
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          <a
            href={profile.links.resume}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-muted transition-colors hover:border-line-2 hover:text-fg"
          >
            <Download size={15} aria-hidden="true" />
            Download CV
          </a>
        </div>

        {/* Replaces the old three-card Stats block. These are facts about the
            work; a visitor counter was a fact about the website. */}
        <ul
          className="rise mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 font-mono text-xs text-faint"
          style={{ animationDelay: '280ms' }}
        >
          {profile.proof.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div
        className="rise pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
        style={{ animationDelay: '600ms' }}
        aria-hidden="true"
      >
        <ArrowDown size={16} className="text-faint" />
      </div>
    </section>
  );
}
