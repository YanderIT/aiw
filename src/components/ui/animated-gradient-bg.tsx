"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedGradientBgProps {
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedGradientBg({ className = "", children }: AnimatedGradientBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      time += 0.001;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      // Animate gradient colors
      const hue1 = (Math.sin(time) * 60 + 200) % 360;
      const hue2 = (Math.sin(time * 0.5) * 60 + 280) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, 0.2)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 70%, 50%, 0.15)`);
      gradient.addColorStop(1, `hsla(${hue1 + 90}, 70%, 60%, 0.1)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Add noise effect
      for (let i = 0; i < 3; i++) {
        const x = Math.sin(time + i) * window.innerWidth * 0.5 + window.innerWidth * 0.5;
        const y = Math.cos(time * 0.5 + i) * window.innerHeight * 0.5 + window.innerHeight * 0.5;
        const radius = Math.sin(time * 0.3 + i) * 100 + 200;

        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        radialGradient.addColorStop(0, `hsla(${hue2 + i * 30}, 70%, 60%, 0.1)`);
        radialGradient.addColorStop(1, "transparent");

        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 opacity-50 dark:opacity-30"
        style={{
          filter: "blur(100px)",
        }}
      />
      {children}
    </div>
  );
}

export function FluidGradientBg({ className = "", children }: AnimatedGradientBgProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-background" />
      {children}
    </div>
  );
}

export function MeshGradientBg({ className = "", children }: AnimatedGradientBgProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none fixed inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] opacity-30" style={{ filter: "url(#goo)" }}>
          <motion.div
            className="absolute h-[50%] w-[50%] rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"
            animate={{
              x: ["0%", "100%", "0%"],
              y: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute h-[40%] w-[40%] rounded-full bg-gradient-to-br from-cyan-500 to-blue-500"
            animate={{
              x: ["100%", "0%", "100%"],
              y: ["100%", "0%", "100%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute h-[60%] w-[60%] rounded-full bg-gradient-to-br from-pink-500 to-rose-500"
            animate={{
              x: ["50%", "-50%", "50%"],
              y: ["-50%", "50%", "-50%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-background/90 backdrop-blur-3xl" />
      {children}
    </div>
  );
}