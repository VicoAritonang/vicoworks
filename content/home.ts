/**
 * All Home page copy, lifted from the Claude Design handoff (Home.dc.html).
 * Edit here — the components are presentation only.
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
  summary:
    'I build production-grade agentic AI and automation systems — designing LLM-powered agent orchestration, high-concurrency Go microservices, and cloud-native infrastructure on GCP. Comfortable end-to-end, from Next.js front ends to Python/Go backends and applied machine learning.',
  pipeline: ['AGENTIC AI', 'CLOUD AUTOMATION', 'GO MICROSERVICES', 'RAG SYSTEMS'],
} as const;

export const ROLES = [
  'AI Engineer',
  'Automation Architect',
  'Software Engineer',
  'Cloud & DevOps Engineer',
] as const;

export const QUICK_FACTS = [
  { label: 'LOCATION', value: 'Depok, Indonesia' },
  { label: 'CURRENTLY', value: 'Co-Founder @ Avagenc' },
  { label: 'FOCUS', value: 'AI Automation & Cloud/DevOps' },
  { label: 'STATUS', value: 'Open to internship / full-time' },
] as const;

export const MARQUEE_ITEMS = [
  'Go',
  'Python',
  'TypeScript',
  'Next.js',
  'GCP',
  'AWS Lambda',
  'Docker',
  'PostgreSQL',
  'n8n',
  'RAG',
  'LLM Orchestration',
] as const;

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
    period: 'FEB 2025 — PRESENT',
    current: true,
    role: 'Co-Founder',
    org: 'Avagenc',
    meta: 'AI Automation Startup · Depok, Indonesia',
    body: 'Co-founded an AI automation startup building agentic systems that automate complex business workflows. Lead end-to-end product engineering across web and Android clients plus the AI agent orchestration layer; own deployment and DevOps with containerized, cloud-native infrastructure.',
  },
  {
    period: 'DEC 2025 — APR 2026',
    current: false,
    role: 'IT Support',
    org: 'Bimbel Wangsit Om Jer',
    meta: 'Part-time · On-site',
    body: 'Provided monthly on-site IT support for bootcamps and tryout exams, resolving exam-platform and site issues to keep sessions running without interruption.',
  },
  {
    period: 'APR 2025 — MAY 2025',
    current: false,
    role: 'LLM Evaluation Assistant',
    org: 'Freelance',
    meta: 'Remote',
    body: 'Evaluated a mathematical LLM across 200 questions, assessing correctness, reasoning validity, and hallucinations; delivered structured reports for fine-tuning decisions.',
  },
  {
    period: 'AUG 2023 — JUL 2027 (EXPECTED)',
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
      'Top 50 Finalist — 1000x Innovation Challenge (Marvin Foundation × UI × DSX Ventures)',
    date: 'Feb 2025',
  },
  {
    title:
      'GEMASTIK XVIII — ICT Business Development Division (National Student ICT Competition)',
    date: 'Sep 2025',
  },
  {
    title: 'Falcon × Qatar Airways AI Infographic Competition — UPH',
    date: 'Nov 2024',
  },
] as const;

export interface FeaturedProject {
  name: string;
  href: string;
  badge: string;
  year: string;
  body: string;
  stack: string;
  /** Drop a screenshot in /public/projects/ and point here, e.g. '/projects/datafact.png'. */
  image?: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    name: 'Datafact',
    href: 'https://www.datafact.site',
    badge: '[ LIVE PRODUCT ]',
    year: '2025–26',
    body: 'AI survey-response engine generating persona-targeted answers at scale, on a fully serverless AWS backend.',
    stack: 'AWS Lambda · Step Functions · GenAI',
  },
  {
    name: 'NusaVerify',
    href: 'https://nusaverify-web.vercel.app/',
    badge: '[ HACKATHON ]',
    year: '2026',
    body: 'AI hoax-detection engine visualizing its full reasoning chain as an interactive mind-map. Built for Bank Indonesia.',
    stack: 'Next.js · LLM · Information Retrieval',
  },
  {
    name: 'HandlerIndonesia',
    href: 'https://handlerindonesia.vercel.app',
    badge: '[ TOP 50 FINALIST ]',
    year: '2025',
    body: 'Export-facilitation platform helping Indonesian MSMEs expand into global markets.',
    stack: 'React · Next.js · Vercel',
  },
];

export const CONTACT = {
  eyebrow: '[ 04 / GET IN TOUCH ]',
  headlineTop: "Let's build",
  headlineBottom: 'something together.',
  body: 'Currently open for internships, freelance projects, and full-time opportunities.',
  footerLeft: '© 2026 VICOWORKS.COM — All systems nominal.',
  footerRight: 'Built with Next.js & Supabase',
} as const;
