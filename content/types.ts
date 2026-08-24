/* =========================================================================
   CONTENT MODEL
   -------------------------------------------------------------------------
   The site's copy lives in `content/`, not in a database. Two reasons:

     - Rendering must never depend on a network call. A portfolio that shows
       "connecting..." to the one recruiter who opened it has failed at the
       only job it has.
     - Case studies are prose with structure. Prose belongs in version
       control, next to the code it describes.

   Supabase survives for the two things that are genuinely dynamic — the
   visitor and like counters — and nothing else.
   ========================================================================= */

/** What a node *is*, which decides how the diagram draws it. */
export type NodeKind =
  | 'input'    // something the user hands the system
  | 'service'  // managed/hosted infrastructure
  | 'compute'  // code we wrote, running
  | 'model'    // an LLM or a learned policy
  | 'store'    // state that outlives a request
  | 'output';  // what comes back out

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  /** Grid position. Column is the direction of flow; row is parallelism. */
  col: number;
  row: number;
  kind?: NodeKind;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  /** Dashed reads as "occasional" — a scheduler, a retry, a side channel. */
  dashed?: boolean;
  /** Backward edges route below the grid instead of through it. */
  route?: 'auto' | 'under';
}

/** One node of the simplified spine drawn on the homepage. */
export interface SpineNode {
  label: string;
  sublabel?: string;
  kind?: NodeKind;
}

export interface DiagramSpec {
  caption: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** Ordered node ids the accent pulse travels along, once, on scroll-in. */
  flow: string[];
  /** Homepage version: four or five nodes, laid out as a single row. */
  spine: SpineNode[];
}

/* ---------- Video ----------
   A demo carries more than any paragraph can: the thing running, narrated by
   the person who built it. The page renders a facade first and only mounts
   YouTube's iframe once someone asks for it — so a case study costs nothing
   to load for a reader who came for the writing. */
export interface ProjectVideo {
  /** The `v=` id, not the full URL. */
  youtubeId: string;
  /** Used as the iframe title and the facade's accessible name. */
  title: string;
  /** One line under the player: what the reader is about to watch. */
  caption?: string;
  /** Marks a stand-in reel. Surfaced in development only, never in a build. */
  placeholder?: boolean;
}

/* ---------- Story ----------
   The narrative half of a case study: how the thing came to exist, what went
   wrong, what changed because of it. `decisions` below stays the technical
   half — this is deliberately the part written in first person. */
export interface StoryChapter {
  title: string;
  /** One entry per paragraph. */
  body: string[];
  /** Optional line lifted out at display size. Use sparingly — at most one
      per case study, or it stops reading as emphasis. */
  pullQuote?: string;
}

export type ProjectStatus = 'live' | 'in-development' | 'research' | 'archived';

export interface Decision {
  decision: string;
  why: string;
  tradeoff: string;
}

export interface CaseStudy {
  whatItIs: string;
  problem: string;
  /** The narrative. Rendered as numbered chapters before the architecture. */
  story?: StoryChapter[];
  decisions: Decision[];
  /** Strings beginning with `TODO(` are skipped at render time — see
      `publishable()` below. Gaps stay visible in the file, never on the site. */
  results: string[];
  reflection: string;
}

export interface Project {
  slug: string;
  name: string;
  year: string;
  role: string;
  status: ProjectStatus;
  /** Appears in "Selected work" on the homepage. */
  featured: boolean;
  /** Curated order. Deliberately not a popularity count. */
  order: number;
  oneLiner: string;
  outcome: string;
  stack: string[];
  categories: string[];
  links: { live?: string; repo?: string; demo?: string; paper?: string };
  video?: ProjectVideo;
  diagram?: DiagramSpec;
  /** Absent means no detail page — the card links straight out instead. */
  caseStudy?: CaseStudy;
}

export interface SkillLayer {
  id: string;
  name: string;
  summary: string;
  items: string[];
  /** Every layer has to point at something that proves it. */
  proof: { label: string; slug?: string; href?: string }[];
}

/** Drops unfilled `TODO(...)` placeholders so a gap can never reach the page. */
export function publishable(lines: string[]): string[] {
  return lines.filter((line) => !line.trimStart().startsWith('TODO('));
}

/**
 * What the client-side project index actually needs.
 *
 * The index used to receive whole `Project` objects, which meant React
 * serialised every case study — decisions, reflections and unfilled
 * `TODO(vico)` notes — into the HTML of /projects as flight data. Invisible on
 * screen, fully present in view-source. Projecting to this keeps unpublished
 * notes out of the page and the payload small.
 */
export interface ProjectSummary {
  slug: string;
  name: string;
  year: string;
  status: ProjectStatus;
  oneLiner: string;
  stack: string[];
  categories: string[];
  links: { live?: string; repo?: string; paper?: string };
  /** Only what a still needs — the id and a name. The caption and the rest of
      the video record stay on the server. */
  video?: Pick<ProjectVideo, 'youtubeId' | 'title'>;
  hasCaseStudy: boolean;
}

export function toSummary(project: Project): ProjectSummary {
  return {
    slug: project.slug,
    name: project.name,
    year: project.year,
    status: project.status,
    oneLiner: project.oneLiner,
    stack: project.stack,
    categories: project.categories,
    links: {
      live: project.links.live,
      repo: project.links.repo,
      paper: project.links.paper,
    },
    video: project.video && {
      youtubeId: project.video.youtubeId,
      title: project.video.title,
    },
    hasCaseStudy: Boolean(project.caseStudy),
  };
}
