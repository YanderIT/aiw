"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type HeroType = "v1-centered" | "v2-new" | "v3-third" | "v4-fourth" | "v5-particles" | "v6-spline-new" | "v7-static-bg";

interface HeroContextType {
  heroType: HeroType;
  setHeroType: (type: HeroType) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: ReactNode }) {
  const [heroType, setHeroTypeState] = useState<HeroType>("v7-static-bg");

  const setHeroType = (type: HeroType) => {
    setHeroTypeState(type);
  };

  return (
    <HeroContext.Provider value={{ heroType, setHeroType }}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const context = useContext(HeroContext);
  if (context === undefined) {
    // Return default values if context is not available
    return {
      heroType: "v7-static-bg" as HeroType,
      setHeroType: () => {},
    };
  }
  return context;
}
