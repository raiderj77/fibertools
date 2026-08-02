"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isGooglePolicyPath } from "@/lib/google-services";

const CONSENT_SCRIPT_SELECTOR = [
  'script[src*="googletagmanager.com"]',
  'script[src*="googlesyndication.com"]',
  'script[src*="fundingchoicesmessages.google.com"]',
  '#google-analytics',
  '#google-cmp-adsense-bootstrap',
].join(",");

export default function PolicyScriptBoundary() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isGooglePolicyPath(pathname)) return;

    const consentRuntimePresent = Boolean(
      window.gtag ||
        window.googlefc ||
        window.__tcfapi ||
        document.querySelector(CONSENT_SCRIPT_SELECTOR),
    );

    if (consentRuntimePresent) {
      // A full reload clears scripts retained by App Router client navigation.
      // Direct policy-page loads do not mount consent-requiring Google tags.
      window.location.reload();
    }
  }, [pathname]);

  return null;
}
