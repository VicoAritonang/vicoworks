import { EXPERTISE, PROFILE } from '@/content/home';
import { Reveal } from './Reveal';

export function Expertise() {
  return (
    <section
      id="expertise"
      className="relative z-10 px-[clamp(20px,4vw,48px)] py-[clamp(64px,10vw,120px)]"
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap gap-14">
        <Reveal className="flex-[1_1_320px] lg:max-w-[400px]">
          <div>
            <div className="mb-3.5 font-mono text-[11px] font-bold tracking-[0.24em] text-muted-2">
              [ 01 / EXPERTISE ]
            </div>
            <h2 className="m-0 mb-4 text-[clamp(28px,3.2vw,38px)] font-extrabold text-foreground">
              Core Expertise
            </h2>
            <p className="m-0 mb-6 text-[15px] leading-[1.75] text-muted">
              Focused on building scalable agentic AI systems, automation architecture, and
              cloud-native backend infrastructure.
            </p>
          </div>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 rounded-[10px] border border-hairline p-4 transition-colors hover:border-white/40"
          >
            <span className="font-mono text-[15px] font-bold text-foreground">&lt;/&gt;</span>
            <span>
              <span className="block font-mono text-[11px] text-muted">Source Code</span>
              <span className="block font-bold text-foreground">View on GitHub</span>
            </span>
            <span className="ml-auto text-muted-2">↗</span>
          </a>
        </Reveal>

        <Reveal className="flex-[2_1_480px]" delay={80}>
          {/* One shared 1px background shows through the grid gap, so the panel reads
              as a single spec sheet instead of a stack of cards. */}
          <div className="grid gap-px overflow-hidden rounded-[12px] border border-hairline bg-hairline [grid-template-columns:repeat(auto-fit,minmax(min(230px,100%),1fr))]">
            {EXPERTISE.map((cell) => (
              <div key={cell.title} className="bg-background p-[22px]">
                <div className="mb-2.5 font-mono text-[11px] tracking-[0.1em] text-accent">
                  {cell.title}
                </div>
                <div className="text-[13.5px] leading-[1.7] text-[#a7abb2]">{cell.body}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
