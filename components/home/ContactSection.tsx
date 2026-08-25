'use client';

import { useEffect, useRef, useState } from 'react';
import { CONTACT, PROFILE } from '@/content/home';
import { Magnet } from './Magnet';
import { Reveal } from './Reveal';

const linkClass =
  'flex items-center gap-2.5 rounded-[10px] border border-white/[0.18] px-[22px] py-3.5 font-mono text-[13px] text-[#c7cbd1] transition-colors hover:border-accent hover:text-accent';

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copyEmail = () => {
    navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="relative z-10 overflow-hidden border-t border-hairline-soft px-[clamp(20px,4vw,48px)] py-[clamp(72px,12vw,140px)] text-center"
    >
      <Reveal>
        <div className="mx-auto max-w-[820px]">
          <div className="mb-5 font-mono text-[11px] tracking-[0.24em] text-muted-2">
            {CONTACT.eyebrow}
          </div>
          <h2 className="m-0 mb-5 text-[clamp(36px,5.6vw,66px)] font-extrabold leading-[1.08]">
            <span className="block text-foreground">{CONTACT.headlineTop}</span>
            <span className="block text-accent">{CONTACT.headlineBottom}</span>
          </h2>
          <p className="mx-auto mb-11 max-w-[520px] text-base text-muted">{CONTACT.body}</p>

          <div className="mb-16 flex flex-wrap justify-center gap-3.5">
            <Magnet>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                GitHub ↗
              </a>
            </Magnet>
            <Magnet>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                LinkedIn ↗
              </a>
            </Magnet>
            <Magnet>
              <button type="button" onClick={copyEmail} className={`${linkClass} cursor-pointer bg-transparent`}>
                {copied ? 'Copied to clipboard ✓' : PROFILE.email}
              </button>
            </Magnet>
          </div>

          <div className="flex flex-wrap justify-between gap-3 border-t border-hairline-soft pt-7 font-mono text-xs text-muted-3">
            <span>{CONTACT.footerLeft}</span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-[5px] w-[5px] bg-success" />
              {CONTACT.footerRight}
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
