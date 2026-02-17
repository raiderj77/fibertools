"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface StickyResultProps {
  summary: string;
  visible: boolean;
  children: ReactNode;
}

export default function StickyResult({ summary, visible, children }: StickyResultProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    if (!visible || !resultsRef.current) {
      setShowBar(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(resultsRef.current);
    return () => observer.disconnect();
  }, [visible]);

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div ref={resultsRef}>{children}</div>

      {visible && (
        <div
          onClick={scrollToResults}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollToResults()}
          className={`
            fixed bottom-0 left-0 right-0 z-50 md:hidden
            transition-transform duration-300 ease-out cursor-pointer
            ${showBar ? "translate-y-0" : "translate-y-full pointer-events-none"}
          `}
        >
          <div className="mx-3 mb-3 px-4 py-3 bg-white/95 dark:bg-bark-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-cream-300 dark:border-bark-600 border-l-4 border-l-sage-500">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-bark-700 dark:text-cream-200 truncate">
                {summary}
              </p>
              <svg
                className="w-4 h-4 flex-shrink-0 text-sage-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
