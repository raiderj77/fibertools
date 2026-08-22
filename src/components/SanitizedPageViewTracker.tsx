"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SanitizedPageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
      page_referrer: "",
    });
  }, [pathname]);

  return null;
}
