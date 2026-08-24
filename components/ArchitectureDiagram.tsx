'use client';

import { useId, useRef } from 'react';
import { useInView } from 'framer-motion';
import type { DiagramEdge, DiagramNode, DiagramSpec, NodeKind, SpineNode } from '@/content/types';

/* =========================================================================
   ARCHITECTURE DIAGRAM
   -------------------------------------------------------------------------
   Drawn from the spec in content/projects.ts rather than exported from a
   drawing tool, which means a diagram cannot drift out of date with the text
   beside it, and both themes get the right colours for free.

   Grammar, deliberately narrow:
     - column  = direction of flow, row = things happening in parallel
     - pill    = something entering or leaving the system
     - rect    = a component inside it
     - dashed  = an occasional path (a scheduler, a side channel)
     - accent  = the one route a single request actually takes, animated once

   No colour carries meaning beyond that last line.
   ========================================================================= */

type Pt = { x: number; y: number };

/* Sized so the widest diagram (Datafact, six columns) fits the case-study
   column without clipping: 6*132 + 5*44 = 1012, inside a max-w-5xl page. */
const GEO = {
  full: { w: 132, h: 58, gx: 44, gy: 30 },
  spine: { w: 150, h: 56, gx: 46, gy: 0 },
} as const;

/** Long strings step down rather than overflowing their box. */
function labelSize(text: string): number {
  if (text.length > 21) return 10.5;
  if (text.length > 17) return 11.5;
  return 13;
}

function sublabelSize(text: string): number {
  return text.length > 18 ? 8.5 : 9.5;
}

/**
 * Label the longest straight run of an edge. Using the middle *point* put the
 * text on a corner, which for elbowed edges landed it on top of a neighbouring
 * wire.
 */
function labelAnchor(points: Pt[]): Pt {
  let best = 0;
  let bestLength = -1;

  for (let i = 0; i < points.length - 1; i++) {
    const length = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
    if (length > bestLength) {
      bestLength = length;
      best = i;
    }
  }

  return {
    x: (points[best].x + points[best + 1].x) / 2,
    y: (points[best].y + points[best + 1].y) / 2,
  };
}

const PAD = 3; // room for the stroke of an edge node's border

/** Ports. Flow is left-to-right, so those are the default faces. */
const rightOf = (n: Pt, w: number, h: number): Pt => ({ x: n.x + w, y: n.y + h / 2 });
const leftOf = (n: Pt, _w: number, h: number): Pt => ({ x: n.x, y: n.y + h / 2 });
const topOf = (n: Pt, w: number): Pt => ({ x: n.x + w / 2, y: n.y });
const bottomOf = (n: Pt, w: number, h: number): Pt => ({ x: n.x + w / 2, y: n.y + h });

/**
 * Orthogonal elbow with rounded corners. Straight segments read as circuitry;
 * curves everywhere would read as decoration.
 */
function roundedPath(points: Pt[], r = 10): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const corner = points[i];
    const next = points[i + 1];

    const inLen = Math.hypot(corner.x - prev.x, corner.y - prev.y);
    const outLen = Math.hypot(next.x - corner.x, next.y - corner.y);
    const radius = Math.min(r, inLen / 2, outLen / 2);

    const entry: Pt = {
      x: corner.x - ((corner.x - prev.x) / (inLen || 1)) * radius,
      y: corner.y - ((corner.y - prev.y) / (inLen || 1)) * radius,
    };
    const exit: Pt = {
      x: corner.x + ((next.x - corner.x) / (outLen || 1)) * radius,
      y: corner.y + ((next.y - corner.y) / (outLen || 1)) * radius,
    };

    d += ` L ${entry.x} ${entry.y} Q ${corner.x} ${corner.y} ${exit.x} ${exit.y}`;
  }

  const last = points[points.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

type Layout = {
  nodes: (DiagramNode & { x: number; y: number })[];
  byId: Map<string, DiagramNode & { x: number; y: number }>;
  width: number;
  height: number;
  w: number;
  h: number;
  underY: number;
};

function layout(nodes: DiagramNode[], variant: 'full' | 'spine', hasUnder: boolean): Layout {
  const { w, h, gx, gy } = GEO[variant];
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;

  const placed = nodes.map((n) => ({
    ...n,
    x: PAD + n.col * (w + gx),
    y: PAD + n.row * (h + gy),
  }));

  const gridHeight = rows * h + (rows - 1) * gy;
  const underY = PAD + gridHeight + 26;

  return {
    nodes: placed,
    byId: new Map(placed.map((n) => [n.id, n])),
    width: cols * w + (cols - 1) * gx + PAD * 2,
    height: (hasUnder ? underY + 14 : PAD + gridHeight) + PAD,
    w,
    h,
    underY,
  };
}

/** Where an edge goes, expressed as the corner points it passes through. */
function routeEdge(edge: DiagramEdge, L: Layout): Pt[] {
  const from = L.byId.get(edge.from);
  const to = L.byId.get(edge.to);
  if (!from || !to) return [];

  const { w, h } = L;

  if (edge.route === 'under' || to.col < from.col) {
    const start = bottomOf(from, w, h);
    const end = bottomOf(to, w, h);
    return [start, { x: start.x, y: L.underY }, { x: end.x, y: L.underY }, end];
  }

  if (to.col === from.col) {
    return to.row > from.row
      ? [bottomOf(from, w, h), topOf(to, w)]
      : [topOf(from, w), bottomOf(to, w, h)];
  }

  const start = rightOf(from, w, h);
  const end = leftOf(to, w, h);
  if (from.row === to.row) return [start, end];

  const midX = (start.x + end.x) / 2;
  return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
}

/** Concatenates the flow into one continuous path for the accent pulse. */
function flowPath(flow: string[], edges: DiagramEdge[], L: Layout): string {
  const points: Pt[] = [];

  for (let i = 0; i < flow.length - 1; i++) {
    const edge =
      edges.find((e) => e.from === flow[i] && e.to === flow[i + 1]) ??
      ({ from: flow[i], to: flow[i + 1] } as DiagramEdge);
    const segment = routeEdge(edge, L);
    if (!segment.length) continue;
    points.push(...(points.length ? segment.slice(1) : segment));
  }

  return roundedPath(points);
}

/** Input and output are pills; everything inside the system is a rectangle. */
function radiusFor(kind: NodeKind | undefined, h: number): number {
  return kind === 'input' || kind === 'output' ? h / 2 : 9;
}

function Node({
  node,
  w,
  h,
}: {
  node: { label: string; sublabel?: string; kind?: NodeKind; x: number; y: number };
  w: number;
  h: number;
}) {
  const size = labelSize(node.label);
  const hasSub = Boolean(node.sublabel);

  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={w}
        height={h}
        rx={radiusFor(node.kind, h)}
        fill="var(--node-bg)"
        stroke="var(--node-line)"
        strokeWidth={1}
      />
      <text
        x={node.x + w / 2}
        y={node.y + (hasSub ? h / 2 - 5 : h / 2)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size}
        fontWeight={500}
        fill="var(--fg)"
        className="font-sans"
      >
        {node.label}
      </text>
      {hasSub && (
        <text
          x={node.x + w / 2}
          y={node.y + h / 2 + 11}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={sublabelSize(node.sublabel!)}
          fill="var(--muted)"
          className="font-mono"
        >
          {node.sublabel}
        </text>
      )}
    </g>
  );
}

interface Props {
  spec: DiagramSpec;
  variant?: 'full' | 'spine';
  /** The homepage spine sits under left-aligned copy, so centring it there
      reads as a floating object rather than as part of the entry. */
  align?: 'center' | 'start';
  /** Shown under the drawing. The spine version usually suppresses it. */
  showCaption?: boolean;
  className?: string;
}

export function ArchitectureDiagram({
  spec,
  variant = 'full',
  align = 'center',
  showCaption = variant === 'full',
  className = '',
}: Props) {
  const uid = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  // false on the server and on the first client render, so hydration matches.
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const isSpine = variant === 'spine';

  // The spine is the same story told in four boxes: relaid out as one row.
  const nodes: DiagramNode[] = isSpine
    ? spec.spine.map((n: SpineNode, i) => ({ id: `s${i}`, ...n, col: i, row: 0 }))
    : spec.nodes;

  const edges: DiagramEdge[] = isSpine
    ? spec.spine.slice(0, -1).map((_, i) => ({ from: `s${i}`, to: `s${i + 1}` }))
    : spec.edges;

  const flow = isSpine ? nodes.map((n) => n.id) : spec.flow;

  const hasUnder = edges.some((e) => e.route === 'under');
  const L = layout(nodes, variant, hasUnder);
  const pulse = flowPath(flow, edges, L);

  return (
    <figure className={className} ref={ref}>
      <div className={`scroll-x ${align === 'start' ? 'scroll-x-end' : ''}`}>
        <svg
          width={L.width}
          height={L.height}
          viewBox={`0 0 ${L.width} ${L.height}`}
          className={`block max-w-none ${align === 'center' ? 'mx-auto' : ''}`}
          role="img"
          aria-label={spec.caption}
        >
          <title>{spec.caption}</title>
          <defs>
            <marker
              id={`arrow-${uid}`}
              viewBox="0 0 8 8"
              refX={7}
              refY={4}
              markerWidth={6}
              markerHeight={6}
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--wire)" />
            </marker>
          </defs>

          {/* Every connection, at rest */}
          {edges.map((edge, i) => {
            const points = routeEdge(edge, L);
            if (!points.length) return null;
            const mid = labelAnchor(points);
            return (
              <g key={`${edge.from}-${edge.to}-${i}`}>
                <path
                  d={roundedPath(points)}
                  fill="none"
                  stroke="var(--wire)"
                  strokeWidth={1.25}
                  strokeDasharray={edge.dashed ? '4 4' : undefined}
                  markerEnd={`url(#arrow-${uid})`}
                  opacity={edge.dashed ? 0.7 : 1}
                />
                {edge.label && (
                  <text
                    x={mid.x}
                    y={mid.y - 8}
                    textAnchor="middle"
                    fontSize={9.5}
                    fill="var(--faint)"
                    className="font-mono"
                    stroke="var(--bg)"
                    strokeWidth={4}
                    paintOrder="stroke"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* The one route a request takes. Runs once, on scroll-in — and
              under prefers-reduced-motion it is a plain marked path instead.
              Both cases are the same element with the same attributes; only a
              class differs, so the server and client trees agree. */}
          {pulse && (
            <path
              d={pulse}
              className={`flow ${inView ? 'flow-run' : ''}`}
              style={{ animationDuration: isSpine ? '1.6s' : '2.4s' }}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
            />
          )}

          {L.nodes.map((node) => (
            <Node key={node.id} node={node} w={L.w} h={L.h} />
          ))}
        </svg>
      </div>

      {showCaption && (
        <figcaption className="mt-4 max-w-2xl text-sm text-muted">{spec.caption}</figcaption>
      )}
    </figure>
  );
}
