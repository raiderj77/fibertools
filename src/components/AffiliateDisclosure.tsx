import Link from "next/link";

interface AffiliateDisclosureProps {
  compact?: boolean;
}

const AMAZON_ASSOCIATE_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";
const AFFILIATE_LINK_DISCLOSURE = "FiberTools may earn a commission if you buy through these links.";

export default function AffiliateDisclosure({ compact = false }: AffiliateDisclosureProps) {
  if (compact) {
    return (
      <p className="mt-3 text-sm leading-relaxed text-bark-600 dark:text-cream-300">
        <strong>Paid links:</strong> {AFFILIATE_LINK_DISCLOSURE} {AMAZON_ASSOCIATE_DISCLOSURE} See our{" "}
        <Link href="/affiliate-disclosure" className="underline hover:text-sage-600">
          affiliate disclosure
        </Link>
        .
      </p>
    );
  }

  return (
    <aside
      aria-label="Affiliate disclosure"
      className="mb-6 rounded-lg border border-cream-300 bg-cream-100 px-4 py-3 text-sm text-bark-600 dark:border-bark-700 dark:bg-bark-800 dark:text-cream-300"
    >
      <strong>Paid links:</strong> {AFFILIATE_LINK_DISCLOSURE} {AMAZON_ASSOCIATE_DISCLOSURE} Recommendations
      are selected for their fit with the project, not because a brand paid for placement. Your price is
      unchanged. Read our{" "}
      <Link href="/affiliate-disclosure" className="font-medium underline hover:text-sage-600">
        full affiliate disclosure
      </Link>
      .
    </aside>
  );
}
