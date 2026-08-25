import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_PROJECTS, type FeaturedProject } from '@/content/home';
import { Reveal } from './Reveal';

/**
 * Screenshot area. Until a real image is dropped into /public/projects/ and
 * wired up in content/home.ts, this renders a quiet hatched placeholder rather
 * than a broken image or an empty gap.
 */
function Thumb({ project }: { project: FeaturedProject }) {
  if (project.image) {
    return (
      <div className="relative h-[180px] w-full overflow-hidden border-b border-hairline">
        <Image
          src={project.image}
          alt={`${project.name} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-[180px] w-full items-center justify-center border-b border-hairline"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(255,255,255,.03) 0 1px, transparent 1px 9px)',
      }}
    >
      <span className="font-mono text-[11px] tracking-[0.24em] text-muted-3">
        {project.name.toUpperCase()}
      </span>
    </div>
  );
}

export function FeaturedWork() {
  return (
    <section id="work" className="relative z-10 px-[clamp(20px,4vw,48px)] py-[clamp(64px,10vw,120px)]">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <div className="mb-11 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-3.5 font-mono text-[11px] font-bold tracking-[0.24em] text-muted-2">
                [ 03 / SELECTED WORK ]
              </div>
              <h2 className="m-0 text-[clamp(28px,3.2vw,38px)] font-extrabold text-foreground">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="font-mono text-[13px] tracking-[0.04em] text-muted transition-colors hover:text-accent"
            >
              VIEW FULL ARCHIVE →
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-[12px] border border-hairline bg-hairline [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
          {FEATURED_PROJECTS.map((project, i) => (
            <Reveal key={project.name} className="h-full" delay={i * 80}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full bg-background transition-colors hover:bg-[#101013]"
              >
                <Thumb project={project} />
                <div className="p-[22px]">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.08em] text-muted">
                      {project.badge}
                    </span>
                    <span className="font-mono text-[11px] text-muted-2">{project.year}</span>
                  </div>
                  <h3 className="m-0 mb-2 text-[19px] font-bold text-foreground">{project.name}</h3>
                  <p className="m-0 mb-3.5 text-[13.5px] leading-[1.6] text-muted">{project.body}</p>
                  <div className="text-[11.5px] text-muted-2">{project.stack}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
