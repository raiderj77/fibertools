import { NextResponse } from "next/server";
import { handlePreflightWebhook } from "@/lib/designer-preflight-service.mjs";
import {
  createSubmissionRepository,
  getExpectedStripeLivemode,
  getStripeClient,
} from "@/lib/designer-preflight-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  try {
    const expectedLivemode = getExpectedStripeLivemode();
    const stripe = getStripeClient(expectedLivemode);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    if (!webhookSecret) throw new Error("Missing required server configuration: STRIPE_WEBHOOK_SECRET");

    const result = await handlePreflightWebhook(rawBody, signature, {
      constructEvent: (body: string, header: string) => stripe.webhooks.constructEvent(body, header, webhookSecret),
      expectedLivemode,
      retrievePaymentIntent: (paymentIntentId: string) => stripe.paymentIntents.retrieve(paymentIntentId),
      retrieveCharge: (chargeId: string | null) => {
        if (!chargeId) throw new Error("Stripe dispute did not include a charge reference.");
        return stripe.charges.retrieve(chargeId);
      },
      repository: createSubmissionRepository(),
    });
    if (!result.ok && "error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }
    return NextResponse.json({
      received: true,
      handled: "handled" in result ? result.handled : false,
      duplicate: "duplicate" in result ? result.duplicate : false,
    });
  } catch {
    console.error("designer_preflight_webhook_failed code=webhook_processing_failed");
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
