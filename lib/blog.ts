import fs from 'node:fs';
import path from 'node:path';
import { enDash } from './text';

/**
 * File-based blog. Every `content/blog/<slug>.md` file is a post; files whose
 * name starts with `_` (like `_template.md`) are ignored.
 *
 * Front matter is a small YAML subset:
 *
 *   ---
 *   title: My post
 *   description: One sentence for cards and SEO.
 *   date: 2026-10-03
 *   tags: agents, go
 *   cover: linear-gradient(145deg,#1e2a78,#5a6aef)   (optional)
 *   draft: true                                        (optional, hides the post)
 *   ---
 */

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover: string;
  readingMinutes: number;
  body: string;
}

const DIR = path.join(process.cwd(), 'content', 'blog');

const COVERS = [
  'linear-gradient(145deg, #1e2a78 0%, #2932CB 40%, #5a6aef 75%, #a0b0ff 100%)',
  'linear-gradient(145deg, #034d3a 0%, #059669 40%, #34d399 75%, #6ee7b7 100%)',
  'linear-gradient(145deg, #4a1d8e 0%, #7E22CE 40%, #a855f7 75%, #d8b4fe 100%)',
  'linear-gradient(145deg, #7c2d12 0%, #EA580C 40%, #fb923c 75%, #fed7aa 100%)',
];

function parse(slug: string, raw: string): Post & { draft: boolean } {
  const meta: Record<string, string> = {};
  let body = raw;
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fm) {
    for (const line of fm[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    body = raw.slice(fm[0].length);
  }
  const words = body.split(/\s+/).filter(Boolean).length;
  const cover = meta.cover || COVERS[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % COVERS.length];
  return {
    slug,
    title: meta.title || slug,
    description: meta.description || '',
    date: meta.date || '1970-01-01',
    tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    cover,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    body,
    draft: meta.draft === 'true',
  };
}

/** Published posts, newest first. */
export function getPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => parse(f.replace(/\.md$/, ''), enDash(fs.readFileSync(path.join(DIR, f), 'utf8'))))
    .filter((p) => !p.draft)
    .map(({ draft, ...p }) => (void draft, p))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
