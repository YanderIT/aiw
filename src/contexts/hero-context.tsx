"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type HeroType = "v1-centered" | "v2-new" | "v3-third" | "v4-fourth" | "v5-particles" | "v6-spline-new" | "v7-static-bg";

interface HeroContextType {
  heroType: HeroType;
  setHeroType: (type: HeroType) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export function HeroProvider({ children }: { children: ReactNode }) {
  const [heroType, setHeroTypeState] = useState<HeroType>("v1-centered");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load hero type from localStorage on mount
    const savedHeroType = localStorage.getItem("heroType") as HeroType;
    const validTypes: HeroType[] = ["v1-centered", "v2-new", "v3-third", "v4-fourth", "v5-particles", "v6-spline-new", "v7-static-bg"];
    if (savedHeroType && validTypes.includes(savedHeroType)) {
      setHeroTypeState(savedHeroType);
    }
  }, []);

  const setHeroType = (type: HeroType) => {
    setHeroTypeState(type);
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("heroType", type);
    }
  };

  // Avoid hydration issues by not rendering until client-side
  if (!isClient) {
    return <>{children}</>;
  }

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
      heroType: "v1-centered" as HeroType,
      setHeroType: () => {},
    };
  }
  return context;
}