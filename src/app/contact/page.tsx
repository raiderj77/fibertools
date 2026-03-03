import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the FiberTools team. Report bugs, suggest features, or ask questions about our free fiber arts calculators.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-8">
        Contact Us
      </h1>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Get in Touch
          </h2>
          <p>
            We love hearing from the fiber arts community. Whether you have a
            question, found a bug, or want to suggest a new tool, drop us a
            line.
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:hello@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              hello@fibertools.app
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What We Can Help With
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bug reports — something not calculating correctly?</li>
            <li>Feature requests — a tool or option you&apos;d like to see</li>
            <li>Accessibility issues — we want to be usable by everyone</li>
            <li>General questions about the tools or how they work</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Response Time
          </h2>
          <p>
            We aim to respond within 48 hours. FiberTools is a small project, so
            we appreciate your patience.
          </p>
        </section>
      </div>
    </main>
  );
}
