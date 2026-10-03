import Link from 'next/link';
import { CONTACT, FOOTER_COLUMNS, PROFILE } from '@/content/home';

function FooterLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith('http') || href.startsWith('mailto:');
  const file = /\.\w+$/.test(href);
  /* A white bar with mix-blend-difference rises from the baseline on hover,
     inverting the label inside it. */
  const className =
    "group relative inline-flex items-center gap-1 px-2 before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-0 before:w-full before:bg-white before:mix-blend-difference before:transition-[height] before:duration-300 before:content-[''] hover:before:h-full";
  const arrow = (
    <svg viewBox="0 0 24 24" className="size-3 opacity-0 transition-opacity group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
  if (external || file) {
    return (
      <a href={href} className={className} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {label}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
      {arrow}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-7xl max-sm:px-1">
      <div className="relative border">
        <div className="flex flex-col lg:flex-row">
          <div className="hidden w-full flex-col justify-between px-4 py-6 text-sm max-lg:border-b lg:flex lg:w-[44%] lg:border-e lg:px-16 lg:pr-8">
            <div className="grow space-y-4">
              <Link href="/" aria-label="Homepage" className="inline-block font-serif text-3xl italic">
                vico<span className="text-colorful">.</span>
              </Link>
              <p className="w-60 text-base leading-5 text-neutral-500 dark:text-neutral-400">{CONTACT.footerBlurb}</p>
            </div>
          </div>
          <div className="flex w-full flex-col items-start px-4 py-6 text-xs lg:w-[56%] lg:px-16">
            <div className="flex w-full flex-wrap justify-between gap-8 md:gap-18">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title} className="flex flex-col gap-2 sm:gap-4">
                  <h4 className="px-2 font-mono text-xs text-neutral-700 uppercase dark:text-neutral-400">{col.title}</h4>
                  <ul className="flex flex-col items-start gap-y-2 text-base sm:gap-y-3 dark:text-neutral-50">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <FooterLink {...l} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 border-t p-4 md:flex-row md:gap-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()}{' '}
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-700 transition-colors hover:text-black hover:underline hover:underline-offset-4 dark:text-neutral-300 dark:hover:text-white"
            >
              Vico Aritonang
            </a>
            . All rights reserved
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            {[
              { label: 'Privacy Policy', href: '/legal/privacy' },
              { label: 'Terms of Use', href: '/legal/terms' },
              { label: 'Sitemap', href: '/sitemap.xml' },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-neutral-600 transition-colors hover:text-black hover:underline hover:underline-offset-4 dark:text-neutral-300 dark:hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hatch-wide h-7 w-full border-t" aria-hidden="true" />
      </div>
    </footer>
  );
}
