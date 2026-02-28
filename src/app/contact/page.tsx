import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the FiberTools team. We're here to help with questions, feedback, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Contact FiberTools
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        We'd love to hear from you
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Get In Touch
          </h2>
          <p>
            Have questions about our tools, suggestions for new features, or
            feedback on your experience? We're here to help.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Email
          </h2>
          <p>
            For general inquiries, feedback, or support:
            <br />
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
            Response Time
          </h2>
          <p>
            We aim to respond to all emails within 48 hours. For urgent matters,
            we'll do our best to reply sooner.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Business & Partnership Inquiries
          </h2>
          <p>
            Interested in collaborating, advertising, or partnership
            opportunities?
            <br />
            <a
              href="mailto:partnerships@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              partnerships@fibertools.app
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Technical Support
          </h2>
          <p>
            Experiencing issues with our tools or website?
            <br />
            <a
              href="mailto:support@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              support@fibertools.app
            </a>
          </p>
          <p className="text-sm text-bark-500 dark:text-cream-400 mt-2">
            Please include details about the issue, your browser, and any error
            messages you're seeing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Privacy & Data Requests
          </h2>
          <p>
            For privacy-related questions or data requests:
            <br />
            <a
              href="mailto:privacy@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              privacy@fibertools.app
            </a>
          </p>
          <p className="text-sm text-bark-500 dark:text-cream-400 mt-2">
            Please see our{" "}
            <a
              href="/privacy"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Privacy Policy
            </a>{" "}
            for more information about how we handle your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Are FiberTools calculators free?
              </h3>
              <p>
                Yes! All our tools are completely free to use. We may display
                ads to support development costs, but the tools themselves
                require no payment.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Do I need to create an account?
              </h3>
              <p>
                No accounts required. All tools work immediately without
                registration.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Can I suggest a new tool?
              </h3>
              <p>
                Absolutely! We're always looking for new tools to build. Email
                your suggestions to{" "}
                <a
                  href="mailto:hello@fibertools.app"
                  className="text-sage-600 dark:text-sage-400 underline"
                >
                  hello@fibertools.app
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream-50 dark:bg-bark-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-4">
            Before You Contact Us
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Check our{" "}
              <a
                href="/tools"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Tools page
              </a>{" "}
              — your question might already be answered
            </li>
            <li>
              Review our{" "}
              <a
                href="/privacy"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Privacy Policy
              </a>{" "}
              for data-related questions
            </li>
            <li>
              See our{" "}
              <a
                href="/terms"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Terms of Service
              </a>{" "}
              for usage guidelines
            </li>
            <li>
              For bug reports, include: browser version, steps to reproduce, and
              screenshots if possible
            </li>
          </ul>
        </section>

        <p className="text-sm text-bark-500 dark:text-cream-400 pt-6 border-t border-bark-200 dark:border-cream-800">
          Thank you for using FiberTools! We're committed to making fiber arts
          more accessible through free, helpful tools.
        </p>
      </div>
    </main>
  );
}