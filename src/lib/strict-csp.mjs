const SUPPORTED_MODES = new Set(["off", "report-only"]);

/**
 * The nonce migration is an evidence-gathering spike, not a release switch.
 * Keeping it server-only and default-off preserves the current static build.
 */
export function getStrictCspMode(env = process.env) {
  const mode = env.FIBERTOOLS_NONCE_CSP_MODE?.trim() || "off";
  if (!SUPPORTED_MODES.has(mode)) {
    throw new Error(
      "FIBERTOOLS_NONCE_CSP_MODE must be either 'off' or 'report-only'.",
    );
  }
  return mode;
}

export function createCspNonce(cryptoSource = globalThis.crypto) {
  if (!cryptoSource?.getRandomValues) {
    throw new Error("A cryptographically secure random source is required.");
  }

  const bytes = new Uint8Array(16);
  cryptoSource.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return globalThis.btoa(binary);
}

/**
 * Google documents this exact nonce/strict-dynamic script-src shape for
 * AdSense. The remaining directives retain FiberTools' existing boundaries
 * while allowing the HTTPS resources a certified message or ad may create.
 */
export function buildAdSenseStrictCsp(nonce) {
  if (!/^[A-Za-z0-9+/]{22}==$/.test(nonce)) {
    throw new Error("CSP nonce must be 16 random bytes encoded as Base64.");
  }

  return [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:`,
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-src https:",
    "worker-src 'self' blob: https:",
    "media-src 'self' blob: https:",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}
