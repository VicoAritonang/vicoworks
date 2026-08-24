import { profile } from '@/content/profile';
import { SectionHeading } from './ui';

/* Four honest paragraphs. The old version of this section was two cards
   reading LOCATION.DATA and CONTACT.INFO, which told a reader nothing a
   person would want to know. */

const FACTS = [
  { label: 'Based in', value: profile.location },
  { label: 'Studying', value: profile.education },
  { label: 'Looking for', value: profile.availability },
];

export function About() {
  return (
    <section id="about" className="section px-4 sm:px-6" aria-labelledby="about-heading">
      <div className="container mx-auto">
        <SectionHeading id="about-heading" kicker="About" title="How I got here." />

        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div className="space-y-5">
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="prose-body">
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="h-fit space-y-5 border-t border-line pt-6 md:w-64 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="kicker">{fact.label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
