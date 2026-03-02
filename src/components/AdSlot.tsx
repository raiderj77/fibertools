"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  position: "after-tool" | "mid-content" | "before-footer";
  className?: string;
}

const SLOT_CONFIG = {
  "after-tool": {
    id: "ad-after-tool",
    format: "auto" as const,
  },
  "mid-content": {
    id: "ad-mid-content",
    format: "auto" as const,
  },
  "before-footer": {
    id: "ad-before-footer",
    format: "horizontal" as const,
  },
};

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const config = SLOT_CONFIG[position];
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet or ad blocker active
    }
  }, []);

  return (
    <div
      className={`my-10 ${className}`}
      id={config.id}
      data-ad-position={position}
      aria-hidden="true"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7171402107622932"
        data-ad-slot=""
        data-ad-format={config.format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
