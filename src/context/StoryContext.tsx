"use client";

import { createContext, useContext, useState } from "react";

interface StoryState {
  activeLesson: number;
  setActiveLesson: (lesson: number) => void;
}

const StoryContext = createContext<StoryState | null>(null);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [activeLesson, setActiveLesson] = useState(1);

  return (
    <StoryContext.Provider value={{ activeLesson, setActiveLesson }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used within StoryProvider");
  return ctx;
}
