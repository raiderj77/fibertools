"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface AdUnitProps {
  slot: string;
  id: string;
  format?: string;
  style?: React.CSSProperties;
}

export default function AdUnit({
  slot,
  id,
  format = "auto",
  style,
}: AdUnitProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
      }
    } catch {
      // AdSense not loaded or blocked — fail silently
    }
  }, [pathname]);

  if (process.env.NODE_ENV !== "production") return null;

  const pubId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!pubId) return null;

  return (
    <div id={id} className="my-10" aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={style || { display: "block" }}
        data-ad-client={pubId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
