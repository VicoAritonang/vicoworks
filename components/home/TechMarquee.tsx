import { MARQUEE_ITEMS } from '@/content/home';

function Row() {
  return (
    <div className="flex shrink-0">
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="whitespace-nowrap px-[26px] font-mono text-[13px] text-[#5c6069]">
            {item}
          </span>
          <span className="text-[#33363c]">/</span>
        </span>
      ))}
    </div>
  );
}

export function TechMarquee() {
  return (
    <section className="marquee-mask relative z-10 overflow-hidden border-b border-hairline-soft py-4">
      <div className="marquee-track" aria-hidden="true">
        <Row />
        <Row />
      </div>
    </section>
  );
}
