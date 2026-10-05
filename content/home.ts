/**
 * All Home page copy. Edit here – the components are presentation only.
 */

export const PROFILE = {
  greeting: "Hello, I'm",
  firstName: 'Vico',
  lastName: 'Aritonang',
  fullName: 'VICO WINNER SEBASTIAN ARITONANG',
  email: 'vicoaritonang5@gmail.com',
  github: 'https://github.com/VicoAritonang',
  linkedin: 'https://www.linkedin.com/in/vico-winner-sebastian-aritonang-93a609249/',
  resume: '/Vico_Aritonang_CV.pdf',
  /* Micro-line under the h1. Carries the role and the country, because
     "AI engineer" on its own is a query nobody local wins. */
  tagline: 'AI ENGINEER · JAKARTA, INDONESIA',
  summary:
    "I'm an Indonesian AI engineer based in Jakarta, building production-grade agentic AI and automation systems – LLM agent orchestration, RAG pipelines, high-concurrency Go microservices, and cloud-native infrastructure on GCP and AWS. Comfortable end-to-end, from Next.js front ends to Python/Go backends and applied machine learning.",
  pipeline: ['AGENTIC AI', 'CLOUD AUTOMATION', 'GO MICROSERVICES', 'RAG SYSTEMS'],
} as const;

export const EXPERTISE = [
  {
    title: 'AI & AUTOMATION',
    body: 'Agentic AI / LLM apps, n8n orchestration, RAG, vector databases, prompt engineering',
  },
  {
    title: 'BACKEND',
    body: 'Go (high-concurrency), REST API architecture, system integration, distributed systems',
  },
  {
    title: 'CLOUD & DEVOPS',
    body: 'GCP, AWS Lambda / Step Functions, Docker, CI/CD, Vercel',
  },
  {
    title: 'FRONTEND',
    body: 'Next.js, React, TypeScript, Tailwind CSS',
  },
  {
    title: 'DATA',
    body: 'Data analysis, machine learning, PostgreSQL, Supabase',
  },
  {
    title: 'LANGUAGES',
    body: 'Go, Python, TypeScript/JS, Java, Dart, C',
  },
] as const;

export const EXPERIENCE = [
  {
    period: 'FEB 2025 – PRESENT',
    current: true,
    role: 'Co-Founder',
    org: 'Avagenc',
    meta: 'AI Automation Startup · Jakarta, Indonesia',
    body: 'Co-founded an AI automation startup building agentic systems that automate complex business workflows. Lead end-to-end product engineering across web and Android clients plus the AI agent orchestration layer; own deployment and DevOps with containerized, cloud-native infrastructure.',
  },
  {
    period: 'DEC 2025 – APR 2026',
    current: false,
    role: 'IT Support',
    org: 'Bimbel Wangsit Om Jer',
    meta: 'Part-time · On-site',
    body: 'Provided monthly on-site IT support for bootcamps and tryout exams, resolving exam-platform and site issues to keep sessions running without interruption.',
  },
  {
    period: 'APR 2025 – MAY 2025',
    current: false,
    role: 'LLM Evaluation Assistant',
    org: 'Freelance',
    meta: 'Remote',
    body: 'Evaluated a mathematical LLM across 200 questions, assessing correctness, reasoning validity, and hallucinations; delivered structured reports for fine-tuning decisions.',
  },
  {
    period: 'AUG 2023 – JUL 2027 (EXPECTED)',
    current: false,
    role: 'B.Sc. Information Systems',
    org: 'University of Indonesia',
    meta: 'Depok, Indonesia',
    body: '7th semester. Previously enrolled in Mechanical Engineering (2022–2023) before transferring.',
  },
] as const;

export const AWARDS = [
  {
    title:
      'Top 50 Finalist – 1000x Innovation Challenge (Marvin Foundation × UI × DSX Ventures)',
    date: 'Feb 2025',
  },
  {
    title:
      'GEMASTIK XVIII – ICT Business Development Division (National Student ICT Competition)',
    date: 'Sep 2025',
  },
  {
    title: 'Falcon × Qatar Airways AI Infographic Competition – UPH',
    date: 'Nov 2024',
  },
] as const;

export type ProjectMock = 'chat' | 'form' | 'mindmap' | 'export';

export interface FeaturedProject {
  slug: string;
  name: string;
  href: string;
  /** Small mono label after the index number, e.g. "AI Product". */
  kind: string;
  /** Date badge, top-right of the project header. */
  year: string;
  /** One-liner printed on top of the gradient card. */
  headline: string;
  body: string;
  stack: string;
  /** Tech chips under the card. Names must match a key in TechIcon. */
  tech: string[];
  /** Card background. */
  gradient: string;
  /** Accent for the sticky detail panel (line, stars, glow). */
  color: 'purple' | 'emerald' | 'blue' | 'orange' | 'amber';
  /** Highlights listed in the sticky detail panel on desktop. */
  bullets: string[];
  /** Rendered UI sketch, used when there is no `image`. */
  mock?: ProjectMock;
  /** Real screenshot from /public, e.g. '/project-snapshoot/acep/homepage.png'. Wins over `mock`. */
  image?: string;
  /** Has a case study at /projects/<slug> (content/caseStudies.ts). Cards link there instead of off-site. */
  caseStudy?: boolean;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: 'avagenc',
    caseStudy: true,
    name: 'Avagenc',
    href: 'https://avagenc.com',
    kind: 'AI Startup',
    year: 'Building',
    headline: 'One chat that runs your Gmail, calendar, contacts, smart home and music',
    body: 'Multi-agent AI assistant I co-founded. A single chat interface orchestrates agents that act across Gmail, Google Calendar, Google Contacts, Tuya smart-home devices and Spotify.',
    stack: 'Go · Next.js · Android · Multi-agent LLM',
    tech: ['Go', 'Next.js', 'TypeScript', 'Android', 'Docker', 'Google Cloud', 'Gemini'],
    gradient: 'linear-gradient(145deg, #2e1065 0%, #6d28d9 40%, #a78bfa 75%, #ede9fe 100%)',
    color: 'purple',
    bullets: [
      'One chat interface orchestrating specialised agents',
      'Acts across Gmail, Calendar, Contacts, Tuya & Spotify',
      'Go backend with Next.js and Android clients',
    ],
    mock: 'chat',
  },
  {
    slug: 'datafact',
    caseStudy: true,
    name: 'Datafact',
    href: 'https://www.datafact.site',
    kind: 'Live Product',
    year: '2025 – 26',
    headline: 'Paste a Google Form, pick a persona, get realistic respondents at scale',
    body: 'AI survey-response engine generating persona-targeted answers at scale, on a fully serverless AWS backend.',
    stack: 'AWS Lambda · Step Functions · GenAI',
    tech: ['AWS', 'Lambda', 'Step Functions', 'Python', 'Supabase', 'Next.js', 'Gemini'],
    gradient: 'linear-gradient(145deg, #022c22 0%, #047857 40%, #34d399 75%, #d1fae5 100%)',
    color: 'emerald',
    bullets: [
      'Paste a Google Form URL, pick a persona, generate respondents',
      'Fully serverless: Lambda, Step Functions, API Gateway',
      'Concurrent GenAI generation injected straight into the form',
    ],
    mock: 'form',
  },
  {
    slug: 'nusaverify',
    caseStudy: true,
    name: 'NusaVerify',
    href: 'https://nusaverify-web.vercel.app/',
    kind: 'Hackathon · Bank Indonesia',
    year: '2026',
    headline: 'Check first, then believe – six AI agents fact-check investment rumours',
    body: 'Multi-agent verifier for investment information. Paste a stock rumour, an Instagram link or a Telegram screenshot; six agents check BEI, OJK and the financial press in parallel and return a verdict with a live knowledge graph of every source.',
    stack: 'Go · n8n · Meta Graph API · Next.js · Supabase',
    tech: ['Go', 'n8n', 'Meta', 'GraphQL', 'Next.js', 'TypeScript', 'Supabase', 'Vercel'],
    gradient: 'linear-gradient(145deg, #0b1230 0%, #1e2a78 40%, #8a7650 78%, #e9c891 100%)',
    color: 'blue',
    bullets: [
      'Six agents in parallel: BEI/OJK, CNBC, Kontan, Bisnis, retail sentiment, analyst',
      'Go agent backend, n8n workflows, Meta Graph API for Instagram posts',
      'Live reasoning trace: knowledge graph, agent debate, signed confidence verdict',
    ],
    mock: 'mindmap',
    image: '/project-snapshoot/nusaverify/homepage.png',
  },
  {
    slug: 'acep',
    caseStudy: true,
    name: 'ACEP',
    href: 'https://acep-prototype.vercel.app/',
    kind: 'Top 6 Finalist · IPB',
    year: '2026',
    headline: 'Solar power planning for off-grid industries, one forecast day at a time',
    body: 'Advanced Clean Energy Planning: a platform that combines a site’s loads, solar generators and batteries with a 14-day weather forecast to show which days the power supply is safe – and which ones are not. Top 6 finalist at the IPB Business Plan Competition 2026.',
    stack: 'Next.js · Supabase · Open-Meteo · n8n',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'n8n', 'WebGL', 'Vercel'],
    gradient: 'linear-gradient(145deg, #052e24 0%, #047857 38%, #f59e0b 78%, #fde68a 100%)',
    color: 'amber',
    bullets: [
      'Energy calendar: safe, warning or insufficient, 14 days ahead',
      'Battery charge carried day to day against live Open-Meteo forecasts',
      'Top 6 finalist, Ideanation – IPB Business Plan Competition 2026',
      'Built as CTO of a two-person company: architecture, data and web app',
    ],
    image: '/project-snapshoot/acep/homepage.png',
  },
  {
    slug: 'handlerindonesia',
    name: 'HandlerIndonesia',
    href: 'https://handlerindonesia.vercel.app',
    kind: 'Top 50 Finalist',
    year: '2025',
    headline: 'Helping Indonesian MSMEs take their products to global markets',
    body: 'Export-facilitation platform helping Indonesian MSMEs expand into global markets.',
    stack: 'React · Next.js · Vercel',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
    gradient: 'linear-gradient(145deg, #7c2d12 0%, #ea580c 40%, #fb923c 75%, #ffedd5 100%)',
    color: 'orange',
    bullets: [
      'Export-readiness flow for Indonesian MSMEs',
      'Top 50 finalist, 1000x Innovation Challenge',
      'Next.js on Vercel',
    ],
    mock: 'export',
  },
];

/* ---------- Hero ---------- */

export const HERO = {
  /* Line one plain, line two the colourful italic word. */
  headlineTop: 'AI',
  headlineAccent: 'engineer',
  meta: 'Jakarta, Indonesia · building agentic systems',
  tagline: ['Agents that ship.', 'Infra that scales.'],
  launch: {
    label: 'Live now',
    name: 'Datafact',
    caption: 'Respondents on demand',
    href: 'https://www.datafact.site',
  },
} as const;

/**
 * Photos of Vico, from /public/foto_vico. The hero gallery fans out four
 * cards, so the list is cycled if it is shorter than that.
 */
export const HERO_PHOTOS: { src: string; alt: string }[] = [
  { src: '/foto_vico/vico1.jpeg', alt: 'Vico Aritonang, AI engineer in Jakarta, Indonesia' },
  { src: '/foto_vico/vico2.jpeg', alt: 'Vico Aritonang at Universitas Indonesia' },
  { src: '/foto_vico/vico3.jpeg', alt: 'Vico Aritonang, AI engineer in Jakarta' },
];

/** Used in the "Let's Build Together" bento and other avatar spots. */
export const PROFILE_PHOTO = '/foto_vico/vico1.jpeg';

export const STATUS = [
  { tag: 'Now', color: 'bg-emerald-500', title: 'Co-Founder', sub: 'Avagenc · Jakarta', href: '#work' },
  { tag: 'Building', color: 'bg-orange-500', title: 'Agentic AI', sub: 'Agents, RAG, automation', href: '#work' },
  { tag: 'Studying', color: 'bg-sky-500', title: 'Information Systems', sub: 'University of Indonesia', href: '/projects' },
] as const;

/* ---------- Bento ---------- */

/** "Uses" bento – mirrors the reference site's list for now; swap in your own. */
export const TOOLS = [
  { title: 'Zed', link: 'https://zed.dev/' },
  { title: 'Claude Code', link: 'https://claude.ai/code' },
  { title: 'Ghostty', link: 'https://ghostty.org/' },
  { title: 'Arc', link: 'https://arc.net/' },
  { title: 'Linear', link: 'https://linear.app/' },
] as const;

/** Cards that drop into the box in the "What You Get" bento, one every 2.5s. */
export const BUCKET_ITEMS = [
  { title: 'Ships On Time', description: 'Scoped, estimated, delivered', icon: 'clock' },
  { title: 'Agents That Act', description: 'LLMs wired to real tools & APIs', icon: 'bolt' },
  { title: 'End To End', description: 'I own the problem, front to infra', icon: 'wrench' },
  { title: 'RAG Done Right', description: 'Grounded answers, cited sources', icon: 'search' },
  { title: 'Clear Updates', description: 'Async demos, no status meetings', icon: 'chat' },
  { title: 'Code You Keep', description: 'Clean handoff, zero lock-in', icon: 'code' },
  { title: 'Scales With You', description: 'Serverless & containers that grow', icon: 'shield' },
  { title: 'Cloud Native', description: 'GCP, AWS, Docker, CI/CD', icon: 'cloud' },
] as const;

/** Globe markers. Arcs fan out from Jakarta. */
export const GLOBE_MARKERS = [
  { id: 'jakarta', location: [-6.2088, 106.8456] as [number, number], label: 'Jakarta' },
  { id: 'singapore', location: [1.3521, 103.8198] as [number, number], label: 'Singapore' },
  { id: 'tokyo', location: [35.6762, 139.6503] as [number, number], label: 'Tokyo' },
  { id: 'sydney', location: [-33.8688, 151.2093] as [number, number], label: 'Sydney' },
  { id: 'london', location: [51.5074, -0.1278] as [number, number], label: 'London' },
  { id: 'dubai', location: [25.2048, 55.2708] as [number, number], label: 'Dubai' },
  { id: 'sf', location: [37.7595, -122.4367] as [number, number], label: 'San Francisco' },
];

/* ---------- Navigation ---------- */

export const NAV_ITEMS = [
  { id: '/', href: '/', label: 'Home' },
  { id: '/about', href: '/about', label: 'About' },
  { id: '/projects', href: '/projects', label: 'Work' },
  { id: '/blog', href: '/blog', label: 'Blog' },
] as const;

/** The "More" dropdown and footer columns. Every link here is a real page. */
export const MORE_NAV = {
  label: 'More',
  featured: [
    { href: '/guestbook', title: 'Guestbook', description: 'Let me know you were here', gradient: 'linear-gradient(145deg,#312e81,#4f46e5 45%,#a5b4fc)' },
    { href: '/bucket-list', title: 'Bucket List', description: 'Dreams with a deadline', gradient: 'linear-gradient(145deg,#7c2d12,#ea580c 45%,#fed7aa)' },
  ],
  links: [
    { href: '/links', title: 'Links', icon: 'link', description: 'All my links are here' },
    { href: '/uses', title: 'Uses', icon: 'book', description: 'A peek into my digital workspace' },
    { href: '/attribution', title: 'Attribution', icon: 'card', description: 'Journey to create this site' },
  ],
} as const;

export const FOOTER_COLUMNS = [
  {
    title: 'General',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Specifics',
    links: [
      { label: 'Guest Book', href: '/guestbook' },
      { label: 'Bucket List', href: '/bucket-list' },
      { label: 'Uses', href: '/uses' },
      { label: 'Attribution', href: '/attribution' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Book a call', href: '/#contact' },
      { label: 'Links', href: '/links' },
      { label: 'RSS', href: '/rss' },
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
] as const;

export const CONTACT = {
  badge: 'OPEN TO WORK · OPEN TO WORK · ',
  lineOne: ['FROM PROMPT TO', 'PRODUCTION'],
  lineTwo: ["LET'S", 'SHIP IT!'],
  cta: 'Get In Touch',
  availability: "I'm available for internships, freelance & full-time roles.",
  body: ['I build agentic AI systems, automation pipelines,', 'and the cloud infrastructure that keeps them running.'],
  footerBlurb: "I'm Vico Aritonang – an AI engineer in Jakarta, Indonesia, co-founder & problem solver. Thanks for checking out my site!",
} as const;
