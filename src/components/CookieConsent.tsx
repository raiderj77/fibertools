"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { detectGPCClient } from "@/lib/gpc";
import {
  buildInitialAnalyticsConfig,
  GOOGLE_MEASUREMENT_ID,
} from "@/lib/analytics-page-context.mjs";
import SanitizedPageViewTracker from "@/components/SanitizedPageViewTracker";

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
  if (typeof document === "undefined") return;

  const domainAttributes = [""];
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname && hostname !== "localhost") {
      domainAttributes.push(` Domain=${hostname};`);
      const labels = hostname.split(".");
      if (labels.length > 2) {
        domainAttributes.push(` Domain=.${labels.slice(-2).join(".")};`);
      }
    }
  }

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (name === "_ga" || name?.startsWith("_ga_")) {
      for (const domainAttribute of domainAttributes) {
        document.cookie = `${name}=; Max-Age=0; Path=/;${domainAttribute} SameSite=Lax`;
      }
    }
  }
}

function GoogleServices({ adsenseEnabled }: { adsenseEnabled: boolean }) {
  const initialAnalyticsConfig =
    typeof window === "undefined" ? null : buildInitialAnalyticsConfig(window.location);
  if (!initialAnalyticsConfig) return null;

  const serializedAnalyticsConfig = JSON.stringify({
    ...initialAnalyticsConfig,
    anonymize_ip: true,
    ignore_referrer: true,
    send_page_view: false,
  }).replaceAll("<", "\\u003c");
  const serializedInitialPageView = JSON.stringify({
    page_path: initialAnalyticsConfig.page_path,
    page_location: initialAnalyticsConfig.page_location,
    page_referrer: initialAnalyticsConfig.page_referrer,
  }).replaceAll("<", "\\u003c");
  const currentConsentCheck = `
    var storedConsent = null;
    try {
      storedConsent = JSON.parse(window.localStorage.getItem('${CONSENT_STORAGE_KEY}') || 'null');
    } catch (_error) {
      storedConsent = null;
    }
    var gpcActive = window.navigator.globalPrivacyControl === true ||
      document.cookie.split(';').some(function(part) {
        return part.trim() === 'empire_gpc=1';
      });
    var analyticsAllowed = !gpcActive && storedConsent && storedConsent.analytics === 'granted';
    var adsAllowed = !gpcActive && storedConsent && storedConsent.ads === 'granted';
  `;

  return (
    <>
      <Script id="google-consent-granted" strategy="afterInteractive">
        {`
          (function(){
            ${currentConsentCheck}
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){
              if (arguments[0] === 'event') {
                var eventParameters = arguments[2] && typeof arguments[2] === 'object'
                  ? arguments[2]
                  : {};
                arguments[2] = Object.assign({}, eventParameters, {
                  page_path: window.location.pathname,
                  page_location: window.location.origin + window.location.pathname,
                  page_referrer: ''
                });
              }
              window.dataLayer.push(arguments);
            };
            window.gtag('consent', 'default', {
              ad_storage: adsAllowed ? 'granted' : 'denied',
              ad_user_data: adsAllowed ? 'granted' : 'denied',
              ad_personalization: adsAllowed ? 'granted' : 'denied',
              analytics_storage: analyticsAllowed ? 'granted' : 'denied',
              functionality_storage: analyticsAllowed ? 'granted' : 'denied',
              personalization_storage: analyticsAllowed ? 'granted' : 'denied'
            });
          })();
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          (function(){
            ${currentConsentCheck}
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){
              if (arguments[0] === 'event') {
                var eventParameters = arguments[2] && typeof arguments[2] === 'object'
                  ? arguments[2]
                  : {};
                arguments[2] = Object.assign({}, eventParameters, {
                  page_path: window.location.pathname,
                  page_location: window.location.origin + window.location.pathname,
                  page_referrer: ''
                });
              }
              window.dataLayer.push(arguments);
            };
            if (!analyticsAllowed) {
              window.gtag('consent', 'update', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'denied',
                personalization_storage: 'denied'
              });
              return;
            }
            window.gtag('js', new Date());
            window.gtag('config', '${GOOGLE_MEASUREMENT_ID}', ${serializedAnalyticsConfig});
            window.gtag('event', 'page_view', ${serializedInitialPageView});
          })();
        `}
      </Script>
      <SanitizedPageViewTracker initialPathname={initialAnalyticsConfig.page_path} />
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
  const [gpcActive, setGpcActive] = useState(false);

  function saveConsent(nextConsent: ConsentState, closeChoices = true) {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(nextConsent));
    } catch {
      // The choice still applies to the current page if storage is unavailable.
    }
    setConsent(nextConsent);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: nextConsent }));
    if (closeChoices) setVisible(false);
  }

  function enforceGPC(closeChoices = true) {
    const nextConsent: ConsentState = {
      analytics: "denied",
      ads: "denied",
      timestamp: new Date().toISOString(),
    };
    setGpcActive(true);
    updateGoogleConsent("denied", "denied");
    clearGoogleAnalyticsCookies();
    saveConsent(nextConsent, closeChoices);
  }

  useEffect(() => {
    if (detectGPCClient()) {
      enforceGPC();
      return;
    }

    setGpcActive(false);
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
    // Consent is initialized once per page load. GPC is checked again before any grant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const syncConsentFromAnotherTab = (event: StorageEvent) => {
      if (event.key !== CONSENT_STORAGE_KEY) return;

      if (detectGPCClient()) {
        enforceGPC(false);
        return;
      }

      try {
        const parsed = event.newValue
          ? (JSON.parse(event.newValue) as Partial<ConsentState>)
          : null;
        if (
          !parsed ||
          (parsed.analytics !== "granted" && parsed.analytics !== "denied") ||
          (parsed.ads !== "granted" && parsed.ads !== "denied")
        ) {
          throw new Error("Invalid consent state");
        }

        setGpcActive(false);
        updateGoogleConsent(parsed.analytics, parsed.ads);
        if (parsed.analytics === "denied") clearGoogleAnalyticsCookies();
        setConsent(parsed as ConsentState);
      } catch {
        updateGoogleConsent("denied", "denied");
        clearGoogleAnalyticsCookies();
        setConsent(null);
        setVisible(true);
      }
    };

    window.addEventListener("storage", syncConsentFromAnotherTab);
    return () => window.removeEventListener("storage", syncConsentFromAnotherTab);
    // The listener is registered once and reads the current GPC signal when invoked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const showChoices = () => {
      if (detectGPCClient()) {
        enforceGPC(false);
      } else {
        setGpcActive(false);
      }
      setVisible(true);
    };
    window.addEventListener(PRIVACY_CHOICES_EVENT, showChoices);
    return () => window.removeEventListener(PRIVACY_CHOICES_EVENT, showChoices);
    // The listener is registered once and re-checks the live GPC signal when invoked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAccept() {
    if (detectGPCClient()) {
      enforceGPC();
      return;
    }

    setGpcActive(false);
    const nextConsent: ConsentState = {
      analytics: "granted",
      ads: "granted",
      timestamp: new Date().toISOString(),
    };
    updateGoogleConsent("granted", "granted");
    saveConsent(nextConsent);
  }

  function handleDecline() {
    setGpcActive(detectGPCClient());
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
      {consent !== "loading" && !gpcActive && consent?.analytics === "granted" ? (
        <GoogleServices adsenseEnabled={adsenseEnabled && consent.ads === "granted"} />
      ) : null}
      {visible ? (
        <div
          role="dialog"
          aria-label="Cookie consent"
          aria-describedby="cookie-consent-description"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-bark-800 border-t border-bark-200 dark:border-bark-600 shadow-lg"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p id="cookie-consent-description" className="text-sm text-bark-700 dark:text-cream-300 flex-1">
              {gpcActive ? (
                <>Your browser&apos;s Global Privacy Control signal is active, so analytics and advertising remain off. </>
              ) : (
                <>With your permission, Google Analytics helps us understand which tools and product
                  recommendations are useful. Calculator inputs and email addresses are never included in
                  analytics events. </>
              )}
              <Link href="/cookies" className="text-sage-600 dark:text-sage-400 underline">
                Cookie Policy
              </Link>
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
