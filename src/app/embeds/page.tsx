import type { Metadata } from "next";
import EmbedCodeCard, { PartnerInterestLink } from "@/components/EmbedCodeCard";

export const metadata: Metadata = {
  title: "Free Embeddable Fiber Arts Calculators",
  description: "Add a free branded FiberTools blanket, yarn, or gauge calculator to your HTTPS website.",
  alternates: { canonical: "/embeds" },
};

const embedTools = [
  { name: "Blanket Calculator", slug: "blanket-calculator" as const },
  { name: "Yarn Calculator", slug: "yarn-calculator" as const },
  { name: "Gauge Calculator", slug: "gauge-calculator" as const },
];

export default function EmbedsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-sage-600 dark:text-sage-400">For teachers, guilds, designers, and yarn shops</p>
        <h1 className="mt-2 font-display text-3xl text-bark-800 sm:text-4xl dark:text-cream-100">Free embeddable fiber arts calculators</h1>
        <p className="mt-4 text-base leading-relaxed text-bark-600 dark:text-bark-400">
          Add a small FiberTools calculator to any HTTPS website. The free pilot keeps FiberTools branding and a link to the full calculator. Embedded calculators do not load analytics, advertising, affiliate tracking, or newsletter forms.
        </p>
      </header>

      <section className="mt-10 space-y-6" aria-label="Available calculator embeds">
        {embedTools.map((tool) => <EmbedCodeCard key={tool.slug} {...tool} />)}
      </section>

      <section className="mt-12 rounded-2xl border border-sage-200 bg-sage-50 p-6 dark:border-sage-800 dark:bg-sage-950/20">
        <h2 className="font-display text-2xl text-bark-800 dark:text-cream-100">Future white-label pilot interest test</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-bark-600 dark:text-bark-400">
          These future options are being tested for partner interest. They are not available to purchase yet, and no billing or account system has been built.
        </p>
        <ul className="mt-5 space-y-3 text-bark-700 dark:text-cream-300">
          <li><strong>$149 per year:</strong> one future white-label calculator.</li>
          <li><strong>$299 per year:</strong> one future small white-label calculator bundle.</li>
        </ul>
        <p className="mt-5 text-sm text-bark-500 dark:text-bark-400">
          Please do not send pattern text, customer information, health information, or other sensitive data.
        </p>
        <div className="mt-6"><PartnerInterestLink /></div>
      </section>
    </div>
  );
}
