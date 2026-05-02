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
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(localStorage.getItem("fiberTools_ad_consent") === "true");
  }, []);

  useEffect(() => {
    if (!hasConsent) return;
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
  }, [hasConsent]);

  if (!hasConsent) return null;

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
