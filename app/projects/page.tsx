import { getProjects } from '@/lib/data';
import { ProjectsList } from '@/components/ProjectsList';
import { BrainCursor } from '@/components/BrainCursor';
import { VisitorCounter } from '@/components/VisitorCounter';
import { AIBackgroundAnimations } from '@/components/AIBackgroundAnimations';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen relative font-sans bg-[#030305] overflow-hidden">
      <VisitorCounter />
      <AIBackgroundAnimations />
      <BrainCursor />

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors w-fit group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Archives</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              A collection of my work, experiments, and technological explorations. 
              Sorted by popularity.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <ProjectsList projects={projects} />
      </div>
    </main>
  );
}
