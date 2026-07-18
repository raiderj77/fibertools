import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How FiberTools selects product recommendations and earns from qualifying purchases.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-display font-bold text-bark-800 dark:text-cream-100">
        Affiliate Disclosure
      </h1>
      <div className="mt-6 space-y-5 text-bark-600 dark:text-cream-300">
        <p>
          FiberTools participates in the Amazon Services LLC Associates Program. As an Amazon Associate,
          FiberTools earns from qualifying purchases made after you follow an eligible product link.
        </p>
        <p>
          An affiliate link does not change the price you pay. Amazon may pay FiberTools a commission if
          your visit results in a qualifying purchase. Product availability, pricing, and seller terms are
          controlled by Amazon and can change without notice.
        </p>
        <p>
          Recommendations are chosen for their relevance to the calculator result, project, or guide. A
          commission does not guarantee a positive recommendation, and FiberTools does not accept payment
          from brands for a particular ranking on these pages.
        </p>
        <p>
          Affiliate clicks may be measured as aggregate events so we can understand which placements are
          useful. Those events identify the page, placement, content type, merchant, and product category;
          they do not include calculator inputs or newsletter email addresses. See the{" "}
          <Link href="/privacy" className="underline hover:text-sage-600">Privacy Policy</Link>{" "}
          for more information.
        </p>
      </div>
    </div>
  );
}
