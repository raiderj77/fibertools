import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { getStitchProofConfiguration } from "./stitchproof-purchase-config.mjs";
import { buildStitchProofCheckoutParameters } from "./stitchproof-purchase-service.mjs";

type ProviderConfiguration = {
  stripeSecretKey: string;
  webhookSecret: string;
  priceId: string;
};
type ClaimKey = { projectId: string; claimSha256: string; stripeLivemode: boolean };
type PurchaseContract = {
  stripeAccountId: string; productId: string; priceId: string; offerVersion: string;
  amountCents: number; currency: string; taxMode: string; taxBehavior: string;
};
type Purchase = ClaimKey & {
  attempt: PurchaseContract & {
    id: string; status: string; checkoutSessionId: string | null; paymentIntentId: string | null;
    createdAt: string; checkoutExpiresAt: string | null;
  };
};
type Observation = {
  projectId: string; stripeLivemode: boolean; attemptId: string; sessionId: string;
  paymentIntentId: string | null; status: string; verifiedAt: string;
};

/** Only this server-only adapter sees provider credentials. All database access
 * uses constrained RPCs; direct table access is revoked even from service_role. */
export function createStitchProofPurchaseDependencies(env: NodeJS.ProcessEnv = process.env) {
  let stripe: { key: string; client: Stripe } | null = null;
  let database: { key: string; client: SupabaseClient } | null = null;

  const stripeClient = (configuration: ProviderConfiguration) => {
    if (!stripe || stripe.key !== configuration.stripeSecretKey) {
      stripe = { key: configuration.stripeSecretKey,
        client: new Stripe(configuration.stripeSecretKey, { timeout: 15_000, maxNetworkRetries: 2 }) };
    }
    return stripe.client;
  };
  const databaseClient = () => {
    const configuration = getStitchProofConfiguration(env);
    if (!configuration?.supabaseOrigin || !configuration.supabaseSecretKey) {
      throw new Error("Private purchase ledger unavailable.");
    }
    const key = `${configuration.supabaseOrigin}\u0000${configuration.supabaseSecretKey}`;
    if (!database || database.key !== key) {
      database = { key, client: createClient(configuration.supabaseOrigin, configuration.supabaseSecretKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      }) };
    }
    return database.client;
  };
  const rpc = async <T,>(name: string, parameters: Record<string, unknown> = {}): Promise<T> => {
    const { data, error } = await databaseClient().rpc(name, parameters);
    if (error) throw new Error("Private purchase ledger unavailable.");
    return data as T;
  };
  const claimParameters = (claim: ClaimKey) => ({
    p_project_id: claim.projectId, p_claim_sha256: claim.claimSha256, p_stripe_livemode: claim.stripeLivemode,
  });
  const observationParameters = (observation: Observation) => ({
    p_project_id: observation.projectId, p_stripe_livemode: observation.stripeLivemode,
    p_attempt_id: observation.attemptId, p_session_id: observation.sessionId,
    p_payment_intent_id: observation.paymentIntentId, p_status: observation.status,
    p_verified_at: observation.verifiedAt,
  });
  return {
    repository: {
      verifySchema: () => rpc<string | null>("stitchproof_purchase_schema_version"),
      loadPurchase: (claim: ClaimKey) => rpc<Purchase | null>("stitchproof_purchase_load", claimParameters(claim)),
      loadWebhookAttempt: (claim: ClaimKey & { attemptId: string }) => rpc<Purchase | null>("stitchproof_purchase_load_webhook", {
        ...claimParameters(claim), p_attempt_id: claim.attemptId,
      }),
      reserveAttempt: (claim: ClaimKey & { attemptId: string; expectedAttemptId: string | null; contract: PurchaseContract }) =>
        rpc<Purchase | null>("stitchproof_purchase_reserve", {
          ...claimParameters(claim), p_attempt_id: claim.attemptId,
          p_expected_attempt_id: claim.expectedAttemptId, p_contract: claim.contract,
        }),
      attachCheckout: (binding: {
        projectId: string; stripeLivemode: boolean; attemptId: string;
        sessionId: string; paymentIntentId: string | null; expiresAt: string;
      }) => rpc<boolean>("stitchproof_purchase_attach_checkout", {
        p_project_id: binding.projectId, p_stripe_livemode: binding.stripeLivemode,
        p_attempt_id: binding.attemptId, p_session_id: binding.sessionId,
        p_payment_intent_id: binding.paymentIntentId, p_expires_at: binding.expiresAt,
      }),
      recordVerification: (observation: Observation) => rpc<boolean>("stitchproof_purchase_record_verification", observationParameters(observation)),
      hasWebhookEvent: (event: { eventId: string; stripeLivemode: boolean }) => rpc<boolean>("stitchproof_purchase_has_event", {
        p_event_id: event.eventId, p_stripe_livemode: event.stripeLivemode,
      }),
      recordWebhookEvent: (event: Observation & { eventId: string; eventType: string }) => rpc<boolean>("stitchproof_purchase_record_event", {
        ...observationParameters(event), p_event_id: event.eventId, p_event_type: event.eventType,
      }),
    },
    stripe: {
      retrieveAccount: (configuration: ProviderConfiguration) => stripeClient(configuration).accounts.retrieve(null),
      retrievePrice: (configuration: ProviderConfiguration) => stripeClient(configuration).prices.retrieve(configuration.priceId, { expand: ["product"] }),
      createCheckoutSession: (input: { purchase: Purchase; successUrl: string; cancelUrl: string },
        idempotencyKey: string, configuration: ProviderConfiguration) => {
        // Never put the raw claim secret or pattern inputs in provider metadata.
        const parameters = buildStitchProofCheckoutParameters(input) as Stripe.Checkout.SessionCreateParams;
        return stripeClient(configuration).checkout.sessions.create(parameters, { idempotencyKey });
      },
      retrieveCheckoutSession: (sessionId: string, configuration: ProviderConfiguration) =>
        stripeClient(configuration).checkout.sessions.retrieve(sessionId, { expand: ["line_items.data.price.product"] }),
      retrievePaymentIntent: (paymentIntentId: string, configuration: ProviderConfiguration) =>
        stripeClient(configuration).paymentIntents.retrieve(paymentIntentId),
      retrieveCharge: (chargeId: string, configuration: ProviderConfiguration) => stripeClient(configuration).charges.retrieve(chargeId),
      // A truncated list is deliberately rejected by the service, never treated
      // as proof that no adverse refund/dispute exists beyond the first page.
      listRefunds: (chargeId: string, configuration: ProviderConfiguration) =>
        stripeClient(configuration).refunds.list({ charge: chargeId, limit: 100 }),
      listDisputes: (chargeId: string, configuration: ProviderConfiguration) =>
        stripeClient(configuration).disputes.list({ charge: chargeId, limit: 100 }),
      constructWebhookEvent: (rawBody: string, signature: string, configuration: ProviderConfiguration) =>
        stripeClient(configuration).webhooks.constructEvent(rawBody, signature, configuration.webhookSecret),
    },
  };
}
