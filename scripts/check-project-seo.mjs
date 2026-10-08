/** Read-only checks against rendered HTTP responses, locally or after deployment. */
import assert from 'node:assert/strict';

const base = new URL(process.argv[2] ?? 'http://localhost:3000');
const canonicalOrigin = 'https://vicoworks.com';
const decode = (value) => value?.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
const attr = (tag, name) => decode(tag?.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]);
const meta = (html, name) => attr(
  [...html.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0])
    .find((tag) => attr(tag, 'name') === name || attr(tag, 'property') === name),
  'content',
);

async function read(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200, `${path}: expected HTTP 200`);
  assert.doesNotMatch(response.headers.get('x-robots-tag') ?? '', /noindex/i, `${path}: HTTP noindex`);
  return response.text();
}

const sitemap = await read('/sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
assert.equal(new Set(urls).size, urls.length, 'Sitemap contains duplicate URLs');
assert(urls.every((url) => new URL(url).origin === canonicalOrigin), 'Sitemap origin mismatch');
const projects = urls.filter((url) => new URL(url).pathname.startsWith('/projects/'));
assert(projects.includes(`${canonicalOrigin}/projects/nusaverify`), 'NusaVerify missing from sitemap');
const index = await read('/projects');
const titles = new Set();
const descriptions = new Set();

for (const url of projects) {
  const path = new URL(url).pathname;
  const html = await read(path);
  assert(index.includes(`href="${path}"`), `${path}: no crawlable link on /projects`);
  const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1]);
  assert(title, `${path}: missing title`);
  assert.equal((title.match(/Vico Aritonang/g) ?? []).length, 1, `${path}: duplicated/missing author in title`);
  assert(!titles.has(title), `${path}: duplicate title`);
  titles.add(title);
  const description = meta(html, 'description');
  assert(description?.includes('Vico Aritonang'), `${path}: description missing author`);
  assert(!descriptions.has(description), `${path}: duplicate description`);
  descriptions.add(description);
  for (const channel of ['og', 'twitter']) {
    assert.equal(meta(html, `${channel}:title`), title, `${path}: ${channel} title differs`);
    assert.equal(meta(html, `${channel}:description`), description, `${path}: ${channel} description differs`);
  }
  const canonical = [...html.matchAll(/<link\s[^>]*>/g)].map((m) => m[0])
    .filter((tag) => attr(tag, 'rel') === 'canonical');
  assert.equal(canonical.length, 1, `${path}: expected one canonical`);
  assert.equal(attr(canonical[0], 'href'), url, `${path}: incorrect canonical`);
  assert.equal(meta(html, 'og:url'), url, `${path}: incorrect Open Graph URL`);
  assert.doesNotMatch(meta(html, 'robots') ?? '', /noindex/i, `${path}: meta noindex`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: expected one visible heading`);
  const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((m) => { const data = JSON.parse(m[1]); return data['@graph'] ?? (Array.isArray(data) ? data : [data]); });
  const page = nodes.find((node) => node['@id'] === `${url}#page`);
  const work = nodes.find((node) => node['@id'] === `${url}#work`);
  assert.equal(page?.mainEntity?.['@id'], work?.['@id'], `${path}: broken page/project relationship`);
  assert(work, `${path}: missing project entity`);
  assert.equal(work.author?.['@id'], `${canonicalOrigin}/#vico`, `${path}: broken author relationship`);
  assert.equal(work.mainEntityOfPage?.['@id'], page?.['@id'], `${path}: missing page reference`);
  assert(nodes.some((node) => node['@id'] === `${url}#breadcrumb`), `${path}: missing breadcrumbs`);
  const socialImage = new URL(meta(html, 'og:image'));
  assert.equal(socialImage.origin, canonicalOrigin, `${path}: social image origin mismatch`);
  await read(`${socialImage.pathname}${socialImage.search}`);
  console.log(`PASS ${path}: ${title}`);
}

const missing = await fetch(new URL('/projects/seo-check-nonexistent-project', base));
assert.equal(missing.status, 404, 'Unknown project should return HTTP 404');
console.log(`PASS: ${projects.length} project pages, sitemap, internal links, metadata, JSON-LD, images and 404.`);
