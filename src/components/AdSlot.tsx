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

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const config = SLOT_CONFIG[position];
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense not loaded yet or blocked — fail silently
    }
  }, []);

  return (
    <div
      className={`my-10 ${className}`}
      id={config.id}
      data-ad-position={position}
      aria-hidden="true"
      ref={adRef}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7171402107622932"
        data-ad-format={config.format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
