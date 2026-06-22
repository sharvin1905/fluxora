'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  baseSize: number;
  color: string;
}

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const spacing = 35; // Grid spacing
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const cols = Math.floor(canvas.width / spacing) + 1;
      const rows = Math.floor(canvas.height / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: i * spacing,
            y: j * spacing,
            baseX: i * spacing,
            baseY: j * spacing,
            size: 1.5,
            baseSize: 1.5,
            color: 'rgba(255, 215, 0, 0.15)', // Default gold dots
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxDistance = 200;

      // Draw lines between particles near mouse
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const dx = mouse.x - p1.x;
        const dy = mouse.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          // Find nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx2 = p1.x - p2.x;
            const dy2 = p1.y - p2.y;
            const pDistance = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (pDistance < spacing * 1.5) {
              const opacity = 1 - distance / maxDistance;
              ctx.strokeStyle = `rgba(220, 20, 60, ${opacity * 0.5})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
      }
      ctx.stroke();

      // Draw particles
      particles.forEach((p) => {
        const dx = mouse.x - p.baseX;
        const dy = mouse.y - p.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let size = p.baseSize;
        let color = 'rgba(255, 215, 0, 0.15)';

        // Parallax & Glow effect based on mouse distance
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          p.x = p.baseX - dx * force * 0.1;
          p.y = p.baseY - dy * force * 0.1;

          size = p.baseSize + force * 2.5;

          // Transition to Crimson Red (#DC143C)
          const r = 220;
          const g = 20;
          const b = 60;
          const alpha = 0.15 + force * 0.85;
          color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
          // Diagonal wave animation from top-right to bottom-left
          const time = Date.now() * 0.002;
          // Increase wave amplitude to 1 for more dramatic effect
          const wave = Math.sin(time + (p.baseX - p.baseY) * 0.005);
          
          p.x = p.baseX;
          p.y = p.baseY;
          // Size pulses up to baseSize + 0.5
          size = p.baseSize + Math.max(0, wave) * 0.5;
          // Opacity swings to a very subtle level
          const alpha = 0.1 + Math.max(0, wave) * 0.15;
          color = `rgba(255, 215, 0, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Extra glow for highly affected particles
        if (distance < maxDistance * 0.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
          const force = (maxDistance * 0.5 - distance) / (maxDistance * 0.5);
          ctx.fillStyle = `rgba(220, 20, 60, ${force * 0.2})`;
          ctx.fill();
        }
      });

      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none bg-black"
    />
  );
}
