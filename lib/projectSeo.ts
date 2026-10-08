import type { Metadata } from 'next';
import type { Project } from '@/content/caseStudyTypes';
import { FEATURED_PROJECTS } from '@/content/home';
import { projectSeo } from '@/content/projectSeo';
import { SITE_URL } from '@/lib/seo';

export function projectUrl(project: Pick<Project, 'slug'>) {
  return `${SITE_URL}/projects/${project.slug}`;
}

export function projectMetadata(project: Project): Metadata {
  const { title, description } = projectSeo[project.slug] ?? {
    title: `${project.name} | Vico Aritonang`,
    description: `${project.name} by Vico Aritonang. ${project.oneLiner}`,
  };
  const image = FEATURED_PROJECTS.find((p) => p.slug === project.slug)?.image;
  const images = [{
    url: image ? `${SITE_URL}${image}` : `${SITE_URL}/opengraph-image`,
    alt: image ? `${project.name} – screenshot of the live product` : 'Vico Aritonang – AI Engineer',
  }];

  return {
    // Avoid appending the root title template a second time.
    title: { absolute: title },
    description,
    alternates: { canonical: projectUrl(project) },
    openGraph: {
      type: 'article',
      title,
      description,
      url: projectUrl(project),
      siteName: 'Vicoworks – Vico Aritonang',
      locale: 'en_ID',
      authors: [SITE_URL],
      images,
    },
    // Otherwise the root homepage title/description are inherited here.
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

export function projectStructuredData(project: Project) {
  const url = projectUrl(project);
  const image = FEATURED_PROJECTS.find((p) => p.slug === project.slug)?.image;
  const person = { '@id': `${SITE_URL}/#vico` };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: `${project.name} – project by Vico Aritonang`,
        description: project.oneLiner,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        author: person,
        mainEntity: { '@id': `${url}#work` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': project.status === 'research' ? 'ScholarlyArticle' : 'CreativeWork',
        '@id': `${url}#work`,
        name: project.name,
        description: project.oneLiner,
        ...(project.caseStudy ? { abstract: project.caseStudy.whatItIs } : {}),
        url,
        mainEntityOfPage: { '@id': `${url}#page` },
        author: person,
        creator: person,
        temporalCoverage: project.year,
        keywords: [...project.stack, ...project.categories].join(', '),
        ...(project.links.live ? { sameAs: project.links.live } : {}),
        ...(image ? { image: `${SITE_URL}${image}` } : {}),
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Vico Aritonang', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
          { '@type': 'ListItem', position: 3, name: project.name, item: url },
        ],
      },
    ],
  };
}
