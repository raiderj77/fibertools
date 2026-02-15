"use client";

import { useState } from "react";
import type { FAQ } from "@/lib/faqs";

function FAQSchema({ faqs, toolName }: { faqs: FAQ[]; toolName: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: toolName,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-cream-200 dark:border-bark-700 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left group"
      >
        <span className="text-sm font-medium text-bark-700 dark:text-cream-200 group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
          {faq.q}
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 mt-0.5 text-bark-400 dark:text-bark-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 pr-8">
          <p className="text-sm text-bark-500 dark:text-bark-400 leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection({ faqs, toolName }: { faqs: FAQ[]; toolName: string }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-12">
      <FAQSchema faqs={faqs} toolName={toolName} />
      <h2 className="section-heading">Frequently Asked Questions</h2>
      <div className="bg-white dark:bg-bark-800 rounded-2xl border border-cream-300 dark:border-bark-700 px-6">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
      </div>
    </section>
  );
}
