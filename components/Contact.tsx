'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react';
import { profile } from '@/content/profile';

/* No "signal received 24/7 — response guaranteed". A promise nobody can keep
   is worth less than an address that works. */

const ELSEWHERE = [
  { label: 'GitHub', href: profile.links.github },
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'WhatsApp', href: profile.links.whatsapp },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the mailto link beside it still works */
    }
  };

  return (
    <section id="contact" className="section px-4 sm:px-6" aria-labelledby="contact-heading">
      <div className="container mx-auto">
        <p className="kicker">Contact</p>
        <h2 id="contact-heading" className="display-2 mt-3 max-w-[16ch] text-fg">
          Let&rsquo;s build something.
        </h2>
        <p className="lede mt-4">
          {profile.availability}. The fastest way to reach me is email.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
          >
            {profile.email}
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-3 text-sm text-muted transition-colors hover:border-line-2 hover:text-fg"
            aria-label="Copy email address"
          >
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <a
            href={profile.links.resume}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-3 text-sm text-muted transition-colors hover:border-line-2 hover:text-fg"
          >
            <Download size={15} aria-hidden="true" />
            CV
          </a>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
          {ELSEWHERE.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
              >
                {link.label}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
