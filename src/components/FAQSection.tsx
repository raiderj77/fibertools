import type { FAQ } from "@/lib/faqs";

export default function FAQSection({ faqs, heading = "Frequently Asked Questions" }: { faqs: FAQ[]; heading?: string }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="section-heading">{heading}</h2>
      <div className="bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 px-6 divide-y divide-cream-200 dark:divide-bark-700">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-medium text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
                {faq.q}
              </span>
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="pb-4 pr-8">
              <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
