import { AWARDS, EXPERIENCE } from '@/content/home';
import { Reveal } from './Reveal';

export function Experience() {
  return (
    <section
      id="experience"
      className="relative z-10 border-y border-hairline-soft px-[clamp(20px,4vw,48px)] py-[clamp(64px,10vw,120px)]"
    >
      <div className="mx-auto max-w-[900px]">
        <Reveal>
          <div className="mb-3.5 font-mono text-[11px] font-bold tracking-[0.24em] text-muted-2">
            [ 02 / EXPERIENCE ]
          </div>
          <h2 className="m-0 mb-12 text-[clamp(28px,3.2vw,38px)] font-extrabold text-foreground">
            Where I&apos;ve Been
          </h2>
        </Reveal>

        <div className="relative pl-7">
          <span className="absolute bottom-1.5 left-[3px] top-1.5 w-px bg-white/[0.18]" />

          {EXPERIENCE.map((item, i) => (
            <Reveal key={item.role + item.period}>
              <div className={`relative ${i === EXPERIENCE.length - 1 ? '' : 'pb-10'}`}>
                <span
                  className={`absolute -left-7 top-[5px] h-[7px] w-[7px] ${
                    item.current ? 'bg-accent' : 'border border-white/40'
                  }`}
                />
                <div
                  className={`mb-1.5 font-mono text-xs ${
                    item.current ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {item.period}
                </div>
                <div className="text-[18px] font-bold text-foreground">
                  {item.role} <span className="font-medium text-muted">— {item.org}</span>
                </div>
                <div className="mb-2.5 text-[13px] text-muted-2">{item.meta}</div>
                <p className="m-0 max-w-[600px] text-[14.5px] leading-[1.75] text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-2 border-t border-hairline-soft pt-7">
            <div className="mb-4 font-mono text-[11px] tracking-[0.1em] text-muted-2">
              AWARDS &amp; COMPETITIONS
            </div>
            <div className="grid border-b border-white/[0.08]">
              {AWARDS.map((award) => (
                <div
                  key={award.title}
                  className="flex flex-wrap justify-between gap-4 border-t border-white/[0.08] py-3"
                >
                  <span className="text-sm text-[#c7cbd1]">{award.title}</span>
                  <span className="whitespace-nowrap font-mono text-xs text-muted-2">
                    {award.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
