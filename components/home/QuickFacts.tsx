import { QUICK_FACTS } from '@/content/home';

export function QuickFacts() {
  return (
    <section className="relative z-10 border-y border-hairline-soft">
      <div className="mx-auto grid max-w-[1280px] gap-5 px-[clamp(20px,4vw,48px)] py-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))]">
        {QUICK_FACTS.map((fact) => (
          <div key={fact.label}>
            <div className="mb-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-2">
              {fact.label}
            </div>
            <div className="text-sm text-[#c7cbd1]">{fact.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
