import "server-only";

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

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

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required server configuration: ${name}`);
  return value;
}
export function getStripeClient(): Stripe {
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
        .select("id, checkout_url")
        .eq("request_id", requestId)
        .maybeSingle();
      if (error) throw error;
      return data ? { id: data.id as string, checkoutUrl: data.checkout_url as string | null } : null;
    },
    async create(data: SubmissionData) {
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
        })
        .select("id, checkout_url")
        .single();
      if (error) throw error;
      return { id: created.id as string, checkoutUrl: created.checkout_url as string | null };
    },
    isDuplicateRequestError(error: unknown) {
      return Boolean(error && typeof error === "object" && "code" in error && error.code === "23505");
    },
    async saveCheckout(submissionId: string, sessionId: string, checkoutUrl: string) {
      const { error } = await supabase
        .from("designer_preflight_submissions")
        .update({ stripe_checkout_session_id: sessionId, checkout_url: checkoutUrl, payment_status: "pending" })
        .eq("id", submissionId)
        .eq("payment_status", "pending");
      if (error) throw error;
    },
    async recordStripeEvent(input: {
      eventId: string;
      eventType: string;
      submissionId: string;
      checkoutSessionId: string;
      paymentIntentId: string | null;
      paymentStatus: "paid" | "expired";
    }) {
      const { data, error } = await supabase.rpc("process_designer_preflight_stripe_event", {
        p_event_id: input.eventId,
        p_event_type: input.eventType,
        p_submission_id: input.submissionId,
        p_checkout_session_id: input.checkoutSessionId,
        p_payment_intent_id: input.paymentIntentId,
        p_payment_status: input.paymentStatus,
      });
      if (error) throw error;
      return data === true;
    },
  };
}

export function createCheckoutProvider(stripe = getStripeClient()) {
  const siteUrl = getPublicSiteUrl();
  return {
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
                  description: "One manual crochet pattern preflight report",
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
      return { id: session.id, url: session.url };
    },
  };
}
