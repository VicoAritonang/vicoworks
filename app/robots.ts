import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/*
 * AI crawlers are welcomed by name. For a personal brand the goal is the
 * opposite of most publishers': the more answer engines and models know who
 * "Vico Aritonang" is, the better. That covers the search/answer bots
 * (OAI-SearchBot and ChatGPT-User for ChatGPT search, PerplexityBot,
 * Claude-SearchBot) and the training bots (GPTBot, ClaudeBot,
 * Google-Extended, Applebot-Extended), so future model versions learn the name
 * too.
 *
 * `/_next/` is deliberately NOT disallowed: it holds the CSS and JS Googlebot
 * needs to render the page. Only private endpoints are excluded.
 */
const AI_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'DuckAssistBot',
  'meta-externalagent',
  'MistralAI-User',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/_next/data/'];
  return {
    rules: [{ userAgent: '*', allow: '/', disallow }, { userAgent: AI_BOTS, allow: '/', disallow }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
