import { FEATURED_PROJECTS } from '@/content/home';
import { getPosts } from '@/lib/blog';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS 2.0: blog posts, newest first, followed by the featured projects. */
export function GET() {
  const posts = getPosts().map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`
  );

  const projects = FEATURED_PROJECTS.map(
    (p) => `    <item>
      <title>${esc(`Project: ${p.name}`)}</title>
      <link>${esc(p.href)}</link>
      <guid isPermaLink="false">${SITE_URL}/projects#${p.slug}</guid>
      <description>${esc(p.body)}</description>
      <category>project</category>
    </item>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml" />
${[...posts, ...projects].join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
