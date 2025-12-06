'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { HomeViewData } from '@/lib/data';
import { ScrambleText } from './ScrambleText';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  data: HomeViewData;
}

export function Hero({ data }: HeroProps) {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 300], [0, 100]);
  const yImage = useTransform(scrollY, [0, 300], [0, 50]);
  
  const cores = data.core?.split(';') || [];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative pt-16 sm:pt-20 pb-10 overflow-hidden px-4" aria-label="Hero Section">
      {/* Decoration Elements */}
      <div className="absolute top-16 sm:top-20 right-4 sm:right-10 text-cyan-500/20 font-mono text-[10px] sm:text-xs flex flex-col gap-1 hidden md:flex select-none" aria-hidden="true">
        <span>SYS.STATUS: ONLINE</span>
        <span>SEC.LEVEL: MAX</span>
        <span>TARGET: PORTFOLIO</span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
        <motion.div 
          style={{ y: yText }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left space-y-4 sm:space-y-6 relative w-full"
        >
          <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-sm bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-mono tracking-widest mb-3 sm:mb-4" aria-label="System Status">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-pulse" aria-hidden="true" />
            SYSTEM DETECTED
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white font-mono">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl block text-gray-400 font-sans mb-1 sm:mb-2">Hello, I'm</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              <ScrambleText text="Vico Aritonang" delay={500} />
            </span>
          </h1>
          
          <div className="flex flex-wrap gap-2 sm:gap-3" role="list" aria-label="Core Competencies">
            {cores.map((core, index) => (
              <motion.span 
                key={index}
                role="listitem"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.5 + (index * 0.1) }}
                className="px-2 sm:px-4 py-1 relative group overflow-hidden rounded border border-cyan-500/30 bg-black/50 text-cyan-300 text-xs sm:text-sm font-mono cursor-default"
              >
                <span className="relative z-10">&lt;{core.trim()} /&gt;</span>
                <span className="absolute inset-0 bg-cyan-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" aria-hidden="true" />
              </motion.span>
            ))}
          </div>

          <div className="relative">
            {/* Decorative corner brackets */}
            <div className="absolute -top-2 -left-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-cyan-500/50" aria-hidden="true" />
            <div className="absolute -bottom-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-cyan-500/50" aria-hidden="true" />
            
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl backdrop-blur-sm bg-black/20 p-4 sm:p-6 border-l-2 border-cyan-500/30 bg-gradient-to-r from-cyan-900/10 to-transparent">
              {data.overview}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 sm:pt-4">
             <Link 
                href="/projects" 
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider rounded overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-fit text-sm sm:text-base"
                aria-label="View all AI engineering projects"
             >
                <span className="relative z-10">VIEW_ALL_PROJECTS</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={18} aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
             </Link>
          </div>
        </motion.div>

        <motion.div 
          style={{ y: yImage }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center group w-full mt-8 md:mt-0"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96" aria-label="Profile Image">
            {/* HUD Rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_10s_linear_infinite]" aria-hidden="true" />
            <div className="absolute -inset-2 sm:-inset-4 rounded-full border border-dashed border-purple-500/20 animate-[spin_20s_linear_infinite_reverse]" aria-hidden="true" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-2xl" aria-hidden="true" />
            
            {/* Tech Markers */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 sm:h-4 bg-cyan-500/50" aria-hidden="true" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 sm:h-4 bg-cyan-500/50" aria-hidden="true" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-1 bg-cyan-500/50" aria-hidden="true" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-1 bg-cyan-500/50" aria-hidden="true" />

            {data.image_url ? (
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-black">
                <img 
                  src={data.image_url} 
                  alt="Vico Aritonang - AI Engineer and Software Developer" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                  width={384}
                  height={384}
                  loading="eager"
                />
                {/* Scanner Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-[20%] w-full pointer-events-none"
                  animate={{ top: ['-20%', '120%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                />
                {/* Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" aria-hidden="true" />
              </div>
            ) : (
               <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-gray-500 border border-cyan-500/30 text-xs sm:text-sm" aria-label="No profile image available">
                 <span className="animate-pulse">NO_IMAGE_DATA</span>
               </div>
            )}
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan-500/50 hidden sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        aria-hidden="true"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Scroll to initialize</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500/0 via-cyan-500 to-cyan-500/0 animate-pulse" />
      </motion.div>
    </section>
  );
}
