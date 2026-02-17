"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface ScrollHintProps {
  children: ReactNode;
}

export default function ScrollHint({ children }: ScrollHintProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      setCanScroll(el.scrollWidth > el.clientWidth + 4);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleScroll = () => {
    if (!hasScrolled) setHasScrolled(true);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto"
      >
        {children}
      </div>

      {canScroll && !hasScrolled && (
        <div
          className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white dark:from-bark-800 to-transparent pointer-events-none sm:hidden"
          aria-hidden="true"
        />
      )}

      {canScroll && !hasScrolled && (
        <p className="text-xs text-bark-400 dark:text-bark-500 mt-1.5 text-center sm:hidden animate-pulse">
          ← Swipe to see more →
        </p>
      )}
    </div>
  );
}
