"use client";

import { useState, type ReactNode } from "react";

interface CollapsibleContentProps {
  children: ReactNode[];
  previewCount?: number;
}

export default function CollapsibleContent({
  children,
  previewCount = 1,
}: CollapsibleContentProps) {
  const [expanded, setExpanded] = useState(false);
  const childArray = Array.isArray(children) ? children : [children];

  if (childArray.length <= previewCount) {
    return <>{childArray}</>;
  }

  return (
    <div>
      {childArray.slice(0, previewCount)}

      <div
        className={`
          overflow-hidden transition-[max-height] duration-500 ease-in-out
          md:max-h-none
          ${expanded ? "max-h-[3000px]" : "max-h-0 md:max-h-none"}
        `}
      >
        {childArray.slice(previewCount)}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-sm text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 font-medium transition-colors md:hidden"
        aria-expanded={expanded}
      >
        {expanded ? "Show less ↑" : "Read more ↓"}
      </button>
    </div>
  );
}
