import { NextResponse } from "next/server";
import { createPreflightCheckout } from "@/lib/designer-preflight-service.mjs";
import {
  createCheckoutProvider,
  createSubmissionRepository,
  getExpectedStripeLivemode,
} from "@/lib/designer-preflight-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Send submission details as JSON." }, { status: 415 });
  }
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "Submission details are too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid submission details." }, { status: 400 });
  }

  try {
    const expectedLivemode = getExpectedStripeLivemode();
    const result = await createPreflightCheckout(payload, {
      repository: createSubmissionRepository(),
      checkout: createCheckoutProvider(expectedLivemode),
      expectedLivemode,
    });
    if (!result.ok) {
      if ("errors" in result) {
        return NextResponse.json({ error: "Check the highlighted fields.", errors: result.errors }, { status: 400 });
      }
      const resultCode = "code" in result ? result.code : "checkout_reconciliation_required";
      const terminalRequest = resultCode === "fresh_request_required" || resultCode === "request_already_processed";
      const retryMessage = terminalRequest
        ? "This request is closed or already processed. Submit again to start a fresh checkout."
        : "This checkout needs payment reconciliation before it can continue.";
      return NextResponse.json(
        { error: retryMessage, code: resultCode },
        { status: 409, headers: { "Cache-Control": "no-store" } }
      );
    }
    if (!("checkoutUrl" in result) || !result.checkoutUrl) {
      throw new Error("Checkout result did not include a URL.");
    }
    return NextResponse.json(
      { checkoutUrl: result.checkoutUrl },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    console.error("designer_preflight_checkout_failed code=checkout_unavailable");
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Your card was not charged. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
