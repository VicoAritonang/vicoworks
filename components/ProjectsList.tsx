'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { ProjectData } from '@/lib/data';
import { ProjectCard } from './ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';

interface ProjectsListProps {
  projects: ProjectData[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const searchRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to jump into search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (e.key === '/' && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
      const name = project.projectName?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
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
        <div className="relative p-3 sm:p-4 rounded-[12px] bg-background/95 backdrop-blur-md border border-hairline space-y-3 sm:space-y-4 overflow-hidden">

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search projects by name...  [ / ]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-hairline rounded-[8px] py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 text-sm sm:text-base text-foreground placeholder-muted-2 focus:outline-none focus:border-accent transition-colors"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-2 hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            <Filter size={14} className="text-accent shrink-0 mr-1 sm:mr-2" />
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-3 sm:px-4 py-1.5 rounded-[8px] font-mono text-[11px] sm:text-xs tracking-[0.08em] whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'text-accent-ink'
                    : 'border border-hairline text-muted hover:text-foreground hover:border-white/40'
                }`}
              >
                {selectedCategory === category && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 rounded-[8px] bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>

          {/* Result count */}
          <div className="font-mono text-[10px] sm:text-xs text-muted-2 tracking-widest flex items-center gap-2">
            <span className="w-1 h-1 bg-success" aria-hidden="true" />
            QUERY_RESULT: {filteredProjects.length} / {projects.length} PROJECT{projects.length !== 1 ? 'S' : ''}
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="space-y-16 sm:space-y-20 md:space-y-24 py-6 sm:py-10">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  featured={index === 0 && selectedCategory === 'All' && !searchQuery}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 sm:py-20"
            >
              <motion.div
                className="text-4xl sm:text-6xl mb-4"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                🔍
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 font-mono">NO_SIGNAL_FOUND</h3>
              <p className="text-sm sm:text-base text-muted mb-6">Try adjusting your search criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-5 py-2 rounded-[8px] border border-hairline text-accent hover:border-accent transition-colors text-sm font-mono"
              >
                RESET_FILTERS
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
