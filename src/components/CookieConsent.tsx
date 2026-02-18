"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ConsentStatus = "granted" | "denied";

interface ConsentState {
  analytics: ConsentStatus;
  ads: ConsentStatus;
  timestamp: string;
}

function updateGoogleConsent(analytics: ConsentStatus, ads: ConsentStatus) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: analytics,
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) {
      // First visit — show banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    // Returning visitor — apply stored consent
    try {
      const consent: ConsentState = JSON.parse(stored);
      updateGoogleConsent(consent.analytics, consent.ads);
    } catch {
      // Corrupted data, show banner again
      localStorage.removeItem("cookie-consent");
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    const consent: ConsentState = {
      analytics: "granted",
      ads: "granted",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    updateGoogleConsent("granted", "granted");
    setVisible(false);
  }

  function handleDecline() {
    const consent: ConsentState = {
      analytics: "denied",
      ads: "denied",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    updateGoogleConsent("denied", "denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-bark-800 border-t border-bark-200 dark:border-bark-600 shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-bark-700 dark:text-cream-300 flex-1">
          We use cookies for analytics and advertising to keep FiberTools free.
          No personal data is collected through our tools.{" "}
          <Link
            href="/cookies"
            className="text-sage-600 dark:text-sage-400 underline"
          >
            Cookie Policy
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-bark-600 dark:text-cream-400 border border-bark-300 dark:border-bark-500 rounded-lg hover:bg-bark-50 dark:hover:bg-bark-700 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-sage-600 rounded-lg hover:bg-sage-700 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
