import type { SkillLayer } from './types';

/* Skills are organised by layer of the system, not by language, and every
   layer has to point at something that proves it. A list nobody can verify is
   a list nobody believes — which is what the old grid of identical cards with
   identical full-width bars actually communicated. */

export const skillLayers: SkillLayer[] = [
  {
    id: 'agents',
    name: 'Agents & LLM',
    summary: 'Getting a model to take actions reliably, and knowing when it has not.',
    items: [
      'Agent orchestration',
      'Tool / function calling',
      'Retrieval-augmented generation',
      'Vector databases',
      'LLM evaluation',
      'Prompt design',
      'n8n',
      'Hugging Face',
    ],
    proof: [
      { label: 'Avagenc', slug: 'avagenc' },
      { label: 'Datafact', slug: 'datafact' },
      { label: 'LLM evaluation — 200 questions graded for correctness, reasoning and hallucination' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & concurrency',
    summary: 'Services that hold up when several things happen at once.',
    items: [
      'Go',
      'High-concurrency services',
      'REST API design',
      'Third-party system integration',
      'Distributed systems',
      'Python',
    ],
    proof: [
      { label: 'Avagenc', slug: 'avagenc' },
      { label: 'gmail-sender', slug: 'gmail-sender' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & delivery',
    summary: 'Infrastructure that scales to a burst and costs nothing while idle.',
    items: [
      'AWS Lambda',
      'AWS Step Functions',
      'API Gateway',
      'EventBridge Scheduler',
      'Google Cloud Platform',
      'Docker',
      'CI/CD',
      'Vercel',
    ],
    proof: [
      { label: 'Datafact', slug: 'datafact' },
      { label: 'Avagenc', slug: 'avagenc' },
    ],
  },
  {
    id: 'interface',
    name: 'Interface',
    summary: 'The part a person actually touches, including the explanation of what the system did.',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Data visualisation'],
    proof: [
      { label: 'NusaVerify', slug: 'nusaverify' },
      { label: 'Vicoworks', slug: 'vicoworks' },
      { label: 'HandlerIndonesia', slug: 'handlerindonesia' },
    ],
  },
  {
    id: 'data',
    name: 'Data & modelling',
    summary: 'Measuring things, and training something when a rule would not do.',
    items: [
      'PostgreSQL',
      'Supabase',
      'Reinforcement learning',
      'Gymnasium',
      'Stable-Baselines3',
      'Data analysis',
    ],
    proof: [{ label: 'Optimizing Robot Tutor Strategies', slug: 'robot-tutor-rl' }],
  },
];

export const languages = ['Go', 'Python', 'TypeScript', 'JavaScript', 'Java', 'Dart', 'C'];
