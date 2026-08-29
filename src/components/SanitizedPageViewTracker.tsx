"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  recordSanitizedPageView,
} from "@/lib/analytics-page-context.mjs";
import { hasCurrentAnalyticsConsent } from "@/lib/fixed-analytics";

export default function SanitizedPageViewTracker({
  initialPathname,
}: {
  initialPathname: string;
}) {
  const pathname = usePathname();
  const initialPathnameRef = useRef(initialPathname);

  useEffect(() => {
    if (initialPathnameRef.current === pathname) {
      initialPathnameRef.current = "";
      return;
    }

    recordSanitizedPageView({
      location: {
        origin: window.location.origin,
        pathname,
      },
      analyticsAllowed: hasCurrentAnalyticsConsent(),
      gtag: window.gtag,
    });
  }, [pathname]);

  return null;
}
