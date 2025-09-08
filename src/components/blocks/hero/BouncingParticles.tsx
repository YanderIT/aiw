"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  hasTail: boolean;
}

const COLORS = [
  '#FF6B6B80', '#4ECDC480', '#45B7D180', '#96CEB480', '#FFEAA780',
  '#DDA0DD80', '#98D8C880', '#F7DC6F80', '#BB8FCE80', '#85C1E980',
  '#F8C47180', '#82E0AA80', '#F1948A80', '#85C1E980', '#D7BDE280'
];

interface BouncingParticlesProps {
  particleCount?: number;
  className?: string;
}

export const BouncingParticles: React.FC<BouncingParticlesProps> = ({ 
  particleCount = 25,
  className = ""
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 4, // Slower than original
        vy: (Math.random() - 0.5) * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: (Math.random() * 6 + 3) * 2, // Smaller than original
        hasTail: Math.random() < 0.15 // 15% chance for subtlety
      });
    }
    setParticles(newParticles);
  }, [dimensions, particleCount]);

  const animate = useCallback(() => {
    setParticles(prevParticles =>
      prevParticles.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx;
        let newVy = particle.vy;

        // Bounce off walls
        if (newX <= particle.size / 2 || newX >= dimensions.width - particle.size / 2) {
          newVx = -newVx;
          newX = Math.max(particle.size / 2, Math.min(dimensions.width - particle.size / 2, newX));
        }

        if (newY <= particle.size / 2 || newY >= dimensions.height - particle.size / 2) {
          newVy = -newVy;
          newY = Math.max(particle.size / 2, Math.min(dimensions.height - particle.size / 2, newY));
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      })
    );

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [dimensions]);

  useEffect(() => {
    if (particles.length === 0) return;

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length, animate]);

  const renderParticle = (particle: Particle) => {
    const angle = Math.atan2(particle.vy, particle.vx) * (180 / Math.PI);
    const tailLength = particle.hasTail ? particle.size * 3 : 0;

    return (
      <div key={particle.id} className="absolute">
        {/* Tail */}
        {particle.hasTail && (
          <div
            className="absolute opacity-60"
            style={{
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 4,
              width: tailLength,
              height: particle.size / 2,
              background: `linear-gradient(90deg, ${particle.color} 0%, ${particle.color.slice(0, -2)}40 30%, ${particle.color.slice(0, -2)}10 70%, transparent 100%)`,
              borderRadius: '50px',
              transform: `rotate(${angle + 180}deg)`,
              transformOrigin: `0px center`,
              filter: 'blur(1px)',
              zIndex: 1
            }}
          />
        )}
        
        {/* Main particle */}
        <motion.div
          className="absolute rounded-full opacity-70"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            boxShadow: `0 0 ${particle.size * 0.8}px ${particle.color.slice(0, -2)}30`,
            zIndex: 2
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {particles.map(particle => renderParticle(particle))}
    </div>
  );
};

export default BouncingParticles;