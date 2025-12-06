'use client';

import { useEffect, useRef } from 'react';

interface NeuralNode {
  x: number;
  y: number;
  timestamp: number;
  energy: number;
}

interface Pulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

interface NeuralNetworkProps {
  isActive: boolean;
}

export function NeuralNetwork({ isActive }: NeuralNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const nodes: NeuralNode[] = [];
    const pulses: Pulse[] = [];
    const maxNodes = 150;
    const nodeLifespan = 3000; // 3 detik
    const minNodeDistance = 25;
    const maxConnectionDistance = 200;
    const pulseSpeed = 0.03;

    let mouseX = -1000;
    let mouseY = -1000;
    let lastNodeTime = 0;
    const nodeCreationInterval = 30; // Membuat node setiap 30ms

    function createNode(x: number, y: number) {
      // Cek jarak dengan node terakhir
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        const dx = x - lastNode.x;
        const dy = y - lastNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minNodeDistance) return;
      }

      nodes.push({
        x,
        y,
        timestamp: Date.now(),
        energy: 1
      });

      // Batasi jumlah node
      if (nodes.length > maxNodes) {
        nodes.shift();
      }

      // Buat pulse ke beberapa node terdekat
      if (nodes.length > 1) {
        const newNodeIndex = nodes.length - 1;
        const connectionsToCreate = Math.min(3, nodes.length - 1);
        
        for (let i = 0; i < connectionsToCreate; i++) {
          const targetIndex = Math.max(0, newNodeIndex - Math.floor(Math.random() * 10) - 1);
          if (targetIndex !== newNodeIndex) {
            pulses.push({
              fromIndex: newNodeIndex,
              toIndex: targetIndex,
              progress: 0,
              speed: pulseSpeed + Math.random() * 0.02
            });
          }
        }
      }
    }

    function drawNode(node: NeuralNode) {
      const age = Date.now() - node.timestamp;
      const lifeRatio = 1 - (age / nodeLifespan);
      
      if (lifeRatio <= 0) return;

      const opacity = lifeRatio * node.energy;
      const size = 3 + node.energy * 2;

      // Glow effect
      const gradient = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3);
      gradient.addColorStop(0, `rgba(168, 85, 247, ${opacity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(139, 92, 246, 0)`);

      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
      ctx!.fill();

      // Core
      ctx!.fillStyle = `rgba(220, 200, 255, ${opacity})`;
      ctx!.beginPath();
      ctx!.arc(node.x, node.y, size, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawConnection(from: NeuralNode, to: NeuralNode) {
      const age = Date.now() - from.timestamp;
      const lifeRatio = 1 - (age / nodeLifespan);
      
      if (lifeRatio <= 0) return;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > maxConnectionDistance) return;

      const opacity = lifeRatio * (1 - distance / maxConnectionDistance) * 0.3;

      // Gradient line
      const gradient = ctx!.createLinearGradient(from.x, from.y, to.x, to.y);
      gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity * 1.5})`);
      gradient.addColorStop(1, `rgba(139, 92, 246, ${opacity})`);

      ctx!.strokeStyle = gradient;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(from.x, from.y);
      ctx!.lineTo(to.x, to.y);
      ctx!.stroke();
    }

    function drawPulse(pulse: Pulse) {
      if (pulse.fromIndex >= nodes.length || pulse.toIndex >= nodes.length) return;

      const from = nodes[pulse.fromIndex];
      const to = nodes[pulse.toIndex];

      const x = from.x + (to.x - from.x) * pulse.progress;
      const y = from.y + (to.y - from.y) * pulse.progress;

      // Animated pulse
      const pulseSize = 4 + Math.sin(pulse.progress * Math.PI) * 3;
      const gradient = ctx!.createRadialGradient(x, y, 0, x, y, pulseSize * 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(168, 85, 247, 0.8)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(x, y, pulseSize * 2, 0, Math.PI * 2);
      ctx!.fill();
    }

    let animationFrameId: number;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      // Update dan hapus node yang expired
      const currentTime = Date.now();
      for (let i = nodes.length - 1; i >= 0; i--) {
        const age = currentTime - nodes[i].timestamp;
        if (age > nodeLifespan) {
          nodes.splice(i, 1);
        } else {
          nodes[i].energy = 1 - (age / nodeLifespan);
        }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + 8, nodes.length); j++) {
          drawConnection(nodes[i], nodes[j]);
        }
      }

      // Update dan draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].progress += pulses[i].speed;
        
        if (pulses[i].progress >= 1) {
          pulses.splice(i, 1);
        } else {
          drawPulse(pulses[i]);
        }
      }

      // Draw nodes
      nodes.forEach(node => drawNode(node));

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      const currentTime = Date.now();
      if (currentTime - lastNodeTime > nodeCreationInterval) {
        createNode(mouseX, mouseY);
        lastNodeTime = currentTime;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
