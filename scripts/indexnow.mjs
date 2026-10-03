/**
 * Pings IndexNow (Bing, Yandex, Naver, Seznam…) with every URL in the live
 * sitemap. Bing's index feeds ChatGPT search and Copilot, so this is how a new
 * page or post reaches AI answers within hours instead of weeks.
 *
 * Run after each production deploy:  npm run indexnow
 * The key file lives at public/a7bde5ce7766f61f141adaa0e0b6544e.txt and must stay deployed.
 */
const HOST = 'vicoworks.com';
const KEY = 'a7bde5ce7766f61f141adaa0e0b6544e';

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap.xml returned ${r.status} – is the site deployed?`);
  return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status}`);
if (res.status >= 400) console.log(await res.text());
