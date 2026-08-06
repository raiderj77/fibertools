export const CONSENT_STORAGE_KEY = "cookie_consent";
export const CONSENT_CHANGED_EVENT = "fibertools:consent-changed";

export function hasAnalyticsConsent(storage) {
  try {
    const stored = storage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return false;
    return JSON.parse(stored)?.analytics === "granted";
  } catch {
    return false;
  }
}

export function createToolCompletionTracker({
  toolSlug,
  storage,
  getGtag,
  addEventListener,
  removeEventListener,
  setIntervalFn,
  clearIntervalFn,
  onSent,
  retryIntervalMs = 250,
  maxRetries = 20,
}) {
  let disposed = false;
  let sent = false;
  let retryCount = 0;
  let timerId = null;

  const stopRetrying = () => {
    if (timerId !== null) {
      clearIntervalFn(timerId);
      timerId = null;
    }
  };

  const sendIfAllowed = () => {
    if (disposed || sent || !hasAnalyticsConsent(storage)) return false;
    const gtag = getGtag();
    if (typeof gtag !== "function") return false;

    gtag("event", "tool_completion", {
      tool_slug: toolSlug,
    });
    sent = true;
    stopRetrying();
    onSent();
    return true;
  };

  const retry = () => {
    retryCount += 1;
    if (
      sendIfAllowed() ||
      !hasAnalyticsConsent(storage) ||
      retryCount >= maxRetries
    ) {
      stopRetrying();
    }
  };

  const start = () => {
    if (disposed || sent || !hasAnalyticsConsent(storage)) return;
    if (sendIfAllowed() || timerId !== null) return;

    retryCount = 0;
    timerId = setIntervalFn(retry, retryIntervalMs);
  };

  const handleConsentChanged = (event) => {
    if (event?.detail?.analytics === "granted") {
      start();
    } else {
      stopRetrying();
    }
  };

  addEventListener(CONSENT_CHANGED_EVENT, handleConsentChanged);
  start();

  return {
    dispose() {
      disposed = true;
      stopRetrying();
      removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChanged);
    },
  };
}
