import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/site/PageShell';
import { Prose } from '@/components/site/Prose';
import { PROFILE } from '@/content/home';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What vicoworks.com collects (very little), why, and how to get it removed.',
  alternates: { canonical: '/legal/privacy' },
};

export default function PrivacyPage() {
  return (
    <PageShell eyebrow="Legal" title="Privacy" accent="policy">
      <Prose updated="3 October 2026">
        <p>
          vicoworks.com is the personal portfolio of Vico Aritonang (&ldquo;I&rdquo;, &ldquo;me&rdquo;). This page explains, in
          plain language, what the site collects. The short version: no accounts, no advertising, no analytics trackers, no
          tracking cookies.
        </p>

        <h2>What the site stores</h2>
        <ul>
          <li>
            <strong>Visit and like counters.</strong> Opening a page adds one to an anonymous visitor total, and the like button on the{' '}
            <Link href="/projects">projects page</Link> adds one to that project&rsquo;s count. Only the numbers are stored – nothing
            that identifies you.
          </li>
          <li>
            <strong>Guestbook entries.</strong> If you sign the <Link href="/guestbook">guestbook</Link>, the name and message you
            type are stored and shown publicly. To limit spam, a one-way hash of your IP address is stored alongside the entry; it is
            never displayed and cannot be turned back into your IP.
          </li>
          <li>
            <strong>Your theme choice.</strong> If you switch between light and dark mode, that preference is saved in your
            browser&rsquo;s local storage. It never leaves your device.
          </li>
        </ul>

        <h2>Service providers</h2>
        <ul>
          <li>
            <strong>Vercel</strong> hosts the site. Like any web host, it processes standard request data such as IP address and
            browser type to serve pages and keep the service secure.
          </li>
          <li>
            <strong>Supabase</strong> stores the counters, project data and guestbook entries described above.
          </li>
          <li>
            <strong>YouTube.</strong> Some entries on the projects page embed demo videos from YouTube. When a video loads, YouTube
            may set its own cookies under Google&rsquo;s privacy policy.
          </li>
        </ul>
        <p>Fonts are served from this site itself, so viewing a page does not contact Google Fonts.</p>

        <h2>Email</h2>
        <p>
          If you email me, I use your address and message only to reply. I do not add you to any list or share your details.
        </p>

        <h2>Removal and questions</h2>
        <p>
          Want a guestbook entry removed, or have a question about this policy? Email{' '}
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> and I will take care of it.
        </p>

        <h2>Changes</h2>
        <p>If the site starts collecting anything new, this page will be updated first and the date above will change.</p>
      </Prose>
    </PageShell>
  );
}
