import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pattern Preflight Checkout Canceled", robots: { index: false, follow: false } };

export default function PreflightCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="rounded-2xl border border-cream-300 bg-white p-8 dark:border-bark-700 dark:bg-bark-900">
        <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100">Checkout canceled</h1>
        <p className="mt-4 leading-relaxed text-bark-600 dark:text-bark-400">You were not charged. Your pending submission remains private, and returning in this browser will reuse the same checkout instead of creating another one.</p>
        <Link href="/designer-pattern-preflight#submit-pattern" className="btn-primary mt-7">Return to your submission</Link>
      </div>
    </div>
  );
}
