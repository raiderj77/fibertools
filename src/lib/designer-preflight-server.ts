import "server-only";

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { stripeSecretKeyLivemode } from "./designer-preflight-service.mjs";

type SubmissionData = {
  requestId: string;
  name: string;
  email: string;
  patternTitle: string;
  terminology: string;
  skillLevel: string;
  patternType: string;
  comments: string | null;
  secureShareUrl: string;
  scopeAgreed: true;
};

type PreflightPaymentState =
  | "paid"
  | "expired"
  | "failed"
  | "partially_refunded"
  | "refunded"
  | "disputed"
  | "dispute_won"
  | "dispute_lost";

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required server configuration: ${name}`);
  return value;
}

export function getExpectedStripeLivemode(): boolean {
  const mode = requiredEnvironment("STRIPE_MODE").toLowerCase();
  if (mode !== "test" && mode !== "live") {
    throw new Error("STRIPE_MODE must be either test or live.");
  }
  return mode === "live";
}

function getConfiguredStripeKeyLivemode(): boolean {
  return stripeSecretKeyLivemode(requiredEnvironment("STRIPE_SECRET_KEY"));
}

export function getStripeClient(expectedLivemode = getExpectedStripeLivemode()): Stripe {
  const configuredLivemode = getConfiguredStripeKeyLivemode();
  if (configuredLivemode !== expectedLivemode) {
    throw new Error("STRIPE_SECRET_KEY does not match STRIPE_MODE.");
  }
  return new Stripe(requiredEnvironment("STRIPE_SECRET_KEY"));
}

export function getSupabaseAdmin() {
  return createClient(requiredEnvironment("SUPABASE_URL"), requiredEnvironment("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function getPublicSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://fibertools.app";
  const url = new URL(configured);
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside local development.");
  }
  return url.origin;
}

export function createSubmissionRepository() {
  const supabase = getSupabaseAdmin();
  return {
    async findByRequestId(requestId: string) {
      const { data, error } = await supabase
        .from("designer_preflight_submissions")
        .select("id, checkout_url, checkout_expires_at, stripe_checkout_session_id, payment_status, stripe_livemode, created_at")
        .eq("request_id", requestId)
        .maybeSingle();
      if (error) throw error;
      return data
        ? {
            id: data.id as string,
            checkoutUrl: data.checkout_url as string | null,
            checkoutExpiresAt: data.checkout_expires_at as string | null,
            checkoutSessionId: data.stripe_checkout_session_id as string | null,
            paymentStatus: data.payment_status as string,
            stripeLivemode: data.stripe_livemode as boolean | null,
            createdAt: data.created_at as string,
          }
        : null;
    },
    async create(data: SubmissionData, stripeLivemode: boolean) {
      const { data: created, error } = await supabase
        .from("designer_preflight_submissions")
        .insert({
          request_id: data.requestId,
          customer_name: data.name,
          customer_email: data.email,
          pattern_title: data.patternTitle,
          terminology: data.terminology,
          intended_skill_level: data.skillLevel,
          pattern_type: data.patternType,
          customer_comments: data.comments,
          secure_share_url: data.secureShareUrl,
          scope_agreed: data.scopeAgreed,
          scope_agreed_at: new Date().toISOString(),
          stripe_livemode: stripeLivemode,
        })
        .select("id, checkout_url")
        .single();
      if (error) throw error;
      return { id: created.id as string, checkoutUrl: created.checkout_url as string | null };
    },
    isDuplicateRequestError(error: unknown) {
      return Boolean(error && typeof error === "object" && "code" in error && error.code === "23505");
    },
    async saveCheckout(
      submissionId: string,
      sessionId: string,
      checkoutUrl: string,
      stripeLivemode: boolean,
      checkoutExpiresAt: string | null
    ) {
      const { data, error } = await supabase.rpc("save_designer_preflight_checkout", {
        p_submission_id: submissionId,
        p_checkout_session_id: sessionId,
        p_checkout_url: checkoutUrl,
        p_stripe_livemode: stripeLivemode,
        p_checkout_expires_at: checkoutExpiresAt,
      });
      if (error) throw error;
      if (data !== true) throw new Error("Checkout could not be linked to the preflight submission.");
    },
    async recordStripeEvent(input: {
      eventId: string;
      eventType: string;
      submissionId: string;
      checkoutSessionId: string | null;
      paymentIntentId: string | null;
      stripeObjectId: string;
      stripeLivemode: boolean;
      paymentState: PreflightPaymentState;
      amountPaidCents: number | null;
      amountRefundedCents: number | null;
      disputeId: string | null;
      disputeStatus: string | null;
      failureCode: string | null;
    }) {
      const { data, error } = await supabase.rpc("process_designer_preflight_stripe_event_v2", {
        p_event_id: input.eventId,
        p_event_type: input.eventType,
        p_submission_id: input.submissionId,
        p_checkout_session_id: input.checkoutSessionId,
        p_payment_intent_id: input.paymentIntentId,
        p_stripe_object_id: input.stripeObjectId,
        p_stripe_livemode: input.stripeLivemode,
        p_payment_state: input.paymentState,
        p_amount_paid_cents: input.amountPaidCents,
        p_amount_refunded_cents: input.amountRefundedCents,
        p_dispute_id: input.disputeId,
        p_dispute_status: input.disputeStatus,
        p_failure_code: input.failureCode,
      });
      if (error) throw error;
      return data === true;
    },
  };
}

export function createCheckoutProvider(expectedLivemode = getExpectedStripeLivemode()) {
  const configuredLivemode = getConfiguredStripeKeyLivemode();
  if (configuredLivemode !== expectedLivemode) {
    throw new Error("STRIPE_SECRET_KEY does not match STRIPE_MODE.");
  }
  const stripe = getStripeClient(expectedLivemode);
  const siteUrl = getPublicSiteUrl();
  return {
    configuredLivemode,
    async createSession(
      input: { submissionId: string; customerEmail: string; amountCents: number; serviceKey: string },
      idempotencyKey: string
    ) {
      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          customer_email: input.customerEmail,
          client_reference_id: input.submissionId,
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: input.amountCents,
                product_data: {
                  name: "Designer Pattern Preflight",
                  description: "One version of one crochet pattern, up to 10 pages, with one manual preflight report",
                },
              },
            },
          ],
          metadata: { service: input.serviceKey, submission_id: input.submissionId },
          payment_intent_data: { metadata: { service: input.serviceKey, submission_id: input.submissionId } },
          success_url: `${siteUrl}/designer-pattern-preflight/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteUrl}/designer-pattern-preflight/cancel`,
        },
        { idempotencyKey }
      );
      if (session.livemode !== expectedLivemode) {
        throw new Error("Stripe Checkout returned a session in the wrong configured mode.");
      }
      return {
        id: session.id,
        url: session.url,
        liveMode: session.livemode,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
      };
    },
  };
}
