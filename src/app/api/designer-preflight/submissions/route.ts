import { NextResponse } from "next/server";
import { createPreflightCheckout } from "@/lib/designer-preflight-service.mjs";
import { createCheckoutProvider, createSubmissionRepository } from "@/lib/designer-preflight-server";

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
    const result = await createPreflightCheckout(payload, {
      repository: createSubmissionRepository(),
      checkout: createCheckoutProvider(),
    });
    if (!result.ok) {
      return NextResponse.json({ error: "Check the highlighted fields.", errors: result.errors }, { status: 400 });
    }
    return NextResponse.json(
      { checkoutUrl: result.checkoutUrl },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Designer preflight checkout could not be created", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Your card was not charged. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
