"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isGooglePolicyPath } from "@/lib/google-services";

export default function GoogleAdChoicesButton() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const policyPath = isGooglePolicyPath(pathname);
  const googleCmpEnabled =
    process.env.NEXT_PUBLIC_GOOGLE_CMP_ENABLED === "true";

  useEffect(() => {
    if (!googleCmpEnabled || policyPath) {
      setVisible(false);
      return;
    }

    let cancelled = false;
    let listenerId: number | undefined;
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => {
        window.__tcfapi?.("addEventListener", 0, (tcData, success) => {
          if (typeof tcData?.listenerId === "number") {
            listenerId = tcData.listenerId;
          }
          if (!cancelled) {
            setVisible(Boolean(success && tcData?.gdprApplies));
          }
        });
      },
    });

    return () => {
      cancelled = true;
      if (listenerId !== undefined) {
        window.__tcfapi?.("removeEventListener", 0, () => {}, listenerId);
      }
    };
  }, [googleCmpEnabled, policyPath]);

  if (!googleCmpEnabled || policyPath || !visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const googlefc = window.googlefc;
        if (
          googlefc?.callbackQueue &&
          typeof googlefc.showRevocationMessage === "function"
        ) {
          googlefc.callbackQueue.push(googlefc.showRevocationMessage);
        }
      }}
      className="text-sm text-cream-300 hover:text-amber-400 transition-colors block py-1"
    >
      Privacy and cookie settings
    </button>
  );
}
