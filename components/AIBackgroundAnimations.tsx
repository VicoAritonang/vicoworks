'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function AIBackgroundAnimations() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Neural Network Nodes
    class Node {
      x: number;
      y: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      connections: Node[];

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.connections = [];
      }

      update(scrollY: number, canvasWidth: number) {
        // Parallax effect based on scroll
        const parallaxFactor = 0.3;
        this.y = this.baseY + scrollY * parallaxFactor;

        // Gentle floating movement
        this.x += this.vx;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Create nodes
    const nodes: Node[] = [];
    const nodeCount = Math.floor((canvas.width * canvas.height) / 30000);
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new Node(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      );
    }

    // Connect nearby nodes
    nodes.forEach(node => {
      nodes.forEach(other => {
        if (node !== other) {
          const dx = node.x - other.x;
          const dy = node.baseY - other.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            node.connections.push(other);
          }
        }
      });
    });

    // Particles
    class Particle {
      x: number;
      y: number;
      baseY: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update(scrollY: number, canvasWidth: number, canvasHeight: number) {
        const parallaxFactor = 0.5;
        this.y = this.baseY + scrollY * parallaxFactor;

        this.x += this.speedX;
        this.baseY += this.speedY;

        if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
        if (this.baseY < 0 || this.baseY > canvasHeight) this.speedY *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    // Animation loop
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });

    let animationFrame: number;
    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(other => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Update and draw nodes
      nodes.forEach(node => {
        node.update(scrollY, canvas.width);
        node.draw(ctx);
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.update(scrollY, canvas.width, canvas.height);
        particle.draw(ctx);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* Canvas for neural network and particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Animated Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Floating AI Icons */}
      <FloatingAIElements />

      {/* Scanning Line Effect */}
      <ScanningLine />
    </>
  );
}

function FloatingAIElements() {
  const elements = [
    { icon: '🧠', delay: 0, duration: 20 },
    { icon: '⚡', delay: 2, duration: 18 },
    { icon: '🤖', delay: 4, duration: 22 },
    { icon: '💡', delay: 6, duration: 19 },
    { icon: '🔮', delay: 8, duration: 21 },
    { icon: '✨', delay: 10, duration: 17 },
  ];

  // Define grid sections to distribute elements evenly
  // This prevents clustering in corners, especially top-left
  const getPositionForElement = (index: number) => {
    // Create a 3x2 grid (6 sections for 6 elements)
    const cols = 3;
    const rows = 2;
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // Each section is 33.33% x 50% of viewport
    const sectionWidth = 100 / cols;
    const sectionHeight = 100 / rows;
    
    // Base position at section start + random offset within section
    // Keep elements away from edges (10% margin within each section)
    const margin = 10;
    const baseX = col * sectionWidth;
    const baseY = row * sectionHeight;
    const offsetX = margin + Math.random() * (sectionWidth - 2 * margin);
    const offsetY = margin + Math.random() * (sectionHeight - 2 * margin);
    
    return {
      x: baseX + offsetX,
      y: baseY + offsetY,
    };
  };

  // Generate animation targets that stay within assigned regions
  const getAnimationTargets = (index: number) => {
    const cols = 3;
    const rows = 2;
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const sectionWidth = 100 / cols;
    const sectionHeight = 100 / rows;
    const margin = 10;
    const baseX = col * sectionWidth;
    const baseY = row * sectionHeight;
    
    // Generate two random positions within the same section for animation
    const target1X = baseX + margin + Math.random() * (sectionWidth - 2 * margin);
    const target1Y = baseY + margin + Math.random() * (sectionHeight - 2 * margin);
    const target2X = baseX + margin + Math.random() * (sectionWidth - 2 * margin);
    const target2Y = baseY + margin + Math.random() * (sectionHeight - 2 * margin);
    
    return [
      { x: `${target1X}%`, y: `${target1Y}%` },
      { x: `${target2X}%`, y: `${target2Y}%` },
    ];
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el, i) => {
        const initialPos = getPositionForElement(i);
        const animTargets = getAnimationTargets(i);
        
        return (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{ 
              x: `${initialPos.x}%`,
              y: `${initialPos.y}%`,
            }}
            animate={{
              x: [animTargets[0].x, animTargets[1].x, animTargets[0].x],
              y: [animTargets[0].y, animTargets[1].y, animTargets[0].y],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {el.icon}
          </motion.div>
        );
      })}
    </div>
  );
}

function ScanningLine() {
  return (
    <motion.div
      className="fixed left-0 right-0 h-px pointer-events-none z-0"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent)',
        boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
      }}
      animate={{
        top: ['0%', '100%'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}
