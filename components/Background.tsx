'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Star {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

interface RainDrop {
  left: number;
  height: number;
  duration: number;
  delay: number;
}

export function Background() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Randomized decorations are generated after mount to avoid hydration mismatch
  const [stars, setStars] = useState<Star[]>([]);
  const [rain, setRain] = useState<RainDrop[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 5,
      }))
    );
    setRain(
      Array.from({ length: 12 }, () => ({
        left: Math.random() * 100,
        height: Math.random() * 300 + 100,
        duration: Math.random() * 5 + 2,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#030305] text-white overflow-hidden pointer-events-none">
      {/* Grid Effect with subtle parallax */}
      <motion.div
        style={{ y: gridY }}
        className="absolute -inset-y-20 inset-x-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"
      />

      {/* Hexagonal texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              opacity: 0.15,
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute h-px w-32 bg-gradient-to-l from-transparent via-cyan-300/80 to-transparent"
          style={{
            top: `${8 + i * 18}%`,
            right: `${-10 - i * 5}%`,
            animation: `shooting-star ${6 + i * 3}s linear infinite`,
            animationDelay: `${i * 4 + 2}s`,
            boxShadow: '0 0 8px rgba(103, 232, 249, 0.6)',
          }}
        />
      ))}

      {/* Aurora sweep */}
      <div
        className="absolute top-[-30%] left-[10%] w-[80vw] h-[60vh] rounded-[100%] opacity-[0.07]"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(6,182,212,0.8), rgba(168,85,247,0.6), rgba(6,182,212,0.2), rgba(168,85,247,0.8), rgba(6,182,212,0.8))',
          filter: 'blur(80px)',
          animation: 'aurora-drift 18s ease-in-out infinite',
        }}
      />

      {/* Ambient Light Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[120px]"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ y: y2 }}
      />

      {/* Data Streams / Rain */}
      <div className="absolute inset-0 opacity-10">
        {rain.map((drop, i) => (
          <div
            key={i}
            className="absolute top-[-100px] w-[1px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50"
            style={{
              left: `${drop.left}%`,
              height: `${drop.height}px`,
              animation: `rain ${drop.duration}s linear infinite`,
              animationDelay: `${drop.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette to focus the content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* Film grain */}
      <div className="noise-overlay" />
    </div>
  );
}
