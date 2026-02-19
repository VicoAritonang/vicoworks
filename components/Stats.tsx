'use client';

import { StatisticsData } from '@/lib/data';
import { motion } from 'framer-motion';
import { Server, FolderGit2 } from 'lucide-react';
import Link from 'next/link';

interface StatsProps {
  data: StatisticsData;
}

export function Stats({ data }: StatsProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Visitor Count */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-xl group-hover:bg-cyan-500/20 transition-colors" />
            <div className="relative p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-black/40 backdrop-blur-md flex items-center gap-4 sm:gap-6 hover:border-cyan-500/60 transition-all cursor-default">
              <div className="p-3 sm:p-4 rounded-full bg-cyan-500/10 text-cyan-400 shrink-0">
                <Server size={24} className="sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0">
                <div className="text-3xl sm:text-4xl font-bold text-white font-mono">
                  {data.system_in_production?.toLocaleString()}
                </div>
                <div className="text-cyan-400/70 text-xs sm:text-sm uppercase tracking-wider">System in Production</div>
              </div>
            </div>
          </motion.div>

          {/* Project Count - Clickable Link to /projects */}
          <Link href="/projects" className="block">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur-xl group-hover:bg-purple-500/30 transition-colors" />
              <div className="relative p-6 sm:p-8 rounded-2xl border border-purple-500/30 bg-black/40 backdrop-blur-md flex items-center gap-4 sm:gap-6 hover:border-purple-500/80 transition-all group-hover:scale-[1.02]">
                <div className="p-3 sm:p-4 rounded-full bg-purple-500/10 text-purple-400 group-hover:text-purple-300 transition-colors shrink-0">
                  <FolderGit2 size={24} className="sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-3xl sm:text-4xl font-bold text-white font-mono group-hover:text-purple-200 transition-colors">
                    {data.project_count?.toLocaleString()}
                  </div>
                  <div className="text-purple-400/70 text-xs sm:text-sm uppercase tracking-wider group-hover:text-purple-300">
                    Projects
                  </div>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-purple-500 text-xs sm:text-sm shrink-0 hidden sm:block">
                  View All →
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
