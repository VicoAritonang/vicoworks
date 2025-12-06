'use client';

import { HomeViewData } from '@/lib/data';
import { motion } from 'framer-motion';
import { Code2, Github, Terminal } from 'lucide-react';

interface SkillsProps {
  data: HomeViewData;
}

export function Skills({ data }: SkillsProps) {
  const skills = data.skill?.split(';') || [];

  return (
    <section className="py-12 sm:py-16 md:py-24 relative z-10 overflow-hidden bg-black/20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02020a]/80 to-transparent z-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-start">
          {/* Left: Title & GitHub CTA */}
          <div className="w-full md:w-1/3 space-y-6 sm:space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <Terminal className="text-purple-500 shrink-0" size={32} />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                  Skills
                </span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed border-l-2 border-purple-500/30 pl-3 sm:pl-4">
                My technical arsenal and capabilities. Constantly learning and upgrading my AI Engineering pathway.
              </p>
            </motion.div>

            {data.Github && (
              <motion.a
                href={data.Github}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 hover:border-cyan-500/50 transition-all"
              >
                <div className="p-2 sm:p-3 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 transition-colors shrink-0">
                  <Github size={20} className="sm:w-6 sm:h-6 text-gray-300 group-hover:text-cyan-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs sm:text-sm text-gray-400">Source Code</div>
                  <div className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-400 transition-colors">
                    View on GitHub
                  </div>
                </div>
                <Code2 size={14} className="sm:w-4 sm:h-4 ml-auto text-gray-600 group-hover:text-cyan-500 shrink-0" />
              </motion.a>
            )}
          </div>

          {/* Right: Skill Grid */}
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(6, 182, 212, 0.5)' }}
                className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between min-h-[90px] sm:min-h-[100px] group cursor-default hover:bg-white/10 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-600 group-hover:bg-cyan-500 transition-colors" />
                  <span className="text-[9px] sm:text-[10px] font-mono text-gray-600 group-hover:text-cyan-500/50">
                     0{index + 1}
                  </span>
                </div>
                <span className="font-medium text-sm sm:text-base text-gray-200 group-hover:text-white">
                  {skill.trim()}
                </span>
                <div className="w-full h-[2px] bg-gray-800 mt-2 sm:mt-3 overflow-hidden rounded-full">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
