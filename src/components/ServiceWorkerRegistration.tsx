"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration({
  nonceCspEnabled,
}: {
  nonceCspEnabled: boolean;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const mode = nonceCspEnabled ? "nonce" : "static";
      navigator.serviceWorker
        .register(`/sw.js?mode=${mode}&v=2`, { updateViaCache: "none" })
        .catch(() => {
          // Silent fail - SW is an enhancement, not a requirement
        });
    }
  }, [nonceCspEnabled]);

  return null;
}
