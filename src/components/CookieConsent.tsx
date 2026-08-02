"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import GoogleCmp, { type GdprApplicability } from "@/components/GoogleCmp";
import PolicyDocumentLink from "@/components/PolicyDocumentLink";
import { detectGPCClient } from "@/lib/gpc";
import {
  GOOGLE_MEASUREMENT_ID,
  isGooglePolicyPath,
} from "@/lib/google-services";

type ConsentStatus = "granted" | "denied";

interface ConsentState {
  analytics: ConsentStatus;
  timestamp: string;
  version?: 2;
}

type StoredConsent = ConsentState | null | "loading";

const CONSENT_STORAGE_KEY = "cookie_consent";
const CONSENT_CHANGED_EVENT = "fibertools:consent-changed";
const PRIVACY_CHOICES_EVENT = "fibertools:privacy-choices";

function updateGoogleAnalyticsConsent(analytics: ConsentStatus) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: analytics,
      functionality_storage: analytics,
      personalization_storage: "denied",
    });
  }
}

function clearGoogleAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (name === "_ga" || name?.startsWith("_ga_")) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }
}

function GoogleAnalytics() {
  const pathname = usePathname();

  if (isGooglePolicyPath(pathname)) return null;

  return (
    <>
      <Script id="google-analytics-consent-granted" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          window.gtag('consent', 'default', {
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            personalization_storage: 'denied'
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${GOOGLE_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

export default function CookieConsent({
  googleCmpEnabled,
}: {
  googleCmpEnabled: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<StoredConsent>("loading");
  const [gpcActive, setGpcActive] = useState<boolean | null>(null);
  const [analyticsChoicesRequested, setAnalyticsChoicesRequested] =
    useState(false);
  const [gdprApplicability, setGdprApplicability] =
    useState<GdprApplicability>(googleCmpEnabled ? "checking" : "disabled");

  const handleGdprApplicability = useCallback((status: GdprApplicability) => {
    setGdprApplicability(status);
  }, []);

  const customAnalyticsAvailable =
    !googleCmpEnabled ||
    gdprApplicability === "does-not-apply" ||
    gdprApplicability === "disabled";
  const hasCurrentGdprAnalyticsGrant =
    gdprApplicability === "applies" &&
    consent !== "loading" &&
    consent?.analytics === "granted" &&
    consent.version === 2;
  const analyticsControlsAvailable =
    customAnalyticsAvailable ||
    analyticsChoicesRequested ||
    hasCurrentGdprAnalyticsGrant;

  useEffect(() => {
    const hasGpcCookie = document.cookie
      .split(";")
      .some((cookie) => cookie.trim() === "empire_gpc=1");
    const mustHonorGpc = detectGPCClient() || hasGpcCookie;
    setGpcActive(mustHonorGpc);

    if (mustHonorGpc) {
      const deniedConsent: ConsentState = {
        analytics: "denied",
        timestamp: new Date().toISOString(),
        version: 2,
      };
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(deniedConsent));
      } catch {
        // The GPC signal still applies to the current page if storage is unavailable.
      }
      updateGoogleAnalyticsConsent("denied");
      clearGoogleAnalyticsCookies();
      window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGED_EVENT, { detail: deniedConsent }),
      );
      setConsent(deniedConsent);
      setVisible(false);
      return;
    }

    let stored: string | null;
    try {
      stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch {
      setConsent(null);
      setVisible(true);
      return;
    }
    if (!stored) {
      setConsent(null);
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    try {
      const parsed = JSON.parse(stored) as Partial<ConsentState>;
      if (parsed.analytics !== "granted" && parsed.analytics !== "denied") {
        throw new Error("Invalid consent state");
      }
      const normalizedConsent: ConsentState = {
        analytics: parsed.analytics,
        timestamp:
          typeof parsed.timestamp === "string"
            ? parsed.timestamp
            : new Date().toISOString(),
        ...(parsed.version === 2 ? { version: 2 } : {}),
      };
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify(normalizedConsent),
      );
      updateGoogleAnalyticsConsent(normalizedConsent.analytics);
      if (normalizedConsent.analytics === "denied") {
        clearGoogleAnalyticsCookies();
      }
      window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGED_EVENT, { detail: normalizedConsent }),
      );
      setConsent(normalizedConsent);
    } catch {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      setConsent(null);
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (gdprApplicability !== "applies" || consent === "loading") return;
    if (consent?.analytics === "granted" && consent.version === 2) return;
    if (consent?.analytics === "denied" && consent.version === 2) return;

    const deniedConsent: ConsentState = {
      analytics: "denied",
      timestamp: new Date().toISOString(),
      version: 2,
    };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(deniedConsent));
    } catch {
      // The denial still applies to this page if storage is unavailable.
    }
    updateGoogleAnalyticsConsent("denied");
    clearGoogleAnalyticsCookies();
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGED_EVENT, { detail: deniedConsent }),
    );
    setConsent(deniedConsent);
    setAnalyticsChoicesRequested(false);
    setVisible(false);
  }, [consent, gdprApplicability]);

  useEffect(() => {
    const showChoices = () => {
      setAnalyticsChoicesRequested(true);
      setVisible(true);
    };
    window.addEventListener(PRIVACY_CHOICES_EVENT, showChoices);
    return () => window.removeEventListener(PRIVACY_CHOICES_EVENT, showChoices);
  }, []);

  function saveConsent(nextConsent: ConsentState) {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(nextConsent));
    } catch {
      // The choice still applies to the current page if storage is unavailable.
    }
    setConsent(nextConsent);
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGED_EVENT, { detail: nextConsent }),
    );
    setVisible(false);
  }

  function handleAccept() {
    if (gpcActive) {
      handleDecline();
      return;
    }
    const nextConsent: ConsentState = {
      analytics: "granted",
      timestamp: new Date().toISOString(),
      version: 2,
    };
    updateGoogleAnalyticsConsent("granted");
    saveConsent(nextConsent);
  }

  function handleDecline() {
    const nextConsent: ConsentState = {
      analytics: "denied",
      timestamp: new Date().toISOString(),
      version: 2,
    };
    updateGoogleAnalyticsConsent("denied");
    clearGoogleAnalyticsCookies();
    saveConsent(nextConsent);
  }

  return (
    <>
      <GoogleCmp
        enabled={googleCmpEnabled}
        blocked={gpcActive !== false}
        onApplicabilityChange={handleGdprApplicability}
      />
      {analyticsControlsAvailable && consent !== "loading" && consent?.analytics === "granted" ? (
        <GoogleAnalytics />
      ) : null}
      {analyticsControlsAvailable && visible ? (
        <div
          role="dialog"
          aria-label="Analytics consent"
          aria-describedby="cookie-consent-description"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-bark-800 border-t border-bark-200 dark:border-bark-600 shadow-lg"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p id="cookie-consent-description" className="text-sm text-bark-700 dark:text-cream-300 flex-1">
              {gpcActive
                ? "Global Privacy Control is enabled, so optional analytics and Google advertising services remain off. "
                : googleCmpEnabled
                  ? "With your permission, Google Analytics helps us understand which tools and product recommendations are useful. Google's certified privacy message manages advertising choices separately. Calculator inputs and email addresses are never included in analytics events. "
                  : "With your permission, Google Analytics helps us understand which tools and product recommendations are useful. Advertising remains off while certified privacy controls are being prepared. Calculator inputs and email addresses are never included in analytics events. "}
              <PolicyDocumentLink href="/cookies" className="text-sage-600 dark:text-sage-400 underline">
                Cookie Policy
              </PolicyDocumentLink>
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleDecline}
                className="min-h-11 rounded-lg border border-bark-300 px-4 py-2 text-sm font-medium text-bark-600 transition-colors hover:bg-bark-50 dark:border-bark-500 dark:text-cream-400 dark:hover:bg-bark-700"
              >
                Continue without analytics
              </button>
              {!gpcActive ? (
                <button
                  type="button"
                  onClick={handleAccept}
                  className="min-h-11 rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-700"
                >
                  Allow analytics
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
