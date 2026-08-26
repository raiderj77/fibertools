import "server-only";
import { isDesignerPreflightCheckoutEnvironmentReady } from "./designer-preflight-readiness.mjs";

const DEFAULT_INQUIRY_URL =
  "mailto:hello@fibertools.app?subject=Designer%20Pattern%20Preflight%20inquiry";

export type DesignerPreflightAction =
  | { mode: "checkout" }
  | { mode: "inquiry"; inquiryUrl: string };

function hasValue(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function safeInquiryUrl(value: string | undefined): string {
  if (!hasValue(value)) return DEFAULT_INQUIRY_URL;

  try {
    const url = new URL(value!.trim());
    if (url.username || url.password) return DEFAULT_INQUIRY_URL;
    return url.protocol === "https:" || url.protocol === "mailto:"
      ? url.toString()
      : DEFAULT_INQUIRY_URL;
  } catch {
    return DEFAULT_INQUIRY_URL;
  }
}

export function getDesignerPreflightAction(): DesignerPreflightAction {
  if (isDesignerPreflightCheckoutEnvironmentReady(process.env)) {
    return { mode: "checkout" };
  }

  return {
    mode: "inquiry",
    inquiryUrl: safeInquiryUrl(process.env.DESIGNER_PREFLIGHT_INQUIRY_URL),
  };
}

export function canAcceptDesignerPreflightCheckout(): boolean {
  return getDesignerPreflightAction().mode === "checkout";
}
