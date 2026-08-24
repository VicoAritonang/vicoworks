import type { Project } from './types';

/* Ground truth for every claim below is cv_latex/vico_aritonang_cv.tex.
   Where a number does not exist yet the line is left as TODO(vico), which
   publishable() strips before render — the gap stays in the file, never on the
   page. Datafact's public framing is deliberately limited to AI engineering
   and the AWS architecture. */

export const projects: Project[] = [
  {
    slug: 'avagenc',
    name: 'Avagenc',
    year: '2025 — present',
    role: 'Co-founder · engineering lead',
    status: 'in-development',
    featured: true,
    order: 1,
    oneLiner:
      'A multi-agent assistant that acts across your inbox, calendar, contacts, music and home devices from a single conversation.',
    outcome:
      'In development. Go orchestration layer, Next.js web client and an Android client, containerised and deployed on cloud-native infrastructure.',
    stack: ['Go', 'Next.js', 'Android', 'LLM agents', 'Vector database', 'Docker', 'GCP'],
    categories: ['Agentic AI', 'Backend & cloud'],
    links: { live: 'https://avagenc.com' },
    /* TODO(vico): swap `youtubeId` for your own recording. Everything else
       on the page is real; this reel is the one stand-in left. */
    video: {
      youtubeId: 'qn9g0i1TV5c',
      title: 'Avagenc — a full agent run, end to end',
      caption:
        'Recorded walkthrough: one request in plain language, and the orchestrator choosing tools, calling them and reporting back.',
      placeholder: true,
    },
    diagram: {
      caption:
        'One conversation, many tools. The orchestrator decides which to call and in what order.',
      nodes: [
        { id: 'chat', label: 'Chat client', sublabel: 'Next.js · Android', col: 0, row: 1, kind: 'input' },
        { id: 'llm', label: 'LLM', sublabel: 'planning · tool choice', col: 1, row: 0, kind: 'model' },
        { id: 'orch', label: 'Agent orchestrator', sublabel: 'Go', col: 1, row: 1, kind: 'compute' },
        { id: 'memory', label: 'Vector memory', sublabel: 'conversation context', col: 1, row: 2, kind: 'store' },
        { id: 'tools', label: 'Tool layer', sublabel: 'uniform interface', col: 2, row: 1, kind: 'compute' },
        { id: 'gmail', label: 'Gmail', col: 3, row: 0, kind: 'service' },
        { id: 'cal', label: 'Calendar · Contacts', col: 3, row: 1, kind: 'service' },
        { id: 'home', label: 'Spotify · Tuya', col: 3, row: 2, kind: 'service' },
      ],
      edges: [
        { from: 'chat', to: 'orch' },
        { from: 'orch', to: 'llm' },
        { from: 'orch', to: 'memory', dashed: true },
        { from: 'orch', to: 'tools' },
        { from: 'tools', to: 'gmail' },
        { from: 'tools', to: 'cal' },
        { from: 'tools', to: 'home' },
      ],
      flow: ['chat', 'orch', 'tools', 'cal'],
      spine: [
        { label: 'Chat', kind: 'input' },
        { label: 'Go orchestrator', kind: 'compute' },
        { label: 'Tool layer', kind: 'compute' },
        { label: 'Connected services', sublabel: 'Gmail · Calendar · Tuya', kind: 'service' },
      ],
    },
    caseStudy: {
      whatItIs:
        'Avagenc is an assistant built around agents rather than around a chat box. You ask for something in plain language — reschedule this meeting, find the thread where we agreed a price, turn the lights down — and an orchestration layer works out which tools to call, in what order, and what to do when one of them fails halfway through.',
      problem:
        'Most assistants stop at answering. The work people actually want to hand over is the connective tissue between services: read one, decide something, write to another. That forces three things a chat interface never has to solve — holding context across tools, asking before an irreversible action, and staying predictable enough that someone will point it at a real inbox.',
      story: [
        {
          title: "Answers were never the bottleneck",
          body: [
            "Every assistant I used could tell me what was in my calendar. None of them could move the meeting. The gap was not intelligence — it was that nothing was allowed to act, so the last, tedious step always came back to me: open the other tab, copy the detail across, send the message.",
            "Avagenc started from the opposite end. Assume the model can already reason well enough, and spend the engineering on the part that is actually hard — letting it touch real accounts without becoming something you have to supervise.",
          ],
        },
        {
          title: "The demo worked. The second chain did not",
          body: [
            "A single tool call is easy. The first time a request needed three in a row — read the thread, find the free slot, send the invite — the failure modes stopped being about the model at all. A calendar call would time out after the email had already been read, and the run would end somewhere in the middle with no way to say what had and had not happened.",
            "That is what pushed every integration behind one interface and every irreversible step behind a confirmation. Gmail, Calendar, Contacts, Spotify and Tuya disagree about almost everything; the orchestrator should not have to know that any of them exist.",
            "TODO(vico): the specific run that broke, and what you changed the same night. A real one beats a summarised one.",
          ],
          pullQuote:
            "The hard part was never the model. It was deciding what an agent is allowed to do without being asked.",
        },
        {
          title: "Where it is now",
          body: [
            "A Go orchestration layer, a Next.js web client and an Android client, containerised so the thing I run locally is the thing that runs in the cloud. Live integrations across five services, with conversation memory in a vector store so the assistant is still useful on the second day.",
            "It is not finished. It is in the state where the interesting problems left are product problems rather than plumbing ones — which is where I wanted it to be.",
          ],
        },
      ],
      decisions: [
        {
          decision: 'Go for the orchestration layer',
          why: 'An agent run is mostly waiting on network I/O, and several of those calls are independent of each other. Goroutines make that fan-out cheap and keep the concurrency explicit in the code rather than hidden inside a framework.',
          tradeoff:
            'A much smaller AI ecosystem than Python, so a lot of the agent plumbing is written by hand instead of imported.',
        },
        {
          decision: 'Every integration behind one uniform tool interface',
          why: 'Gmail, Google Calendar, Google Contacts, Spotify and Tuya disagree about auth, payload shape and how they fail. Wrapping each behind the same contract means the agent reasons about capabilities, not about vendor APIs.',
          tradeoff: 'Each new service costs an adapter before it costs a feature.',
        },
        {
          decision: 'Conversation memory in a vector store, retrieved per turn',
          why: 'An assistant that forgets what you told it last week is a demo. Retrieval keeps the prompt small while the useful history stays reachable.',
          tradeoff:
            'Retrieval quality becomes its own tuning problem, and a bad recall is harder to debug than a missing feature.',
        },
        {
          decision: 'Containerised services, the same image locally and in the cloud',
          why: 'When one person owns both the code and the deploy, the only sustainable answer is that the two environments are the same thing.',
          tradeoff: 'More setup than pushing a folder to a host, and an image to keep patched.',
        },
      ],
      results: [
        'Web platform, Android client and the agent orchestration layer built end to end.',
        'Live integrations across Gmail, Google Calendar, Google Contacts, Spotify and Tuya smart-home devices.',
        'TODO(vico): pilot users, request volume, or any scale number that is safe to publish.',
      ],
      reflection:
        'The hard part was never the model. It was deciding what an agent is allowed to do without asking, and making a failure legible when a tool call breaks in the middle of a chain. Starting again, I would design the confirmation and rollback story first and let the prompt follow from it.',
    },
  },

  {
    slug: 'datafact',
    name: 'Datafact',
    year: '2025 — 2026',
    role: 'AI & backend engineer',
    status: 'live',
    featured: true,
    order: 2,
    oneLiner:
      'A serverless engine that turns a Google Form and a chosen persona into coherent, human-plausible survey responses at scale.',
    outcome: 'Live at datafact.site. Fully event-driven on AWS — nothing to keep warm between runs.',
    stack: [
      'AWS Lambda',
      'AWS Step Functions',
      'API Gateway (HTTP)',
      'EventBridge Scheduler',
      'Generative AI',
      'Serverless',
    ],
    categories: ['AI Engineering', 'Backend & cloud'],
    links: { live: 'https://www.datafact.site' },
    /* TODO(vico): swap `youtubeId` for your own recording. Everything else
       on the page is real; this reel is the one stand-in left. */
    video: {
      youtubeId: 'qn9g0i1TV5c',
      title: 'Datafact — one run from form to submitted responses',
      caption:
        'Recorded walkthrough: picking a form and a persona, watching the state machine fan out, and the responses landing in the sheet.',
      placeholder: true,
    },
    diagram: {
      caption:
        'Spiky load, no servers. Step Functions owns retries and partial failure; Lambda fans out one respondent at a time.',
      nodes: [
        { id: 'form', label: 'Form + persona', sublabel: 'what the user picks', col: 0, row: 1, kind: 'input' },
        { id: 'api', label: 'API Gateway', sublabel: 'HTTP API', col: 1, row: 1, kind: 'service' },
        { id: 'sched', label: 'EventBridge', sublabel: 'Scheduler', col: 1, row: 2, kind: 'service' },
        { id: 'sfn', label: 'Step Functions', sublabel: 'orchestration', col: 2, row: 1, kind: 'service' },
        { id: 'w1', label: 'Lambda', sublabel: 'one respondent', col: 3, row: 0, kind: 'compute' },
        { id: 'w2', label: 'Lambda', sublabel: 'one respondent', col: 3, row: 1, kind: 'compute' },
        { id: 'w3', label: 'Lambda', sublabel: 'one respondent', col: 3, row: 2, kind: 'compute' },
        { id: 'gen', label: 'Generative AI', sublabel: 'response synthesis', col: 4, row: 1, kind: 'model' },
        { id: 'out', label: 'Google Form', sublabel: 'responses submitted', col: 5, row: 1, kind: 'output' },
      ],
      edges: [
        { from: 'form', to: 'api' },
        { from: 'api', to: 'sfn' },
        { from: 'sched', to: 'sfn', dashed: true, label: 'timed runs' },
        { from: 'sfn', to: 'w1' },
        { from: 'sfn', to: 'w2' },
        { from: 'sfn', to: 'w3' },
        { from: 'w1', to: 'gen' },
        { from: 'w2', to: 'gen' },
        { from: 'w3', to: 'gen' },
        { from: 'gen', to: 'out' },
      ],
      flow: ['form', 'api', 'sfn', 'w2', 'gen', 'out'],
      spine: [
        { label: 'Form + persona', kind: 'input' },
        { label: 'Step Functions', kind: 'service' },
        { label: 'Lambda fan-out', kind: 'compute' },
        { label: 'Generative AI', kind: 'model' },
        { label: 'Responses', kind: 'output' },
      ],
    },
    caseStudy: {
      whatItIs:
        'Datafact takes a Google Form URL and a chosen persona, and produces survey responses that read as though they came from that kind of person — consistent from one question to the next, and submitted straight into the form.',
      problem:
        'Testing a survey instrument, a form pipeline or a dashboard needs response data before any real respondent exists. Hand-written rows are uniform and obviously synthetic; they never exercise the messy middle of a distribution, which is exactly where the pipeline breaks.',
      story: [
        {
          title: "A pipeline you cannot test is a pipeline you do not trust",
          body: [
            "The trigger was mundane. You build a form, a pipeline behind it and a dashboard on top, and then you cannot tell whether any of it works, because there is no data — and there will be no data until you ship it to real people, which is exactly the moment you would like to already know.",
            "The obvious workaround is to type a few rows in by hand. Those rows are useless. They are uniform, they agree with each other, and they never produce the awkward middle of a distribution where the pipeline actually breaks.",
          ],
        },
        {
          title: "Making the data plausible was the whole problem",
          body: [
            "Generating a response is trivial. Generating two hundred that behave like two hundred different people, each internally consistent from the first question to the last, is not. A respondent who is careful about one answer and careless about the next is not a person; it is an artefact, and anything downstream looking for structure will find none.",
            "So coherence is enforced per respondent, up front, rather than reconciled at the end. Each one is an independent unit of work, which is also what let the whole thing fan out concurrently without a single bad generation poisoning the batch.",
            "TODO(vico): the first batch you looked at and knew was wrong — what gave it away?",
          ],
          pullQuote:
            "Responses that all arrive in the same second look like exactly what they are.",
        },
        {
          title: "Serverless was a trade, not a shortcut",
          body: [
            "The load is spiky by nature: nothing for hours, then a burst. Lambda behind Step Functions absorbs that and costs nothing in between, which is the right shape for a system that sits idle most of the day.",
            "What it costs is that a run stops being one request and one response. It becomes a state machine you have to watch. I would make the same trade again — but I would design how to watch a run before writing the run.",
          ],
        },
      ],
      decisions: [
        {
          decision: 'A fully serverless, event-driven backend',
          why: 'Load is spiky by nature — nothing for hours, then a burst of concurrent generations. Lambda behind Step Functions absorbs the burst and costs nothing between runs, which matters when the system is idle most of the day.',
          tradeoff:
            'Cold starts, and a hard execution ceiling per function. The workflow has to be decomposed into steps that each fit inside it rather than written as one long job.',
        },
        {
          decision: 'Step Functions instead of orchestrating inside a single function',
          why: 'Retries, timeouts and partial failure become configuration rather than code, and a failed run can be inspected step by step instead of reconstructed from logs.',
          tradeoff:
            'The state machine is its own artefact to maintain, and reproducing a run locally is harder than executing a script.',
        },
        {
          decision: 'Fan out concurrently, one unit of work per respondent',
          why: 'Respondents are independent, so throughput scales horizontally and one bad generation cannot poison the batch.',
          tradeoff:
            'Coherence has to be enforced inside each respondent up front, because there is no shared pass at the end to reconcile them.',
        },
        {
          decision: 'EventBridge Scheduler for timed submission',
          why: 'Responses that all arrive in the same second look like exactly what they are. Spreading submission across a schedule is the difference between usable data and an obvious artefact.',
          tradeoff:
            'A run stops being a single request and response, so progress and failure need a reporting path of their own.',
        },
      ],
      results: [
        'Live and publicly usable at datafact.site.',
        'No servers, containers or queues to operate — the backend is entirely managed AWS services.',
        'Scales from a single respondent to a large batch without a configuration change.',
        'TODO(vico): throughput per run and cost per run, if you have measured them.',
      ],
      reflection:
        'Serverless made the scaling question disappear and replaced it with an orchestration question, which is a trade I would make again. What I underestimated was observability: with work spread across a state machine and many short-lived functions, you have to design how you will watch a run before you write the run itself.',
    },
  },

  {
    slug: 'nusaverify',
    name: 'NusaVerify',
    year: '2026',
    role: 'Engineer — Bank Indonesia hackathon',
    status: 'live',
    featured: true,
    order: 3,
    oneLiner:
      'A fact-checker that scores how likely a claim is to be a hoax, and shows the entire reasoning chain behind the number.',
    outcome: 'Built for the Bank Indonesia hackathon. Live at nusaverify-web.vercel.app.',
    stack: ['Next.js', 'TypeScript', 'LLM', 'Information retrieval', 'Vercel'],
    categories: ['AI Engineering', 'Frontend'],
    links: { live: 'https://nusaverify-web.vercel.app/' },
    /* TODO(vico): swap `youtubeId` for your own recording. Everything else
       on the page is real; this reel is the one stand-in left. */
    video: {
      youtubeId: 'qn9g0i1TV5c',
      title: 'NusaVerify — checking a claim, and reading the reasoning',
      caption:
        'Recorded walkthrough: a claim goes in, sources are scored one at a time, and the mind-map shows what moved the number.',
      placeholder: true,
    },
    diagram: {
      caption:
        'Each source is scored on its own, then combined — so disagreement stays visible instead of averaging away.',
      nodes: [
        { id: 'claim', label: 'Claim', sublabel: 'text or link', col: 0, row: 1, kind: 'input' },
        { id: 'retr', label: 'Source retrieval', sublabel: 'multi-source search', col: 1, row: 1, kind: 'compute' },
        { id: 's1', label: 'Source', sublabel: 'scored on its own', col: 2, row: 0, kind: 'store' },
        { id: 's2', label: 'Source', sublabel: 'scored on its own', col: 2, row: 1, kind: 'store' },
        { id: 's3', label: 'Source', sublabel: 'scored on its own', col: 2, row: 2, kind: 'store' },
        { id: 'score', label: 'Weighted validation', sublabel: 'per-source weights', col: 3, row: 1, kind: 'compute' },
        { id: 'verdict', label: 'Hoax / valid %', col: 4, row: 0, kind: 'output' },
        { id: 'map', label: 'Reasoning mind-map', sublabel: 'animated, interactive', col: 4, row: 1, kind: 'output' },
      ],
      edges: [
        { from: 'claim', to: 'retr' },
        { from: 'retr', to: 's1' },
        { from: 'retr', to: 's2' },
        { from: 'retr', to: 's3' },
        { from: 's1', to: 'score' },
        { from: 's2', to: 'score' },
        { from: 's3', to: 'score' },
        { from: 'score', to: 'verdict' },
        { from: 'score', to: 'map' },
      ],
      flow: ['claim', 'retr', 's2', 'score', 'map'],
      spine: [
        { label: 'Claim', kind: 'input' },
        { label: 'Source retrieval', kind: 'compute' },
        { label: 'Weighted scoring', kind: 'compute' },
        { label: 'Verdict + mind-map', kind: 'output' },
      ],
    },
    caseStudy: {
      whatItIs:
        'You give NusaVerify a claim. It searches across sources, weighs what each one is worth, and returns a hoax/validity probability — together with an animated mind-map of how it arrived there.',
      problem:
        'A verdict without reasoning is just another authority to trust. For misinformation that spreads precisely because people cannot check it themselves, showing the work matters more than the score does.',
      story: [
        {
          title: "Built in a hackathon, around one argument",
          body: [
            "Bank Indonesia's hackathon set the clock; the argument set the design. A fact-checker that returns a verdict and nothing else has not solved misinformation — it has added one more authority you are expected to take on faith, aimed at exactly the people who are least able to check things for themselves.",
            "So the reasoning chain, not the score, became the product. The number is a summary of the work; the work is the part you are allowed to disagree with.",
          ],
          pullQuote:
            "A verdict without reasoning is just another authority to trust.",
        },
        {
          title: "Designing the output changed the backend",
          body: [
            "The mind-map was supposed to be presentation. Once it had to be real and interactive, every scoring step had to become an addressable object with a source, a weight and a contribution — not a sentence buried in a paragraph of model prose.",
            "That constraint improved the system. Sources are scored separately and combined afterwards, so when two of them disagree the disagreement stays visible instead of being averaged into a confident, wrong answer.",
            "TODO(vico): how far the project got in the hackathon, and anything you measured against a test set.",
          ],
        },
      ],
      decisions: [
        {
          decision: 'Weighted-average validation across sources, not a single model judgment',
          why: 'One model asked whether something is true is confidently wrong in exactly the cases that matter. Scoring each source separately and combining them afterwards keeps disagreement visible instead of collapsing it into one answer.',
          tradeoff: 'The weights are a judgement call, and a wrong weight is harder to notice than a wrong answer.',
        },
        {
          decision: 'The reasoning chain rendered as an interactive mind-map',
          why: 'The chain is the product. A user who can see which source moved the number can disagree with the verdict for a specific reason instead of dismissing it wholesale.',
          tradeoff:
            'Every intermediate step has to be emitted as structured data rather than prose, which constrains how the model is allowed to answer.',
        },
        {
          decision: 'Next.js end to end, deployed on Vercel',
          why: 'A hackathon budget is measured in hours. One framework, one deploy target, no infrastructure to argue with.',
          tradeoff:
            'Retrieval runs inside the same app that renders it, which is fine at demo scale and would not stay fine.',
        },
      ],
      results: [
        'Live at nusaverify-web.vercel.app.',
        'The full reasoning chain is inspectable — every source and its contribution to the score.',
        'TODO(vico): how far the project went in the Bank Indonesia hackathon, and any measured accuracy on a test set.',
      ],
      reflection:
        'Building the explanation surface first changed the backend. Once the mind-map had to be real, every scoring step had to become an addressable object — a better architecture than the one I would have written if the output had only ever been a number.',
    },
  },

  {
    slug: 'robot-tutor-rl',
    name: 'Optimizing Robot Tutor Strategies',
    year: '2026',
    role: 'Researcher — Universitas Indonesia',
    status: 'research',
    featured: false,
    order: 4,
    oneLiner:
      'When should a robot tutor teach, rest, or push harder? Formalised as a 1,440-state Markov Decision Process and solved with deep reinforcement learning.',
    outcome:
      'Soft Actor-Critic reached a 100% expert-proficiency rate, far ahead of random and fixed-schedule baselines.',
    stack: ['Python', 'Gymnasium', 'Stable-Baselines3', 'DQN · PPO · TRPO · SAC'],
    categories: ['Research'],
    links: { paper: '/optimizing-robot-tutor-strategies.pdf' },
    /* TODO(vico): swap `youtubeId` for your own recording. Everything else
       on the page is real; this reel is the one stand-in left. */
    video: {
      youtubeId: 'qn9g0i1TV5c',
      title: 'RobotTutor-v2 — the environment and the trained policies',
      caption:
        'Recorded walkthrough: the MDP, the training runs, and what the four algorithms actually learned to do.',
      placeholder: true,
    },
    diagram: {
      caption:
        'A reusable environment first, then four algorithms benchmarked against it across independent seeds.',
      nodes: [
        { id: 'env', label: 'RobotTutor-v2', sublabel: '1,440-state MDP', col: 0, row: 0, kind: 'compute' },
        { id: 'agent', label: 'RL agent', sublabel: 'DQN · PPO · TRPO · SAC', col: 1, row: 0, kind: 'model' },
        { id: 'policy', label: 'Learned policy', sublabel: 'teach · rest · push', col: 2, row: 0, kind: 'output' },
        { id: 'result', label: 'SAC', sublabel: '100% expert proficiency', col: 3, row: 0, kind: 'output' },
      ],
      edges: [
        { from: 'env', to: 'agent', label: 'state · reward' },
        { from: 'agent', to: 'policy' },
        { from: 'policy', to: 'result' },
        { from: 'agent', to: 'env', route: 'under', label: 'action' },
      ],
      flow: ['env', 'agent', 'policy', 'result'],
      spine: [
        { label: 'RobotTutor-v2', kind: 'compute' },
        { label: 'RL agent', kind: 'model' },
        { label: 'Learned policy', kind: 'output' },
        { label: '100% proficiency', kind: 'output' },
      ],
    },
    caseStudy: {
      whatItIs:
        'An academic project that treats tutoring as a sequential decision problem: over a 24-hour clock, with a learner who has proficiency, fatigue and engagement, what should a tutor do at each step to maximise long-run learning?',
      problem:
        'Fixed tutoring schedules ignore the learner. Teaching into fatigue wastes the session; resting an engaged learner wastes the opportunity. The decision is sequential and the reward is delayed, which is the shape reinforcement learning exists for.',
      story: [
        {
          title: "A tutor that never looks at the learner",
          body: [
            "Tutoring schedules are fixed because fixed is easy to run, not because it works. Teaching into fatigue burns a session; resting an engaged learner wastes one. The decision repeats every step and the payoff arrives much later, which is precisely the shape reinforcement learning exists for.",
            "The project began as a way to ask that question properly rather than to build a robot: over a 24-hour clock, with a learner who has proficiency, fatigue and engagement, what should a tutor do next?",
          ],
        },
        {
          title: "The environment turned out to be the contribution",
          body: [
            "Most of the work went into RobotTutor-v2 — a 1,440-state MDP wrapped as a Gymnasium environment. Making it Stable-Baselines3 compatible meant four algorithms could be compared without writing four training loops, and it leaves behind something someone else can run.",
            "Soft Actor-Critic produced the best policy, reaching a 100% expert-proficiency rate and clearly beating random and fixed-schedule baselines. That a continuous-control method won on a discretised problem is the result I would most want to interrogate next.",
          ],
        },
      ],
      decisions: [
        {
          decision: 'Formalise the problem as a 1,440-state MDP',
          why: 'Twenty-four hours crossed with proficiency, fatigue and engagement gives a state space large enough to be interesting and small enough to enumerate and reason about.',
          tradeoff:
            'A discretised learner model is a caricature of a real one, so the results transfer as direction rather than as magnitude.',
        },
        {
          decision: 'Build RobotTutor-v2 as a Gymnasium environment',
          why: 'Making it Stable-Baselines3 compatible meant four algorithms could be compared without writing four training loops, and the environment is reusable by anyone else.',
          tradeoff: 'Conforming to the interface constrained how the reward and the episode boundaries could be expressed.',
        },
        {
          decision: 'Benchmark DQN, PPO, TRPO and SAC across independent seeds',
          why: 'A single run of a single algorithm proves nothing in RL — variance across seeds is often larger than the gap between methods.',
          tradeoff: 'Considerably more compute, for a result that is a comparison rather than one trained model.',
        },
      ],
      results: [
        'A 1,440-state MDP over a 24-hour clock, learner proficiency, fatigue and engagement.',
        'RobotTutor-v2 — a reusable Gymnasium environment, compatible with Stable-Baselines3.',
        'DQN, PPO, TRPO and SAC benchmarked across independent seeds.',
        'Soft Actor-Critic produced the best policy, reaching a 100% expert-proficiency rate and clearly beating random and fixed-schedule baselines.',
      ],
      reflection:
        'The environment turned out to be the contribution. Once the MDP was honest about fatigue and engagement the algorithm comparison almost ran itself — and the fact that a continuous-control method won on a discretised problem is the part I would want to interrogate next.',
    },
  },

  {
    slug: 'handlerindonesia',
    name: 'HandlerIndonesia',
    year: '2025',
    role: 'Engineer',
    status: 'live',
    featured: false,
    order: 5,
    oneLiner: 'An export-facilitation platform helping Indonesian MSMEs reach buyers outside the country.',
    outcome:
      'Top 50 Finalist, 1000x Innovation Challenge — Marvin Foundation with Universitas Indonesia and DSX Ventures.',
    stack: ['Next.js', 'React', 'Vercel'],
    categories: ['Frontend'],
    links: { live: 'https://handlerindonesia.vercel.app' },
  },

  {
    slug: 'gmail-sender',
    name: 'gmail-sender',
    year: '2025',
    role: 'Author',
    status: 'archived',
    featured: false,
    order: 6,
    oneLiner: 'A small Go service for automating outbound email as part of a larger workflow.',
    outcome: 'Written to remove a manual step that kept reappearing across projects.',
    stack: ['Go'],
    categories: ['Backend & cloud'],
    links: {},
  },

  {
    slug: 'vicoworks',
    name: 'Vicoworks',
    year: '2025 — 2026',
    role: 'Designer & engineer',
    status: 'live',
    featured: false,
    order: 7,
    oneLiner:
      'This site. Statically rendered Next.js, with the architecture diagrams drawn from data rather than exported as images.',
    outcome: 'Live at vicoworks.com.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    categories: ['Frontend'],
    links: { live: 'https://vicoworks.com' },
  },
];

export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);

export const allProjects = [...projects].sort((a, b) => a.order - b.order);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Only projects with a written case study get a detail route. */
export const caseStudySlugs = projects.filter((p) => p.caseStudy).map((p) => p.slug);

export const research = projects.find((p) => p.slug === 'robot-tutor-rl')!;
