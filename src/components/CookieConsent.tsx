"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

type ConsentStatus = "granted" | "denied";

interface ConsentState {
  analytics: ConsentStatus;
  ads: ConsentStatus;
  timestamp: string;
}

type StoredConsent = ConsentState | null | "loading";

const CONSENT_STORAGE_KEY = "cookie_consent";
const CONSENT_CHANGED_EVENT = "fibertools:consent-changed";
const PRIVACY_CHOICES_EVENT = "fibertools:privacy-choices";
const GOOGLE_MEASUREMENT_ID = "G-T92LYDE8NN";
const ADSENSE_CLIENT_ID = "ca-pub-7171402107622932";

function updateGoogleConsent(analytics: ConsentStatus, ads: ConsentStatus) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
      analytics_storage: analytics,
      functionality_storage: analytics,
      personalization_storage: analytics,
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

function GoogleServices({ adsenseEnabled }: { adsenseEnabled: boolean }) {
  return (
    <>
      <Script id="google-consent-granted" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          window.gtag('consent', 'default', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            personalization_storage: 'granted'
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
      {adsenseEnabled ? (
        <Script
          id="adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      ) : null}
    </>
  );
}

export default function CookieConsent({ adsenseEnabled }: { adsenseEnabled: boolean }) {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<StoredConsent>("loading");

  useEffect(() => {
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
      // First visit, show banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    // Returning visitor, apply stored consent
    try {
      const parsed = JSON.parse(stored) as Partial<ConsentState>;
      if (
        (parsed.analytics !== "granted" && parsed.analytics !== "denied") ||
        (parsed.ads !== "granted" && parsed.ads !== "denied")
      ) {
        throw new Error("Invalid consent state");
      }
      setConsent(parsed as ConsentState);
    } catch {
      // Corrupted data, show banner again
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      setConsent(null);
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const showChoices = () => setVisible(true);
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
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: nextConsent }));
    setVisible(false);
  }

  function handleAccept() {
    const nextConsent: ConsentState = {
      analytics: "granted",
      ads: "granted",
      timestamp: new Date().toISOString(),
    };
    updateGoogleConsent("granted", "granted");
    saveConsent(nextConsent);
  }

  function handleDecline() {
    const nextConsent: ConsentState = {
      analytics: "denied",
      ads: "denied",
      timestamp: new Date().toISOString(),
    };
    updateGoogleConsent("denied", "denied");
    clearGoogleAnalyticsCookies();
    saveConsent(nextConsent);
  }

  return (
    <>
      {consent !== "loading" && consent?.analytics === "granted" ? (
        <GoogleServices adsenseEnabled={adsenseEnabled && consent.ads === "granted"} />
      ) : null}
      {visible ? (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-bark-800 border-t border-bark-200 dark:border-bark-600 shadow-lg"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-bark-700 dark:text-cream-300 flex-1">
              With your permission, Google Analytics helps us understand which tools and product
              recommendations are useful. Calculator inputs and email addresses are never included in
              analytics events.{" "}
              <Link href="/cookies" className="text-sage-600 dark:text-sage-400 underline">
                Cookie Policy
              </Link>
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-bark-600 dark:text-cream-400 border border-bark-300 dark:border-bark-500 rounded-lg hover:bg-bark-50 dark:hover:bg-bark-700 transition-colors"
              >
                Continue without analytics
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-sage-600 rounded-lg hover:bg-sage-700 transition-colors"
              >
                Allow analytics
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
