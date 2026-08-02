"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { detectGPCClient } from "@/lib/gpc";
import {
  GOOGLE_ADSENSE_CLIENT_ID,
  isGooglePolicyPath,
} from "@/lib/google-services";

interface AdUnitProps {
  slot: string;
  id: string;
  format?: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
}

export default function AdUnit({
  slot,
  id,
  format = "auto",
  style,
  wrapperClassName,
}: AdUnitProps) {
  const pathname = usePathname();
  const [canRequestAd, setCanRequestAd] = useState(false);
  const adsenseEnabled =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  useEffect(() => {
    if (!adsenseEnabled || isGooglePolicyPath(pathname)) {
      setCanRequestAd(false);
      return;
    }

    const hasGpcCookie = document.cookie
      .split(";")
      .some((cookie) => cookie.trim() === "empire_gpc=1");
    if (detectGPCClient() || hasGpcCookie || !window.__tcfapi) {
      setCanRequestAd(false);
      return;
    }

    let cancelled = false;
    let listenerId: number | undefined;
    window.__tcfapi("addEventListener", 0, (tcData, success) => {
      if (cancelled) return;
      if (typeof tcData?.listenerId === "number") {
        listenerId = tcData.listenerId;
      }
      if (!success || !tcData) {
        setCanRequestAd(false);
        return;
      }

      if (tcData.gdprApplies === false) {
        setCanRequestAd(true);
        return;
      }

      const decisionComplete =
        tcData.eventStatus === "tcloaded" ||
        tcData.eventStatus === "useractioncomplete";
      setCanRequestAd(
        tcData.gdprApplies === true &&
          decisionComplete &&
          tcData.purpose?.consents?.[1] === true,
      );
    });

    return () => {
      cancelled = true;
      if (listenerId !== undefined) {
        window.__tcfapi?.("removeEventListener", 0, () => {}, listenerId);
      }
    };
  }, [adsenseEnabled, pathname]);

  useEffect(() => {
    if (!canRequestAd || isGooglePolicyPath(pathname)) return;
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
      }
    } catch {
      // AdSense not loaded or blocked, fail silently
    }
  }, [canRequestAd, pathname]);

  if (
    !adsenseEnabled ||
    !canRequestAd ||
    isGooglePolicyPath(pathname)
  ) {
    return null;
  }

  return (
    <div id={id} className={`my-10${wrapperClassName ? ` ${wrapperClassName}` : ""}`} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={style || { display: "block" }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
