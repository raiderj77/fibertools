import { NextResponse } from "next/server";
import { handlePreflightWebhook } from "@/lib/designer-preflight-service.mjs";
import { createSubmissionRepository, getStripeClient } from "@/lib/designer-preflight-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  try {
    const stripe = getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    if (!webhookSecret) throw new Error("Missing required server configuration: STRIPE_WEBHOOK_SECRET");

    const result = await handlePreflightWebhook(rawBody, signature, {
      constructEvent: (body: string, header: string) => stripe.webhooks.constructEvent(body, header, webhookSecret),
      repository: createSubmissionRepository(),
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ received: true, handled: result.handled, duplicate: result.duplicate });
  } catch (error) {
    console.error("Designer preflight webhook failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
