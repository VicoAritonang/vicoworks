import Link from 'next/link';
import { languages, skillLayers } from '@/content/skills';
import { getProject } from '@/content/projects';
import { SectionHeading } from './ui';

/** A proof only becomes a link when there is a case study behind it. */
function hasPage(slug?: string): boolean {
  return Boolean(slug && getProject(slug)?.caseStudy);
}

/* Skills, placed after the work and organised by layer of the system rather
   than by language. Every layer names the project that proves it, and nothing
   here claims a proficiency percentage — the old grid animated every bar to
   100%, which said "expert at everything" and therefore said nothing. */

export function HowIBuild() {
  return (
    <section id="skills" className="section px-4 sm:px-6" aria-labelledby="skills-heading">
      <div className="container mx-auto">
        <SectionHeading
          id="skills-heading"
          kicker="How I build"
          title="Five layers, and what proves each one."
          lede="Listed by where it sits in a system rather than by language, because that is how the decisions actually group."
        />

        <div className="mt-12 border-y border-line">
          {skillLayers.map((layer) => (
            <div
              key={layer.id}
              className="grid gap-4 border-b border-line py-7 last:border-b-0 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-10"
            >
              <div>
                <h3 className="text-base font-medium text-fg">{layer.name}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">{layer.summary}</p>
              </div>

              <div>
                <ul className="flex flex-wrap gap-x-2 gap-y-2">
                  {layer.items.map((item) => (
                    <li
                      key={item}
                      className="rounded border border-line px-2 py-1 font-mono text-[11px] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs text-faint">
                  <span className="font-mono uppercase tracking-[0.18em]">Proof</span>{' '}
                  {layer.proof.map((proof, i) => (
                    <span key={proof.label}>
                      {i > 0 && <span className="text-line-2"> · </span>}
                      {hasPage(proof.slug) ? (
                        <Link href={`/projects/${proof.slug}`} className="link">
                          {proof.label}
                        </Link>
                      ) : (
                        <span className="text-muted">{proof.label}</span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs text-faint">
          Languages · {languages.join(' · ')}
        </p>
      </div>
    </section>
  );
}
