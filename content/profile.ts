export const profile = {
  name: 'Vico Aritonang',
  fullName: 'Vico Winner Sebastian Aritonang',
  role: 'AI & Agentic Systems Engineer',

  /** The h1. A claim, not a job title — the page has five seconds to land it. */
  claim: 'I build AI agents that do real operational work.',

  identity:
    "I'm Vico — Information Systems at Universitas Indonesia, co-founder of Avagenc. I work on LLM agent orchestration, high-concurrency Go services, and serverless backends that keep running when nobody is watching them.",

  availability: 'Open to AI engineering internships — remote, or Depok / Jakarta',

  /** Replaces the old Stats section. Facts, not vanity counters. */
  proof: [
    '3 systems in production',
    'datafact.site live',
    'Go · Python · TypeScript',
    'AWS + GCP',
  ],

  location: 'Depok, West Java, Indonesia',
  email: 'vicoaritonang5@gmail.com',

  links: {
    github: 'https://github.com/VicoAritonang',
    linkedin: 'https://www.linkedin.com/in/vico-winner-sebastian-aritonang-93a609249/',
    whatsapp: 'https://wa.me/6282273992724',
    resume: '/Vico_Aritonang_CV.pdf',
  },

  about: [
    'I started in Mechanical Engineering at Universitas Indonesia and moved to Information Systems after a year, once it was obvious that the systems I actually wanted to build were made of software. I am in my seventh semester.',
    'Since February 2025 I have been co-founding Avagenc, an AI automation startup. In practice that means writing the agent orchestration layer, the Go services underneath it, and the deployment that keeps both alive — usually in the same week.',
    'Before that I spent two months evaluating a mathematical LLM across 200 questions, grading correctness, reasoning validity and hallucination one answer at a time. It is the least glamorous work I have done and probably the most useful: it is where I learned what these models actually fail at, rather than what they are advertised to do.',
    'I am looking for an AI engineering internship — remote, or on the ground in Jakarta and Depok.',
  ],

  /** Small print, footer only. */
  education: 'B.Sc. Information Systems, Universitas Indonesia (2023 — 2027)',
} as const;

export type Profile = typeof profile;
