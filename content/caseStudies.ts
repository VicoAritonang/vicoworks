import type { Project } from './caseStudyTypes';

/* Case studies for /projects/[slug], carried over unchanged from the previous
   design (they were live and indexed at the same URLs).

   Ground truth for every claim below is cv_latex/vico_aritonang_cv.tex.
   Where a number does not exist yet the line is left as TODO(vico), which
   publishable() strips before render – the gap stays in the file, never on the
   page. Datafact's public framing is deliberately limited to AI engineering
   and the AWS architecture. */

export const projects: Project[] = [
  {
    slug: 'avagenc',
    name: 'Avagenc',
    year: '2025 – present',
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
      title: 'Avagenc – a full agent run, end to end',
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
        'Avagenc is an assistant built around agents rather than around a chat box. You ask for something in plain language – reschedule this meeting, find the thread where we agreed a price, turn the lights down – and an orchestration layer works out which tools to call, in what order, and what to do when one of them fails halfway through.',
      problem:
        'Most assistants stop at answering. The work people actually want to hand over is the connective tissue between services: read one, decide something, write to another. That forces three things a chat interface never has to solve – holding context across tools, asking before an irreversible action, and staying predictable enough that someone will point it at a real inbox.',
      story: [
        {
          title: "Answers were never the bottleneck",
          body: [
            "Every assistant I used could tell me what was in my calendar. None of them could move the meeting. The gap was not intelligence – it was that nothing was allowed to act, so the last, tedious step always came back to me: open the other tab, copy the detail across, send the message.",
            "Avagenc started from the opposite end. Assume the model can already reason well enough, and spend the engineering on the part that is actually hard – letting it touch real accounts without becoming something you have to supervise.",
          ],
        },
        {
          title: "The demo worked. The second chain did not",
          body: [
            "A single tool call is easy. The first time a request needed three in a row – read the thread, find the free slot, send the invite – the failure modes stopped being about the model at all. A calendar call would time out after the email had already been read, and the run would end somewhere in the middle with no way to say what had and had not happened.",
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
            "It is not finished. It is in the state where the interesting problems left are product problems rather than plumbing ones – which is where I wanted it to be.",
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
    year: '2025 – 2026',
    role: 'AI & backend engineer',
    status: 'live',
    featured: true,
    order: 2,
    oneLiner:
      'A serverless engine that turns a Google Form and a chosen persona into coherent, human-plausible survey responses at scale.',
    outcome: 'Live at datafact.site. Fully event-driven on AWS – nothing to keep warm between runs.',
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
      title: 'Datafact – one run from form to submitted responses',
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
        'Datafact takes a Google Form URL and a chosen persona, and produces survey responses that read as though they came from that kind of person – consistent from one question to the next, and submitted straight into the form.',
      problem:
        'Testing a survey instrument, a form pipeline or a dashboard needs response data before any real respondent exists. Hand-written rows are uniform and obviously synthetic; they never exercise the messy middle of a distribution, which is exactly where the pipeline breaks.',
      story: [
        {
          title: "A pipeline you cannot test is a pipeline you do not trust",
          body: [
            "The trigger was mundane. You build a form, a pipeline behind it and a dashboard on top, and then you cannot tell whether any of it works, because there is no data – and there will be no data until you ship it to real people, which is exactly the moment you would like to already know.",
            "The obvious workaround is to type a few rows in by hand. Those rows are useless. They are uniform, they agree with each other, and they never produce the awkward middle of a distribution where the pipeline actually breaks.",
          ],
        },
        {
          title: "Making the data plausible was the whole problem",
          body: [
            "Generating a response is trivial. Generating two hundred that behave like two hundred different people, each internally consistent from the first question to the last, is not. A respondent who is careful about one answer and careless about the next is not a person; it is an artefact, and anything downstream looking for structure will find none.",
            "So coherence is enforced per respondent, up front, rather than reconciled at the end. Each one is an independent unit of work, which is also what let the whole thing fan out concurrently without a single bad generation poisoning the batch.",
            "TODO(vico): the first batch you looked at and knew was wrong – what gave it away?",
          ],
          pullQuote:
            "Responses that all arrive in the same second look like exactly what they are.",
        },
        {
          title: "Serverless was a trade, not a shortcut",
          body: [
            "The load is spiky by nature: nothing for hours, then a burst. Lambda behind Step Functions absorbs that and costs nothing in between, which is the right shape for a system that sits idle most of the day.",
            "What it costs is that a run stops being one request and one response. It becomes a state machine you have to watch. I would make the same trade again – but I would design how to watch a run before writing the run.",
          ],
        },
      ],
      decisions: [
        {
          decision: 'A fully serverless, event-driven backend',
          why: 'Load is spiky by nature – nothing for hours, then a burst of concurrent generations. Lambda behind Step Functions absorbs the burst and costs nothing between runs, which matters when the system is idle most of the day.',
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
        'No servers, containers or queues to operate – the backend is entirely managed AWS services.',
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
    role: 'AI & full-stack engineer – Bank Indonesia hackathon',
    status: 'live',
    featured: true,
    order: 3,
    oneLiner:
      'Paste a market rumour, an Instagram link or a Telegram screenshot – six AI agents check it against BEI, OJK and the financial press, and return a verdict with every source attached.',
    outcome:
      'Built for the Bank Indonesia hackathon. Live at nusaverify-web.vercel.app, covering stocks, crypto, forex, gold and macro claims.',
    stack: [
      'Go',
      'n8n',
      'Meta Graph API',
      'GraphQL',
      'Next.js',
      'TypeScript',
      'Supabase',
      'Tailwind CSS',
      'Vercel',
    ],
    categories: ['Agentic AI', 'AI Engineering', 'Backend & cloud'],
    links: {
      live: 'https://nusaverify-web.vercel.app/',
      repo: 'https://github.com/VicoAritonang/nusaverify-web',
    },
    /* TODO(vico): swap `youtubeId` for your own recording. Everything else
       on the page is real; this reel is the one stand-in left. */
    video: {
      youtubeId: 'qn9g0i1TV5c',
      title: 'NusaVerify – checking an investment claim, and reading the trace',
      caption:
        'Recorded walkthrough: a robot-trading promo goes in, six agents fan out, the knowledge graph builds itself, and the verdict lands with its sources.',
      placeholder: true,
    },
    diagram: {
      caption:
        'Six agents run in parallel, each scoring the claim on its own. Supabase holds the trace, so the browser can watch the reasoning while it is still happening.',
      nodes: [
        { id: 'claim', label: 'Claim', sublabel: 'text · IG link · screenshot', col: 0, row: 1, kind: 'input' },
        { id: 'n8n', label: 'n8n', sublabel: 'intake workflow', col: 1, row: 1, kind: 'service' },
        { id: 'meta', label: 'Meta Graph API', sublabel: 'Instagram content', col: 1, row: 0, kind: 'service' },
        { id: 'go', label: 'Agent orchestrator', sublabel: 'Go', col: 2, row: 1, kind: 'compute' },
        { id: 'reg', label: 'BEI · OJK agent', sublabel: 'regulator & exchange', col: 3, row: 0, kind: 'model' },
        { id: 'media', label: 'Media agents', sublabel: 'CNBC · Kontan · Bisnis', col: 3, row: 1, kind: 'model' },
        { id: 'crowd', label: 'Sentiment + analyst', sublabel: 'retail · market', col: 3, row: 2, kind: 'model' },
        { id: 'db', label: 'Supabase', sublabel: 'post · think trace', col: 4, row: 1, kind: 'store' },
        { id: 'graph', label: 'Live knowledge graph', sublabel: 'force-directed', col: 5, row: 0, kind: 'output' },
        { id: 'verdict', label: 'Verdict', sublabel: 'valid · hoax · uncertain', col: 5, row: 1, kind: 'output' },
      ],
      edges: [
        { from: 'claim', to: 'n8n' },
        { from: 'n8n', to: 'meta', dashed: true, label: 'IG links' },
        { from: 'n8n', to: 'go' },
        { from: 'go', to: 'reg' },
        { from: 'go', to: 'media' },
        { from: 'go', to: 'crowd' },
        { from: 'reg', to: 'db' },
        { from: 'media', to: 'db' },
        { from: 'crowd', to: 'db' },
        { from: 'db', to: 'graph' },
        { from: 'db', to: 'verdict' },
      ],
      flow: ['claim', 'n8n', 'go', 'media', 'db', 'verdict'],
      spine: [
        { label: 'Claim', sublabel: 'text · IG · screenshot', kind: 'input' },
        { label: 'n8n + Go', sublabel: 'orchestration', kind: 'compute' },
        { label: 'Six agents', sublabel: 'in parallel', kind: 'model' },
        { label: 'Verdict + graph', kind: 'output' },
      ],
    },
    caseStudy: {
      whatItIs:
        'NusaVerify checks investment information before you act on it. You paste a claim – "this robot trading guarantees 20% a week", "BBCA is about to announce a jumbo dividend", an Instagram post from a stock influencer, a screenshot from a Telegram "cuan" group – and six AI agents search the stock exchange (BEI), the financial regulator (OJK), the financial press and retail sentiment at the same time. You get back a verdict – verified, misinformation or unconfirmed – with a confidence score, a plain-language explanation, and a live knowledge graph of every source that moved the number.',
      problem:
        'Indonesia\'s new retail investors learn about markets from Instagram, TikTok and Telegram groups, which is exactly where pump-and-dump calls, fake corporate actions and illegal investment schemes spread. The information needed to check them already exists – exchange disclosures, OJK\'s list of illegal entities, the financial press – but it is scattered across sites a beginner does not know to open, and a rumour moves faster than anyone can read all of them.',
      story: [
        {
          title: 'From fact-checking to the place misinformation costs money',
          body: [
            'The first version was a general-purpose hoax detector: politics, science, the claims that fill a family WhatsApp group. It worked, but it competed with every fact-checking site in the country, and the cost of believing a wrong claim was abstract.',
            'For the Bank Indonesia hackathon I narrowed it to investment information – stocks, crypto, forex, gold and macro – where a believed rumour has a price tag. Every source, every agent persona and every verdict label was rewritten for that domain: "hoax" became "misinformation", and "uncertain" became "unconfirmed – be careful".',
          ],
          pullQuote: 'Check first, then believe.',
        },
        {
          title: 'Six agents, scored separately',
          body: [
            'One model asked whether a claim is true is confidently wrong in exactly the cases that matter. So the work is split: an agent for the exchange and the regulator, agents for CNBC Indonesia, Kontan and Bisnis Indonesia, one reading retail sentiment, and a market analyst that pulls the findings together. Each one scores the claim on its own scale from supporting to refuting.',
            'Keeping them separate is what makes the result honest. When retail sentiment is full of "already withdrawn my profit" testimonials while OJK has the entity on its illegal list, that disagreement is the most useful thing to show – and it would disappear if everything were averaged into one sentence.',
          ],
        },
        {
          title: 'Making the reasoning watchable',
          body: [
            'A check takes long enough that a spinner would lose the user. Instead, every agent writes its intermediate findings into Supabase as it goes, and the page polls that trace: the knowledge graph grows node by node while the sources are being explored, collapses into an agent-to-agent conversation during cross-analysis, and resolves into the verdict card when the run completes.',
            'That turned the waiting time into the explanation. By the time the verdict appears, the user has already watched which sources supported it and which did not.',
          ],
        },
      ],
      decisions: [
        {
          decision: 'Go for the agent orchestration layer',
          why: 'A check is six agents waiting on network calls at the same time. Goroutines make that fan-out cheap and explicit, and a single compiled service is easy to deploy next to the workflow engine.',
          tradeoff:
            'A thinner AI ecosystem than Python, so prompt handling and agent plumbing are written by hand.',
        },
        {
          decision: 'n8n for intake and integrations, code for the reasoning',
          why: 'Receiving a claim, normalising text, images and links, and calling external services is integration work that changes often – a visual workflow makes it fast to rewire during a hackathon. The part that has to be precise, the agents and their scoring, stays in Go.',
          tradeoff:
            'Logic lives in two places, so a bug can sit on either side of the webhook boundary.',
        },
        {
          decision: 'Meta Graph API (GraphQL) to read Instagram posts',
          why: 'Much of the misinformation arrives as an Instagram post, not as text. Pulling the caption and media through Meta\'s official Graph API means the agents check what the post actually says rather than whatever the user managed to copy.',
          tradeoff:
            'Access depends on Meta Business app permissions and review, which is a dependency outside the codebase.',
        },
        {
          decision: 'Supabase as the shared trace, polled by the browser',
          why: 'Agents write intermediate state – exploring, analyzing, completed – into a `think` table. The front end only has to read it, which keeps the Next.js app thin and lets anyone reopen a running check from its URL.',
          tradeoff:
            'Polling every few seconds is less elegant than a push channel, and the table schema is tied to the current set of sources.',
        },
        {
          decision: 'A signed confidence score, not a percentage of truth',
          why: 'Confidence runs from -100 (leans misinformation) to +100 (leans verified). The sign carries the direction and the magnitude carries how sure the agents are, so "uncertain but leaning hoax" can be shown instead of forced into a binary.',
          tradeoff: 'One more concept the interface has to teach in a single glance.',
        },
      ],
      results: [
        'Live at nusaverify-web.vercel.app, covering stocks, crypto, forex, gold and macro claims.',
        'Accepts plain text, Instagram links and screenshots, with an optional ticker such as $BBCA or BTC.',
        'Six agents run in parallel across BEI/OJK, CNBC Indonesia, Kontan, Bisnis Indonesia, retail sentiment and a market analyst.',
        'Every check produces an inspectable trace: an interactive knowledge graph, the agents\' cross-analysis and a verdict with source links.',
        'Clearly framed as information validation, not investment advice.',
      ],
      reflection:
        'Narrowing the domain did more for the product than any model change. Once the claims were about money, the sources became obvious, the verdict labels became sharper, and the reasoning trace stopped being decoration – an investor deciding whether to buy needs to see why. If I rebuilt it, I would make the source list dynamic from the start instead of one column per outlet, so adding a new regulator or exchange is data, not a migration.',
    },
  },

  {
    slug: 'acep',
    name: 'ACEP',
    year: '2026',
    role: 'CTO & co-founder – two-person company',
    status: 'live',
    featured: true,
    order: 4,
    oneLiner:
      'Advanced Clean Energy Planning: a solar-and-battery planner that tells off-grid industries, day by day, whether their power supply will hold – before the diesel runs out.',
    outcome:
      'Top 6 finalist, Ideanation – IPB Business Plan Competition 2026. Working prototype live at acep-prototype.vercel.app.',
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'PostgreSQL',
      'Open-Meteo API',
      'n8n',
      'WebGL',
      'Vercel',
    ],
    categories: ['Product & business', 'Frontend', 'AI Engineering'],
    links: {
      live: 'https://acep-prototype.vercel.app/',
      repo: 'https://github.com/VicoAritonang/acep-2',
    },
    diagram: {
      caption:
        'Loads, generators and batteries go in once; the weather forecast changes every day. The planner carries the battery forward one day at a time and colours the calendar.',
      nodes: [
        { id: 'loads', label: 'Electrical loads', sublabel: 'equipment · kW · hours', col: 0, row: 0, kind: 'input' },
        { id: 'plants', label: 'Solar generators', sublabel: 'units · rated power', col: 0, row: 1, kind: 'input' },
        { id: 'storage', label: 'Battery storage', sublabel: 'capacity · charge', col: 0, row: 2, kind: 'input' },
        { id: 'db', label: 'Supabase', sublabel: 'auth · Postgres', col: 1, row: 1, kind: 'store' },
        { id: 'meteo', label: 'Open-Meteo', sublabel: '14-day forecast', col: 1, row: 0, kind: 'service' },
        { id: 'calc', label: 'Energy planner', sublabel: 'daily carry-over', col: 2, row: 1, kind: 'compute' },
        { id: 'cal', label: 'Energy calendar', sublabel: 'safe · warning · short', col: 3, row: 1, kind: 'output' },
        { id: 'bot', label: 'ACEP Assistant', sublabel: 'n8n · LLM', col: 3, row: 2, kind: 'model' },
      ],
      edges: [
        { from: 'loads', to: 'db' },
        { from: 'plants', to: 'db' },
        { from: 'storage', to: 'db' },
        { from: 'meteo', to: 'calc', label: 'predicted kWh' },
        { from: 'db', to: 'calc' },
        { from: 'calc', to: 'cal' },
        { from: 'db', to: 'bot', dashed: true },
      ],
      flow: ['plants', 'db', 'calc', 'cal'],
      spine: [
        { label: 'Loads · panels · batteries', kind: 'input' },
        { label: '14-day forecast', sublabel: 'Open-Meteo', kind: 'service' },
        { label: 'Energy planner', kind: 'compute' },
        { label: 'Energy calendar', kind: 'output' },
      ],
    },
    caseStudy: {
      whatItIs:
        'ACEP (Advanced Clean Energy Planning) is a web platform for running a remote site on solar power. An operator records the equipment that draws power, the solar generators and the battery bank; ACEP combines that with a 14-day weather forecast for the site and colours an energy calendar – green where the supply is safe, amber where it depends on the sun showing up, red where it will fall short. An AI assistant answers planning questions in Indonesian along the way.',
      problem:
        'Mines, plantations, fisheries and facilities on Indonesia\'s outer islands often sit beyond the reach of the PLN grid, so they run on diesel generators – expensive to ship in, loud, and carbon-heavy. Solar is the obvious alternative, but installing panels is not the hard part. The hard part is knowing whether the supply will hold on a cloudy week and through every night, and almost nobody on these sites has a tool to answer that.',
      story: [
        {
          title: 'A business plan that needed a working product',
          body: [
            'ACEP started as an entry to Ideanation, the business plan track of the IPB Business Plan Competition. The thesis was a SaaS model for remote industries moving off diesel – and a business plan about planning software is only as convincing as the planner behind it.',
            'ACEP is a two-person company, and as CTO the product side was mine: architecture, data model, the planning logic and the web app. Instead of mock-ups, the pitch was backed by a running prototype – accounts, a real database of equipment and storage, live forecasts and a dashboard a judge could click through. ACEP reached the final six.',
          ],
          pullQuote: 'Installing panels is easy. Knowing the power will still be there on a cloudy Thursday night is the product.',
        },
        {
          title: 'One honest rule, applied one day at a time',
          body: [
            'The planner deliberately uses a rule an operator can check by hand. For each day: if the battery alone covers the scheduled load, the day is safe. If it only works once that day\'s solar generation is added, it is a warning – the plan depends on the weather. If even both together fall short, the day is marked insufficient.',
            'What makes it useful is the carry-over. Whatever the battery holds at the end of one day, capped at its capacity, is what it starts the next with. A single overcast day rarely matters; three in a row is where a site goes dark, and the calendar shows that run of amber turning red before it happens.',
          ],
        },
        {
          title: 'Weather turns a static plan into a forecast',
          body: [
            'Hourly weather codes from Open-Meteo are grouped into days and translated into an expected generation level, from clear skies down to storms. That is what moves the calendar from "your system is sized correctly on average" to "next Tuesday is the day to cut non-essential load".',
            'An assistant connected through n8n sits on the dashboard for the questions a calendar cannot answer – what a status means, how to adjust a schedule – and every conversation is stored per user.',
          ],
        },
      ],
      decisions: [
        {
          decision: 'A transparent threshold rule instead of an opaque model',
          why: 'Operators who have relied on diesel for years will not trust a black box with their power supply. Safe, warning and insufficient are defined by comparisons they can redo on paper: storage against load, then storage plus generation against load.',
          tradeoff:
            'It ignores intra-day timing – a battery that is full at noon but empty at 3 a.m. still reads as one daily total.',
        },
        {
          decision: 'Battery state carried across days',
          why: 'Energy shortfalls are cumulative. Simulating each day from the previous day\'s ending charge is what exposes the multi-day cloudy spells that actually cause outages.',
          tradeoff: 'A wrong assumption early in the window compounds through every day after it.',
        },
        {
          decision: 'Open-Meteo for the 14-day forecast',
          why: 'Free, key-less and global, with hourly weather codes for any coordinate – which matters when the sites are remote islands rather than cities.',
          tradeoff:
            'Weather codes are a coarse proxy for solar irradiance, so expected generation is banded rather than physically modelled.',
        },
        {
          decision: 'Supabase for auth and data, n8n for the assistant',
          why: 'In a competition timeline, accounts, row-level data per user and a hosted Postgres come for free, and the AI assistant can be iterated in a workflow tool without redeploying the web app.',
          tradeoff:
            'The assistant\'s behaviour lives outside the repository, so it is versioned separately from the code that calls it.',
        },
      ],
      results: [
        'Top 6 finalist, Ideanation – IPB Business Plan Competition 2026.',
        'Working prototype live at acep-prototype.vercel.app, with a one-click demo account for judges.',
        'Equipment loads, solar generators and battery storage managed per user, backed by Supabase.',
        'Day-by-day energy calendar for the next 14 days, driven by live Open-Meteo forecasts.',
        'Built-in Indonesian-language AI assistant, connected through n8n, with stored chat history.',
        'The business plan projected up to 60% lower operating costs and up to 75% lower emissions for a site moving from diesel to planned solar.',
      ],
      reflection:
        'Building the prototype changed the pitch. Once judges could watch a cloudy week turn the calendar from green to red, the business case did not need to be argued – it was on the screen. The next step would be to replace weather-code bands with irradiance data and hourly simulation, so the planner can say not just which day is at risk, but which hour.',
    },
  },

  {
    slug: 'robot-tutor-rl',
    name: 'Optimizing Robot Tutor Strategies',
    year: '2026',
    role: 'Researcher – Universitas Indonesia',
    status: 'research',
    featured: false,
    order: 5,
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
      title: 'RobotTutor-v2 – the environment and the trained policies',
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
            "Most of the work went into RobotTutor-v2 – a 1,440-state MDP wrapped as a Gymnasium environment. Making it Stable-Baselines3 compatible meant four algorithms could be compared without writing four training loops, and it leaves behind something someone else can run.",
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
          why: 'A single run of a single algorithm proves nothing in RL – variance across seeds is often larger than the gap between methods.',
          tradeoff: 'Considerably more compute, for a result that is a comparison rather than one trained model.',
        },
      ],
      results: [
        'A 1,440-state MDP over a 24-hour clock, learner proficiency, fatigue and engagement.',
        'RobotTutor-v2 – a reusable Gymnasium environment, compatible with Stable-Baselines3.',
        'DQN, PPO, TRPO and SAC benchmarked across independent seeds.',
        'Soft Actor-Critic produced the best policy, reaching a 100% expert-proficiency rate and clearly beating random and fixed-schedule baselines.',
      ],
      reflection:
        'The environment turned out to be the contribution. Once the MDP was honest about fatigue and engagement the algorithm comparison almost ran itself – and the fact that a continuous-control method won on a discretised problem is the part I would want to interrogate next.',
    },
  },

  {
    slug: 'handlerindonesia',
    name: 'HandlerIndonesia',
    year: '2025',
    role: 'Engineer',
    status: 'live',
    featured: false,
    order: 6,
    oneLiner: 'An export-facilitation platform helping Indonesian MSMEs reach buyers outside the country.',
    outcome:
      'Top 50 Finalist, 1000x Innovation Challenge – Marvin Foundation with Universitas Indonesia and DSX Ventures.',
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
    order: 7,
    oneLiner: 'A small Go service for automating outbound email as part of a larger workflow.',
    outcome: 'Written to remove a manual step that kept reappearing across projects.',
    stack: ['Go'],
    categories: ['Backend & cloud'],
    links: {},
  },

  {
    slug: 'vicoworks',
    name: 'Vicoworks',
    year: '2025 – 2026',
    role: 'Designer & engineer',
    status: 'live',
    featured: false,
    order: 8,
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
