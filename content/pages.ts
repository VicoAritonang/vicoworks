/**
 * Copy for the secondary pages (/about, /uses, /links, /bucket-list,
 * /attribution). Edit here – the pages are presentation only.
 */

import { FEATURED_PROJECTS, PROFILE } from './home';

/* ---------- /about ---------- */

export const ABOUT = {
  intro: [
    "I'm Vico – an AI engineer based in Jakarta, Indonesia. I build agentic AI systems: LLM agents that call real tools, RAG pipelines that cite their sources, and the Go services and cloud infrastructure that keep them running.",
    "I co-founded Avagenc, where a single chat interface orchestrates agents across Gmail, Calendar, Contacts, smart-home devices and Spotify. I also built Datafact, a fully serverless GenAI product on AWS, and NusaVerify, a hoax-detection engine built for a Bank Indonesia hackathon.",
    "I'm studying Information Systems at Universitas Indonesia, and I'm open to internships, freelance work and full-time roles.",
  ],
  principles: [
    { title: 'Ship the whole thing', body: 'Front end, backend, infra, deploy. I own the problem end to end instead of handing off halves.' },
    { title: 'Agents need real tools', body: 'An LLM is only as useful as the actions it can take. I spend most of my time on the plumbing around the model.' },
    { title: 'Boring infra, on purpose', body: 'Serverless, containers and CI/CD that run unattended – so the interesting parts get the attention.' },
  ],
  /**
   * Answer-first FAQ, written in the third person on purpose: these are the
   * exact questions people (and AI answer engines) ask about a name, and the
   * first sentence of each answer is meant to be quotable on its own.
   */
  faq: [
    {
      q: 'Who is Vico Aritonang?',
      a: 'Vico Aritonang (Vico Winner Sebastian Aritonang) is an AI engineer based in Jakarta, Indonesia. He builds agentic AI systems – LLM agents, RAG pipelines and automation – along with the Go services and cloud infrastructure behind them. He is the co-founder of Avagenc and studies Information Systems at Universitas Indonesia.',
    },
    {
      q: 'What has Vico Aritonang built?',
      a: 'His main projects are Avagenc, a multi-agent assistant that acts across Gmail, Google Calendar, Contacts, Spotify and smart-home devices; Datafact, a fully serverless GenAI product on AWS; and NusaVerify, an AI hoax-detection engine built for a Bank Indonesia hackathon. Each has a case study on this site.',
    },
    {
      q: 'What is Vico Aritonang’s tech stack?',
      a: 'Go and Python for backends and AI, TypeScript with Next.js and React for front ends, and Google Cloud, AWS (Lambda, Step Functions), Docker, Supabase and PostgreSQL for infrastructure. For models he works with Gemini and Claude, and n8n for workflow automation.',
    },
    {
      q: 'Where is Vico Aritonang based?',
      a: 'Jakarta, Indonesia. He works with teams remotely across time zones.',
    },
    {
      q: 'Is Vico Aritonang available for hire?',
      a: 'Yes. He is open to AI engineering internships, freelance projects and full-time roles. The fastest way to reach him is email at vicoaritonang5@gmail.com, or LinkedIn.',
    },
  ],
} as const;

/* ---------- /uses ---------- */

export interface UsesItem {
  title: string;
  link: string;
  /** Name understood by <TechIcon/>. Falls back to a lettered tile. */
  icon?: string;
  note?: string;
}

/**
 * TODO(vico): "Dev Tools" mirrors the reference site's list for now – swap in
 * the editor, terminal and apps you actually use. The other groups are your
 * real stack.
 */
export const USES: { label: string; items: UsesItem[] }[] = [
  {
    label: 'Dev Tools',
    items: [
      { title: 'Zed', link: 'https://zed.dev/', icon: 'Zed' },
      { title: 'Claude Code', link: 'https://claude.ai/code', icon: 'Claude Code' },
      { title: 'Ghostty', link: 'https://ghostty.org/', icon: 'Ghostty' },
      { title: 'Arc', link: 'https://arc.net/', icon: 'Arc' },
      { title: 'Linear', link: 'https://linear.app/', icon: 'Linear' },
      { title: 'Figma', link: 'https://www.figma.com/', icon: 'Figma' },
      { title: 'Docker', link: 'https://www.docker.com/', icon: 'Docker' },
    ],
  },
  {
    label: 'Languages & Frameworks',
    items: [
      { title: 'Go', link: 'https://go.dev/', icon: 'Go', note: 'High-concurrency services' },
      { title: 'Python', link: 'https://www.python.org/', icon: 'Python', note: 'ML, data, agents' },
      { title: 'TypeScript', link: 'https://www.typescriptlang.org/', icon: 'TypeScript' },
      { title: 'Next.js', link: 'https://nextjs.org/', icon: 'Next.js', note: 'This site' },
      { title: 'React', link: 'https://react.dev/', icon: 'React' },
      { title: 'Tailwind CSS', link: 'https://tailwindcss.com/', icon: 'Tailwind CSS' },
    ],
  },
  {
    label: 'Cloud & Data',
    items: [
      { title: 'Google Cloud', link: 'https://cloud.google.com/', icon: 'Google Cloud' },
      { title: 'AWS', link: 'https://aws.amazon.com/', icon: 'AWS', note: 'Lambda, Step Functions' },
      { title: 'Supabase', link: 'https://supabase.com/', icon: 'Supabase' },
      { title: 'PostgreSQL', link: 'https://www.postgresql.org/', icon: 'PostgreSQL' },
      { title: 'Vercel', link: 'https://vercel.com/', icon: 'Vercel' },
      { title: 'n8n', link: 'https://n8n.io/', icon: 'n8n', note: 'Workflow automation' },
    ],
  },
  {
    label: 'AI',
    items: [
      { title: 'Gemini', link: 'https://gemini.google.com/', icon: 'Gemini' },
      { title: 'Claude', link: 'https://claude.ai/', icon: 'Claude' },
    ],
  },
];

/* ---------- /links ---------- */

export const LINKS: { group: string; items: { title: string; href: string; description: string; icon?: string }[] }[] = [
  {
    group: 'Find me',
    items: [
      { title: 'GitHub', href: PROFILE.github, description: 'Code, experiments, open source', icon: 'GitHub' },
      { title: 'LinkedIn', href: PROFILE.linkedin, description: 'Experience, education, certificates' },
      { title: 'Email', href: `mailto:${PROFILE.email}`, description: PROFILE.email, icon: 'Gmail' },
      { title: 'Résumé', href: PROFILE.resume, description: 'One-page PDF' },
    ],
  },
  {
    group: 'Things I built',
    items: FEATURED_PROJECTS.map((p) => ({ title: p.name, href: p.href, description: p.body })),
  },
];

/* ---------- /bucket-list ---------- */

export type BucketStatus = 'done' | 'doing' | 'todo';

/** TODO(vico): these are drawn from your CV and current work – rewrite freely. */
export const BUCKET_LIST: { title: string; note: string; status: BucketStatus; when?: string }[] = [
  { title: 'Co-found a startup', note: 'Avagenc – agentic AI that runs your day-to-day tools.', status: 'done', when: 'Feb 2025' },
  { title: 'Put a live AI product on the internet', note: 'Datafact, fully serverless on AWS.', status: 'done', when: '2025' },
  { title: 'Compete at a national ICT competition', note: 'GEMASTIK XVIII, ICT Business Development.', status: 'done', when: 'Sep 2025' },
  { title: 'Launch Avagenc publicly', note: 'Web, Android, and the agent layer – in development.', status: 'doing' },
  { title: 'Land an AI engineering role', note: 'Internship or full-time.', status: 'doing' },
  { title: 'Graduate from Universitas Indonesia', note: 'B.Sc. Information Systems.', status: 'doing', when: '2027' },
  { title: 'Publish my first technical article', note: 'The blog on this site is ready and waiting.', status: 'todo' },
];

/* ---------- /attribution ---------- */

export const ATTRIBUTION: { group: string; items: { title: string; href: string; note: string }[] }[] = [
  {
    group: 'Design',
    items: [
      { title: 'aayushbharti.in', href: 'https://aayushbharti.in/', note: "Layout, motion and interaction design of this site are modelled on Aayush Bharti's portfolio." },
    ],
  },
  {
    group: 'Typefaces',
    items: [
      { title: 'Instrument Serif', href: 'https://fonts.google.com/specimen/Instrument+Serif', note: 'Headlines' },
      { title: 'Outfit', href: 'https://fonts.google.com/specimen/Outfit', note: 'Body text' },
      { title: 'DM Serif Display', href: 'https://fonts.google.com/specimen/DM+Serif+Display', note: 'Card titles' },
      { title: 'JetBrains Mono', href: 'https://fonts.google.com/specimen/JetBrains+Mono', note: 'Labels and code' },
    ],
  },
  {
    group: 'Built with',
    items: [
      { title: 'Next.js', href: 'https://nextjs.org/', note: 'Framework' },
      { title: 'Tailwind CSS', href: 'https://tailwindcss.com/', note: 'Styling' },
      { title: 'Motion', href: 'https://motion.dev/', note: 'Animation' },
      { title: 'cobe', href: 'https://github.com/shuding/cobe', note: 'The WebGL globe' },
      { title: 'Paper Shaders', href: 'https://shaders.paper.design/', note: 'Grain gradient behind the contact section' },
      { title: 'Simple Icons', href: 'https://simpleicons.org/', note: 'Brand icons' },
      { title: 'Supabase', href: 'https://supabase.com/', note: 'Projects, counters and the guestbook' },
      { title: 'Vercel', href: 'https://vercel.com/', note: 'Hosting' },
    ],
  },
];
