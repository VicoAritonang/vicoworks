import type { ReactNode } from 'react';

/*
 * A deliberately small Markdown renderer for blog posts: headings, paragraphs,
 * lists, block quotes, fenced code, images, horizontal rules, and inline
 * bold / italic / code / links. Enough for writing; no dependency.
 */

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const key = `${keyBase}-${k++}`;
    if (m[1]) out.push(<code key={key} className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[0.88em]">{t.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={key} className="font-semibold text-foreground">{t.slice(2, -2)}</strong>);
    else if (m[3]) out.push(<em key={key}>{t.slice(1, -1)}</em>);
    else {
      const [, label, href] = t.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      const ext = /^https?:/.test(href);
      out.push(
        <a key={key} href={href} className="text-indigo-600 underline underline-offset-4 dark:text-indigo-300" {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {label}
        </a>
      );
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const k = `b${key++}`;

    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++;
      blocks.push(
        <figure key={k} className="my-6 overflow-hidden rounded-xl bg-neutral-950 ring-1 ring-line">
          {lang && <figcaption className="border-b border-white/10 px-4 py-2 font-mono text-[10px] tracking-widest text-white/50 uppercase">{lang}</figcaption>}
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-neutral-200">
            <code>{code.join('\n')}</code>
          </pre>
        </figure>
      );
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const cls =
        level <= 2 ? 'mt-12 mb-4 font-display text-3xl text-foreground' : 'mt-8 mb-3 font-display text-2xl text-foreground';
      blocks.push(level <= 2 ? <h2 key={k} className={cls}>{inline(h[2], k)}</h2> : <h3 key={k} className={cls}>{inline(h[2], k)}</h3>);
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      blocks.push(<hr key={k} className="my-10 border-line" />);
      i++;
      continue;
    }
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      blocks.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img key={k} src={img[2]} alt={img[1]} className="my-6 w-full rounded-xl ring-1 ring-line" />
      );
      i++;
      continue;
    }
    if (line.startsWith('>')) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) q.push(lines[i++].replace(/^>\s?/, ''));
      blocks.push(
        <blockquote key={k} className="my-6 border-l-2 border-indigo-400 pl-5 font-serif text-2xl italic text-foreground/80">
          {inline(q.join(' '), k)}
        </blockquote>
      );
      continue;
    }
    if (/^(\s*[-*]|\s*\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(\s*[-*]|\s*\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^(\s*[-*]|\s*\d+\.)\s+/, ''));
      const Tag = ordered ? 'ol' : 'ul';
      blocks.push(
        <Tag key={k} className={`my-5 flex flex-col gap-2 pl-6 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-indigo-400`}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, `${k}-${j}`)}</li>
          ))}
        </Tag>
      );
      continue;
    }
    const para: string[] = [];
    /* Always consume the current line, so an unmatched block-like line (say,
       an image with text after it) becomes a paragraph instead of a hang. */
    para.push(lines[i++]);
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>|\s*[-*]\s|\s*\d+\.\s|!\[)/.test(lines[i])) para.push(lines[i++]);
    blocks.push(
      <p key={k} className="my-5">
        {inline(para.join(' '), k)}
      </p>
    );
  }

  return <div className="text-lg leading-relaxed font-light text-neutral-700 dark:text-neutral-300">{blocks}</div>;
}
