"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import {
  GOOGLE_ADSENSE_CLIENT_ID,
  isGooglePolicyPath,
} from "@/lib/google-services";

export type GdprApplicability =
  | "checking"
  | "applies"
  | "does-not-apply"
  | "unavailable"
  | "disabled";

interface GoogleCmpProps {
  enabled: boolean;
  blocked: boolean;
  onApplicabilityChange: (status: GdprApplicability) => void;
}

export default function GoogleCmp({
  enabled,
  blocked,
  onApplicabilityChange,
}: GoogleCmpProps) {
  const pathname = usePathname();
  const policyPath = isGooglePolicyPath(pathname);
  const active = enabled && !blocked && !policyPath;

  useEffect(() => {
    if (!enabled || policyPath) {
      onApplicabilityChange("disabled");
      return;
    }
    if (blocked) {
      onApplicabilityChange("checking");
      return;
    }

    let cancelled = false;
    let resolved = false;
    let listenerId: number | undefined;
    onApplicabilityChange("checking");

    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => {
        window.__tcfapi?.("addEventListener", 0, (tcData, success) => {
          if (cancelled) return;
          if (typeof tcData?.listenerId === "number") {
            listenerId = tcData.listenerId;
          }
          if (!success || typeof tcData?.gdprApplies !== "boolean") {
            onApplicabilityChange("unavailable");
            return;
          }
          resolved = true;
          onApplicabilityChange(
            tcData.gdprApplies ? "applies" : "does-not-apply",
          );
        });
      },
    });

    const timeout = window.setTimeout(() => {
      if (!cancelled && !resolved) onApplicabilityChange("unavailable");
    }, 8000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      if (listenerId !== undefined) {
        window.__tcfapi?.("removeEventListener", 0, () => {}, listenerId);
      }
    };
  }, [blocked, enabled, onApplicabilityChange, policyPath]);

  if (!active) return null;

  return (
    <Script
      id="google-cmp-adsense-bootstrap"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
