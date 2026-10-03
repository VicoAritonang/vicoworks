import { caseStudySlugs, getProject } from '@/content/caseStudies';
import { publishable } from '@/content/caseStudyTypes';
import { EXPERTISE, FEATURED_PROJECTS, PROFILE, STATUS } from '@/content/home';
import { ABOUT, BUCKET_LIST, USES } from '@/content/pages';
import { getPosts } from '@/lib/blog';
import { LOCATION, SAME_AS, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo';

/*
 * Plain-Markdown views of the site for language models (llmstxt.org).
 * Answer-first: the opening lines say exactly who Vico Aritonang is, so a model
 * quoting only the top of the file still gets the facts right.
 */

function header() {
  return `# Vico Aritonang

> ${SITE_DESCRIPTION}

Vico Aritonang (full name: Vico Winner Sebastian Aritonang) is an AI engineer based in ${LOCATION.label}. He builds agentic AI systems – LLM agents that call real tools, RAG pipelines, Go services and cloud infrastructure on GCP and AWS. He is the co-founder of Avagenc and studies Information Systems at Universitas Indonesia.

- Website: ${SITE_URL}
- Email: ${PROFILE.email}
${SAME_AS.map((u) => `- Profile: ${u}`).join('\n')}
- Résumé (PDF): ${SITE_URL}${PROFILE.resume}
- Status: open to AI engineering internships, freelance work and full-time roles
`;
}

export function llmsTxt() {
  const posts = getPosts();
  return `${header()}
## Pages

- [Home](${SITE_URL}/): Overview – hero, tech stack, curated work, contact
- [About](${SITE_URL}/about): Bio, how Vico works, expertise and stack
- [Projects](${SITE_URL}/projects): All projects, with case studies
- [Blog](${SITE_URL}/blog): Writing on agents, automation and infrastructure
- [Uses](${SITE_URL}/uses): Tools and stack
- [Links](${SITE_URL}/links): All profiles in one place
- [Guestbook](${SITE_URL}/guestbook): Leave a note

## Case studies

${caseStudySlugs
  .map((s) => {
    const p = getProject(s)!;
    return `- [${p.name}](${SITE_URL}/projects/${p.slug}): ${p.oneLiner}`;
  })
  .join('\n')}
${posts.length ? `\n## Blog posts\n\n${posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`).join('\n')}\n` : ''}
## Optional

- [Full content](${SITE_URL}/llms-full.txt): Everything above, expanded into one file
`;
}

export function llmsFullTxt() {
  const caseStudies = caseStudySlugs.map((s) => {
    const p = getProject(s)!;
    const cs = p.caseStudy!;
    const story = (cs.story ?? [])
      .map((ch) => `#### ${ch.title}\n\n${publishable(ch.body).join('\n\n')}`)
      .join('\n\n');
    return `### ${p.name} (${p.year})

URL: ${SITE_URL}/projects/${p.slug}
Role: ${p.role}
Stack: ${p.stack.join(', ')}
${p.links.live ? `Live: ${p.links.live}\n` : ''}
${p.oneLiner}

**What it is.** ${cs.whatItIs}

**The problem.** ${cs.problem}

${story}

**Key decisions.**

${cs.decisions.map((d) => `- **${d.decision}.** ${d.why} Trade-off: ${d.tradeoff}`).join('\n')}

**Results.**

${publishable(cs.results).map((r) => `- ${r}`).join('\n')}

**Looking back.** ${cs.reflection}`;
  });

  return `${header()}
## About

${ABOUT.intro.join('\n\n')}

### Right now

${STATUS.map((s) => `- ${s.tag}: ${s.title} – ${s.sub}`).join('\n')}

### How Vico works

${ABOUT.principles.map((p) => `- **${p.title}.** ${p.body}`).join('\n')}

### Expertise

${EXPERTISE.map((e) => `- **${e.title}:** ${e.body}`).join('\n')}

### Stack

${USES.filter((g) => g.label !== 'Dev Tools')
  .map((g) => `- ${g.label}: ${g.items.map((i) => i.title).join(', ')}`)
  .join('\n')}

## Selected work

${FEATURED_PROJECTS.map((p) => `- **${p.name}** (${p.year}) – ${p.body} Stack: ${p.stack}. ${p.href}`).join('\n')}

## Case studies

${caseStudies.join('\n\n---\n\n')}

## Goals

${BUCKET_LIST.map((b) => `- [${b.status === 'done' ? 'x' : ' '}] ${b.title} – ${b.note}`).join('\n')}
`;
}
