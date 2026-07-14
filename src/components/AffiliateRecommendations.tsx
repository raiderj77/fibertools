import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import AffiliateLink from "@/components/AffiliateLink";
import { amazonSearchUrl } from "@/lib/affiliate";

export interface AffiliateRecommendation {
  label: string;
  description: string;
  query: string;
  category: string;
}

interface AffiliateRecommendationsProps {
  page: string;
  contentType: "calculator" | "article" | "guide";
  heading?: string;
  intro: string;
  items: AffiliateRecommendation[];
  placement?: string;
}

export default function AffiliateRecommendations({
  page,
  contentType,
  heading = "Project-ready supplies",
  intro,
  items,
  placement = "project-supplies",
}: AffiliateRecommendationsProps) {
  return (
    <section
      className="my-10 rounded-xl border border-cream-300 bg-white p-5 sm:p-6 dark:border-bark-700 dark:bg-bark-800"
      aria-labelledby={`${placement}-heading`}
    >
      <h2 id={`${placement}-heading`} className="text-xl font-display font-bold text-bark-800 dark:text-cream-100">
        {heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-bark-600 dark:text-cream-300">{intro}</p>
      <AffiliateDisclosure compact />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <AffiliateLink
            key={item.label}
            href={amazonSearchUrl(item.query)}
            page={page}
            placement={placement}
            contentType={contentType}
            category={item.category}
            className="group min-h-24 rounded-lg border border-cream-300 p-4 transition hover:border-sage-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 dark:border-bark-700"
          >
            <span className="block font-semibold text-bark-800 group-hover:text-sage-600 dark:text-cream-100 dark:group-hover:text-sage-400">
              {item.label}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-bark-500 dark:text-bark-400">
              {item.description}
            </span>
            <span className="mt-2 block text-sm font-medium text-sage-600 dark:text-sage-400">
              View options on Amazon <span aria-hidden="true">→</span>
            </span>
          </AffiliateLink>
        ))}
      </div>
    </section>
  );
}
