import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vicoworks.com';
  
  // Get projects for dynamic sitemap
  const projects = await getProjects();
  
  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects`,
    lastModified: project.finishedAt ? new Date(project.finishedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectUrls,
  ];
}

