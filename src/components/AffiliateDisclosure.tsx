import Link from "next/link";

interface AffiliateDisclosureProps {
  compact?: boolean;
}

const AMAZON_ASSOCIATE_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";

export default function AffiliateDisclosure({ compact = false }: AffiliateDisclosureProps) {
  if (compact) {
    return (
      <p className="mt-3 text-xs text-bark-400 dark:text-bark-500">
        {AMAZON_ASSOCIATE_DISCLOSURE} See our{" "}
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
      <strong>Affiliate disclosure:</strong> {AMAZON_ASSOCIATE_DISCLOSURE} Recommendations are selected
      for their fit with the project, not because a brand paid
      for placement. Your price is unchanged. Read our{" "}
      <Link href="/affiliate-disclosure" className="font-medium underline hover:text-sage-600">
        full affiliate disclosure
      </Link>
      .
    </aside>
  );
}
