'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PROFILE, ROLES } from '@/content/home';
import { Magnet } from './Magnet';
import { ParticleBurst } from './ParticleBurst';

/** Typewriter that cycles the role list: type, hold, delete, next. */
function useRoleTypewriter() {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[index];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (deleting && text === '') {
      const t = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % ROLES.length);
      }, 80);
      return () => clearTimeout(t);
    }

    const next = current.slice(0, text.length + (deleting ? -1 : 1));
    const t = setTimeout(() => setText(next), deleting ? 35 : 80);
    return () => clearTimeout(t);
  }, [text, index, deleting]);

  return text;
}

export function Hero() {
  const roleText = useRoleTypewriter();

  return (
    <section
      id="home"
      className="relative z-10 px-[clamp(20px,4vw,48px)] pt-[104px] pb-[72px]"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-[clamp(40px,6vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(min(380px,100%),1fr))]">
        <div className="max-w-[640px]">
          <div className="mb-2.5 font-mono text-[clamp(14px,1.5vw,17px)] text-muted">
            {PROFILE.greeting}
          </div>

          <h1 className="m-0 mb-1.5 font-mono text-[clamp(42px,6.4vw,78px)] font-extrabold leading-[1.03] tracking-[-0.02em] text-foreground">
            {PROFILE.firstName} <span className="text-accent">{PROFILE.lastName}</span>
          </h1>
          <div className="mb-[26px] font-mono text-[11px] tracking-[0.1em] text-muted-3">
            {PROFILE.fullName}
          </div>

          <div className="mb-7 flex h-[26px] items-center gap-2.5 font-mono text-[clamp(14px,1.7vw,17px)] text-[#c7cbd1]">
            <span className="text-muted-2">&gt;_</span>
            <span>{roleText}</span>
            <span
              className="inline-block w-0.5 bg-accent"
              style={{ height: '1.05em', animation: 'blink-caret .9s steps(1) infinite' }}
            />
          </div>

          <p className="m-0 mb-7 max-w-[560px] border-t border-hairline-soft pt-5 text-[clamp(14px,1.3vw,16px)] leading-[1.75] text-[#a7abb2]">
            {PROFILE.summary}
          </p>

          <div className="mb-9 font-mono text-[13px] tracking-[0.02em] text-muted">
            {PROFILE.pipeline.map((item, i) => (
              <span key={item}>
                {i > 0 && <span className="px-2 text-[#3a3e45]">/</span>}
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3.5">
            <Magnet>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2.5 rounded-[10px] bg-accent px-7 py-[15px] font-bold tracking-[0.02em] text-accent-ink transition-colors hover:bg-accent-hover"
              >
                VIEW ALL PROJECTS <span className="text-base">→</span>
              </Link>
            </Magnet>
            <Magnet>
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 rounded-[10px] border border-white/20 px-7 py-[15px] font-bold tracking-[0.02em] text-foreground transition-colors hover:border-foreground"
              >
                GET IN TOUCH
              </a>
            </Magnet>
          </div>
        </div>

        <div className="flex justify-center">
          <ParticleBurst />
        </div>
      </div>
    </section>
  );
}
