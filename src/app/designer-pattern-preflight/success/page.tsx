import type { Metadata } from "next";
import Link from "next/link";
import { getExpectedStripeLivemode, getStripeClient } from "@/lib/designer-preflight-server";
import { PREFLIGHT_AMOUNT_CENTS, PREFLIGHT_SERVICE_KEY } from "@/lib/designer-preflight-service.mjs";
import PaymentSuccessAnalytics from "./PaymentSuccessAnalytics";

export const metadata: Metadata = { title: "Pattern Preflight Payment Status", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PreflightSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  let verifiedPaid = false;
  let processing = false;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
      const validService =
        session.livemode === getExpectedStripeLivemode() &&
        session.metadata?.service === PREFLIGHT_SERVICE_KEY &&
        Boolean(session.metadata?.submission_id) &&
        session.amount_total === PREFLIGHT_AMOUNT_CENTS;
      verifiedPaid = validService && session.payment_status === "paid";
      processing = validService && session.status === "complete" && !verifiedPaid;
    } catch {
      verifiedPaid = false;
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <PaymentSuccessAnalytics verifiedPaid={verifiedPaid} />
      <div className="rounded-2xl border border-sage-200 bg-white p-8 dark:border-sage-800 dark:bg-bark-900">
        <p aria-hidden="true" className="text-4xl">{verifiedPaid ? "✓" : "…"}</p>
        <h1 className="mt-4 text-3xl font-bold text-bark-800 dark:text-cream-100">
          {verifiedPaid ? "Payment confirmed" : processing ? "Payment is processing" : "We could not confirm this payment"}
        </h1>
        <p className="mt-4 leading-relaxed text-bark-600 dark:text-bark-400">
          {verifiedPaid
            ? "Your Designer Pattern Preflight is in the paid queue. Jason will verify access to your pattern and email you from jason@fibertools.app. The three-business-day target starts after working pattern access is confirmed."
            : processing
              ? "Stripe has completed checkout but payment confirmation is still processing. Do not pay again. FiberTools will confirm by email after the payment webhook finishes."
              : "No verified paid checkout was found for this page. Your card may not have been charged. Check your Stripe receipt or email jason@fibertools.app before trying again."}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/designer-pattern-preflight" className="btn-secondary">Return to the service page</Link>
          <a href="mailto:jason@fibertools.app?subject=Designer%20Pattern%20Preflight%20payment" className="btn-primary">Email FiberTools</a>
        </div>
      </div>
    </div>
  );
}
