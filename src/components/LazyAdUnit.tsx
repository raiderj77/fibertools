"use client";

import { useEffect, useRef, useState } from "react";
import AdUnit from "./AdUnit";

interface LazyAdUnitProps {
  slot: string;
  id: string;
  format?: string;
  style?: React.CSSProperties;
}

export default function LazyAdUnit({ slot, id, format, style }: LazyAdUnitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const adsenseEnabled =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  useEffect(() => {
    if (!adsenseEnabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [adsenseEnabled]);

  if (!adsenseEnabled) return null;

  return (
    <div ref={ref}>
      {visible ? (
        <AdUnit slot={slot} id={id} format={format} style={style} />
      ) : (
        <div id={id} className="my-10" style={{ minHeight: 250 }} aria-hidden="true" />
      )}
    </div>
  );
}
