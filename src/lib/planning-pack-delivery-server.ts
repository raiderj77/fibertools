import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

type DeliveryConfiguration = {
  stripeSecretKey: string;
  paymentLinkId: string;
  supabaseOrigin: string;
  supabaseSecretKey: string;
  storageBucket: string;
  storageObjectPath: string;
};

export function createPlanningPackDeliveryDependencies() {
  let stripe: Stripe | null = null;
  let supabase: SupabaseClient | null = null;

  const stripeClient = (configuration: DeliveryConfiguration) => {
    stripe ??= new Stripe(configuration.stripeSecretKey);
    return stripe;
  };

  const supabaseClient = (configuration: DeliveryConfiguration) => {
    supabase ??= createClient(configuration.supabaseOrigin, configuration.supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    return supabase;
  };

  return {
    async retrieveStripeAccount(configuration: DeliveryConfiguration) {
      return stripeClient(configuration).accounts.retrieve(null);
    },
    async retrievePaymentLink(configuration: DeliveryConfiguration) {
      return stripeClient(configuration).paymentLinks.retrieve(configuration.paymentLinkId, {
        expand: ["line_items.data.price"],
      });
    },
    async retrieveCheckoutSession(sessionId: string, configuration: DeliveryConfiguration) {
      return stripeClient(configuration).checkout.sessions.retrieve(sessionId, {
        expand: ["line_items.data.price"],
      });
    },
    async downloadPrivateObject(configuration: DeliveryConfiguration) {
      const storage = supabaseClient(configuration).storage;
      const { data: bucket, error: bucketError } = await storage.getBucket(
        configuration.storageBucket
      );
      if (
        bucketError ||
        !bucket ||
        bucket.id !== configuration.storageBucket ||
        bucket.public !== false
      ) {
        throw new Error("Private storage bucket unavailable.");
      }

      const { data, error } = await storage
        .from(configuration.storageBucket)
        .download(configuration.storageObjectPath);
      if (error || !data) throw new Error("Private product file unavailable.");
      return new Uint8Array(await data.arrayBuffer());
    },
  };
}
