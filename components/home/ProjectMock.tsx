import type { ProjectMock as Kind } from '@/content/home';

/*
 * Hand-drawn UI sketches that stand in for project screenshots. They render as
 * a browser window that bleeds off the bottom of the gradient card.
 */

function Chrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-t-md border-2 border-b-0 border-white/50 bg-white text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.4),0_15px_50px_-5px_rgba(0,0,0,0.5)] lg:border-3">
      <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="mx-auto rounded-md bg-neutral-200/70 px-3 py-0.5 font-mono text-[9px] text-neutral-500">{url}</span>
      </div>
      <div className="h-[340px] p-4 text-[11px] sm:text-xs">{children}</div>
    </div>
  );
}

function ChatMock() {
  const apps = ['Gmail', 'Calendar', 'Contacts', 'Tuya', 'Spotify'];
  return (
    <Chrome url="avagenc.com">
      <div className="flex h-full gap-4">
        <div className="hidden w-32 shrink-0 flex-col gap-1.5 border-r border-neutral-100 pr-3 sm:flex">
          <div className="mb-1 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Connected</div>
          {apps.map((a) => (
            <div key={a} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-neutral-50">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {a}
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-sm bg-violet-600 px-3 py-2 text-white">
            Reply to Rani that I&apos;m in, then block 2 hours Friday for it
          </div>
          <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-neutral-100 px-3 py-2">
            <div className="mb-1.5 font-mono text-[9px] text-violet-600 uppercase">gmail-agent → calendar-agent</div>
            Sent the reply and booked <b>Fri 13:00–15:00</b>. Want a reminder?
          </div>
          <div className="ml-auto max-w-[60%] rounded-2xl rounded-br-sm bg-violet-600 px-3 py-2 text-white">
            Yes, and dim the office lights
          </div>
          <div className="flex max-w-[80%] items-center gap-2 rounded-2xl rounded-bl-sm bg-neutral-100 px-3 py-2">
            <span className="flex gap-0.5">
              <span className="size-1.5 animate-bounce rounded-full bg-neutral-400" />
              <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0.3s]" />
            </span>
            tuya-agent working…
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function FormMock() {
  const personas = ['Gen Z · Jakarta', 'Working parent', 'University student', 'SME owner'];
  return (
    <Chrome url="datafact.site">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2">
          <span className="font-mono text-[10px] text-neutral-400">URL</span>
          <span className="truncate text-neutral-600">docs.google.com/forms/d/1FAIpQL…/viewform</span>
          <span className="ml-auto rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] text-white">Parsed ✓</span>
        </div>
        <div>
          <div className="mb-1.5 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Persona</div>
          <div className="flex flex-wrap gap-1.5">
            {personas.map((p, i) => (
              <span
                key={p}
                className={`rounded-full border px-2.5 py-1 ${i === 0 ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-neutral-200'}`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-neutral-50 p-3">
          <div className="mb-2 flex justify-between">
            <span className="font-medium">Generating respondents</span>
            <span className="font-mono text-emerald-700">148 / 200</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full w-[74%] rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ['Lambda', '24 running'],
              ['Step Fn', 'fan-out'],
              ['Avg', '1.8s / resp'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md bg-white p-2 shadow-sm">
                <div className="font-mono text-[9px] text-neutral-400 uppercase">{k}</div>
                <div className="font-medium">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function MindmapMock() {
  const sources = [
    { x: 14, y: 18, label: 'Kominfo', v: 'refutes' },
    { x: 70, y: 12, label: 'Reuters', v: 'refutes' },
    { x: 8, y: 70, label: 'Forum post', v: 'supports' },
    { x: 74, y: 72, label: 'BI press', v: 'refutes' },
  ];
  return (
    <Chrome url="nusaverify.app">
      <div className="relative h-full">
        <svg className="absolute inset-0 size-full" aria-hidden="true">
          {sources.map((s) => (
            <line
              key={s.label}
              x1="50%"
              y1="45%"
              x2={`${s.x + 9}%`}
              y2={`${s.y + 5}%`}
              stroke={s.v === 'refutes' ? '#4f46e5' : '#f43f5e'}
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          ))}
        </svg>
        {sources.map((s) => (
          <div
            key={s.label}
            className="absolute rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 shadow-sm"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <div className="font-medium">{s.label}</div>
            <div className={`font-mono text-[9px] uppercase ${s.v === 'refutes' ? 'text-indigo-600' : 'text-rose-500'}`}>{s.v}</div>
          </div>
        ))}
        <div className="absolute top-[45%] left-1/2 w-44 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-indigo-600 p-3 text-center text-white shadow-lg">
          <div className="font-mono text-[9px] tracking-widest uppercase opacity-80">Verdict</div>
          <div className="text-lg font-semibold">82% Hoax</div>
          <div className="text-[10px] opacity-80">4 sources · weighted</div>
        </div>
      </div>
    </Chrome>
  );
}

function ExportMock() {
  const steps = [
    ['Product profile', 'done'],
    ['HS code & documents', 'done'],
    ['Certification check', 'active'],
    ['Buyer matching', 'todo'],
  ];
  return (
    <Chrome url="handlerindonesia.vercel.app">
      <div className="grid h-full grid-cols-5 gap-3">
        <div className="col-span-2 flex flex-col overflow-hidden rounded-lg border border-neutral-200">
          <div className="h-24 bg-[linear-gradient(135deg,#fdba74,#ea580c)]" />
          <div className="p-2.5">
            <div className="font-medium">Your product</div>
            <div className="font-mono text-[9px] text-neutral-400 uppercase">MSME · ready to export</div>
            <div className="mt-3 rounded-md bg-orange-600 px-2 py-1.5 text-center text-white">Start export →</div>
          </div>
        </div>
        <div className="col-span-3 flex flex-col gap-2">
          <div className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">Export readiness</div>
          {steps.map(([label, state]) => (
            <div
              key={label}
              className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 ${
                state === 'active' ? 'border-orange-500 bg-orange-50' : 'border-neutral-200'
              }`}
            >
              <span
                className={`grid size-4 shrink-0 place-items-center rounded-full text-[9px] text-white ${
                  state === 'done' ? 'bg-emerald-500' : state === 'active' ? 'bg-orange-500' : 'bg-neutral-300'
                }`}
              >
                {state === 'done' ? '✓' : ''}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

export function ProjectMock({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'chat':
      return <ChatMock />;
    case 'form':
      return <FormMock />;
    case 'mindmap':
      return <MindmapMock />;
    case 'export':
      return <ExportMock />;
  }
}
