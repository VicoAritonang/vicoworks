'use client';

import { useState, useMemo } from 'react';
import { ProjectData } from '@/lib/data';
import { ProjectCard } from './ProjectCard';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

interface ProjectsListProps {
  projects: ProjectData[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract all unique categories
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(p => {
      p.category?.split(';').forEach(c => cats.add(c.trim()));
    });
    return ['All', ...Array.from(cats)];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Safe check for null values
      const name = project.projectName?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      // Only search in projectName as requested
      const matchesSearch = name.includes(query);
      
      const projectCategories = project.category?.split(';').map(c => c.trim()) || [];
      const matchesCategory = selectedCategory === 'All' || projectCategories.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Search & Filter Controls */}
      <div className="sticky top-16 sm:top-20 md:top-24 z-30 w-full max-w-4xl mx-auto px-4 sm:px-0">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-3 sm:space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            <Filter size={14} className="text-cyan-500 shrink-0 mr-1 sm:mr-2" />
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category 
                    ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white active:scale-95'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="space-y-16 sm:space-y-20 md:space-y-24 py-6 sm:py-10">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-20"
          >
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-sm sm:text-base text-gray-400">Try adjusting your search criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
