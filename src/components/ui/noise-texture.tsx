"use client";

export function NoiseTexture({ opacity = 0.03, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div 
      className={`pointer-events-none fixed inset-0 ${className}`}
      style={{
        opacity,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
  );
}