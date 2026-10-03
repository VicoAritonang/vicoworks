import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/site/PageShell';
import { Prose } from '@/components/site/Prose';
import { PROFILE } from '@/content/home';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms for using vicoworks.com, its content and its guestbook.',
  alternates: { canonical: '/legal/terms' },
};

export default function TermsPage() {
  return (
    <PageShell eyebrow="Legal" title="Terms of" accent="use">
      <Prose updated="3 October 2026">
        <p>
          These terms cover your use of vicoworks.com, the personal portfolio of Vico Aritonang. By using the site you agree to
          them. They are short on purpose.
        </p>

        <h2>Content</h2>
        <p>
          The writing, photos, project descriptions and design of this site are mine unless stated otherwise. You are welcome to
          link to any page and to quote short excerpts with credit. Please don&rsquo;t republish whole pages or use my photos without
          asking. Third-party names, logos and libraries belong to their owners – see the{' '}
          <Link href="/attribution">attribution page</Link>.
        </p>

        <h2>Projects and links</h2>
        <p>
          Projects shown here link to separate products and websites. Those have their own terms and privacy policies, and I am not
          responsible for external sites I link to.
        </p>

        <h2>Guestbook</h2>
        <ul>
          <li>Entries are public. Don&rsquo;t post anything you wouldn&rsquo;t want others to read.</li>
          <li>No spam, advertising, links, harassment, hate speech or other people&rsquo;s personal information.</li>
          <li>I may hide or remove any entry at any time, without notice.</li>
        </ul>

        <h2>No warranty</h2>
        <p>
          The site is provided as is. I try to keep everything accurate and online, but I can&rsquo;t guarantee it, and I am not
          liable for losses arising from its use.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>. Also see the{' '}
          <Link href="/legal/privacy">privacy policy</Link>.
        </p>
      </Prose>
    </PageShell>
  );
}
