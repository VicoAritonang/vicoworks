'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Background() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#030305] text-white overflow-hidden pointer-events-none">
      {/* Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      
      {/* Hexagonal Grid Overlay (Optional subtle texture) */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} 
      />

      {/* Ambient Light Orbs */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[120px]"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: y2 }}
      />

      {/* Data Streams / Rain (Simplified Matrix-like effect) */}
      <div className="absolute inset-0 opacity-10">
         {[...Array(10)].map((_, i) => (
            <div 
                key={i}
                className="absolute top-[-100px] w-[1px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50"
                style={{
                    left: `${Math.random() * 100}%`,
                    height: `${Math.random() * 300 + 100}px`,
                    animation: `rain ${Math.random() * 5 + 2}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                }}
            />
         ))}
      </div>

      <style jsx>{`
        @keyframes rain {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
