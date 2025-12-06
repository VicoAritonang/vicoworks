'use client';

import { ProjectData } from '@/lib/data';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Calendar, ExternalLink, Heart, Tag, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { incrementProjectLike } from '@/app/actions';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [likes, setLikes] = useState(project.like_count || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  
  // Mouse tracking for 3D effect - disable on mobile
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.8, 1, 1, 0.8]);

  const skills = project.skill?.split(';') || [];
  const categories = project.category?.split(';') || [];

  // Check if mobile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    
    setIsLiking(true);
    setLikes(prev => prev + 1);
    setHasLiked(true);

    const newCount = await incrementProjectLike(project.id);
    
    if (newCount === null) {
       setLikes(prev => prev - 1);
       setHasLiked(false);
    }
    
    setIsLiking(false);
  };

  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    
    try {
      if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(project.video_url);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, scale }}
      className="w-full max-w-6xl mx-auto mb-16 sm:mb-24 md:mb-32 last:mb-0 perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="relative group"
        style={!isMobile ? {
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        } : {}}
      >
        {/* Animated particles around card */}
        <CardParticles />

        {/* Glass Panel Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.01]" />
        
        {/* Glowing Border Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-cyan-500/50 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />

        {/* AI Scanning Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={false}
        >
          <motion.div
            className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
            animate={{
              top: ['-20%', '120%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        <div className="relative p-4 sm:p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left Column: Metadata + Video */}
          <motion.div style={!isMobile ? { y } : {}} className="space-y-4 sm:space-y-6 order-2 md:order-1">
            {/* Header Info */}
            <div className="space-y-3 sm:space-y-4">
               <div className="flex flex-wrap gap-2 items-center">
                {categories.map((cat, i) => (
                  <motion.span 
                    key={i} 
                    className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 relative overflow-hidden group/badge"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-purple-500/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative z-10">{cat.trim()}</span>
                  </motion.span>
                ))}
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 font-mono ml-auto">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">{new Date(project.startedAt || '').toLocaleDateString()}</span>
                    <span className="sm:hidden">{new Date(project.startedAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </span>
                  {project.finishedAt && (
                    <>
                      <span>→</span>
                      <span className="hidden sm:inline">{new Date(project.finishedAt).toLocaleDateString()}</span>
                      <span className="sm:hidden">{new Date(project.finishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </>
                  )}
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 relative">
                {project.projectName}
                <motion.span
                  className="absolute -right-4 sm:-right-6 -top-1 sm:-top-2 hidden sm:block"
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="text-yellow-400" size={20} />
                </motion.span>
              </h3>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black group/video">
              {embedUrl ? (
                <iframe 
                  src={embedUrl}
                  title={`${project.projectName || 'Project'} - Video Demo by Vico Aritonang, AI Engineer`}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 text-sm" aria-label="No preview available for this project">
                  <span>No Preview Available</span>
                </div>
              )}
              
              {/* Status Badge with pulse */}
              <motion.div 
                className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-400 pointer-events-none"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(6, 182, 212, 0.4)',
                    '0 0 0 10px rgba(6, 182, 212, 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {project.status}
              </motion.div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column: Description, Skills, Actions */}
          <div className="flex flex-col h-full order-1 md:order-2">
            <div className="flex-grow overflow-y-auto max-h-[300px] sm:max-h-[400px] pr-2 sm:pr-4 custom-scrollbar">
              <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 space-y-4 sm:space-y-6">
               {/* Skills */}
               <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span 
                    key={i}
                    className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300 hover:bg-white/10 hover:text-cyan-400 transition-colors cursor-default relative overflow-hidden group/skill"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <Tag size={10} className="sm:w-3 sm:h-3 relative z-10" />
                    <span className="relative z-10">{skill.trim()}</span>
                  </motion.span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {project.project_url && (
                  <motion.a 
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white transition-colors font-medium relative overflow-hidden group/btn text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px] relative z-10" />
                    <span className="relative z-10">Visit Project</span>
                  </motion.a>
                )}
                
                <motion.button 
                  onClick={handleLike}
                  disabled={hasLiked || isLiking}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border transition-all relative overflow-hidden text-sm sm:text-base ${
                    hasLiked 
                      ? 'text-pink-500 bg-pink-500/20 border-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                      : 'text-pink-400/70 bg-pink-500/5 border-pink-500/20 hover:bg-pink-500/20 hover:text-pink-400'
                  }`}
                  whileHover={{ scale: hasLiked ? 1 : 1.05 }}
                  whileTap={{ scale: hasLiked ? 1 : 0.95 }}
                >
                  <motion.div
                    animate={hasLiked ? {
                      scale: [1, 1.5, 1],
                      rotate: [0, 360],
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Heart 
                      size={16} 
                      className={`sm:w-[18px] sm:h-[18px] transition-all ${hasLiked ? 'fill-current' : 'fill-none'}`} 
                    />
                  </motion.div>
                  <span className="font-mono font-bold">{likes}</span>
                  
                  {/* Heart particles on like */}
                  {hasLiked && <LikeParticles />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </motion.div>
  );
}

// Floating particles around card
function CardParticles() {
  return (
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

// Heart particles when liked
function LikeParticles() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: 0,
            scale: 1,
            x: Math.cos((i * Math.PI * 2) / 8) * 50,
            y: Math.sin((i * Math.PI * 2) / 8) * 50,
          }}
          transition={{ duration: 0.8 }}
        >
          ❤️
        </motion.div>
      ))}
    </>
  );
}
