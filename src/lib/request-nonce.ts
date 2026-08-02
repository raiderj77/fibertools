import "server-only";

import { headers } from "next/headers";
import { getStrictCspMode } from "@/lib/strict-csp.mjs";

type RequestNonceContext = {
  nonce?: string;
  isRscRequest: boolean;
};

export async function getRequestNonceContext(): Promise<RequestNonceContext> {
  if (getStrictCspMode() === "off") {
    return { nonce: undefined, isRscRequest: false };
  }

  const requestHeaders = await headers();
  return {
    nonce: requestHeaders.get("x-nonce") || undefined,
    isRscRequest:
      requestHeaders.get("rsc") === "1" ||
      requestHeaders.get("accept")?.includes("text/x-component") === true,
  };
}

/**
 * Avoid calling Next's dynamic headers API in the default mode. This is what
 * lets the normal production build keep its statically generated pages.
 */
export async function getRequestNonce(): Promise<string | undefined> {
  return (await getRequestNonceContext()).nonce;
}
