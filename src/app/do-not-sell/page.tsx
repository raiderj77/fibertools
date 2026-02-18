import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Do Not Sell My Personal Information",
  description:
    "FiberTools does not sell your personal information. Learn about your rights under the California Consumer Privacy Act (CCPA).",
  alternates: { canonical: "/do-not-sell" },
};

export default function DoNotSellPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Do Not Sell My Personal Information
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Last updated: February 17, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            We Do Not Sell Your Data
          </h2>
          <p>
            FiberTools does not sell, rent, or trade your personal information to
            third parties for monetary or other valuable consideration. This
            applies to all users, including California residents covered by the
            California Consumer Privacy Act (CCPA/CPRA).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What We Collect
          </h2>
          <p>
            FiberTools collects minimal data. All calculators run in your
            browser. The only data we collect is:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Anonymous analytics data via Google Analytics 4 (page views,
              session duration, general location)
            </li>
            <li>
              Advertising data via Google AdSense (if ads are enabled and you
              have consented to cookies)
            </li>
          </ul>
          <p>
            We do not collect names, email addresses, phone numbers, or any
            other personally identifiable information through normal use of the
            site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Advertising &amp; Sharing
          </h2>
          <p>
            Under CCPA, sharing personal information for cross-context
            behavioral advertising may be considered a &ldquo;sale.&rdquo;
            Google AdSense may use cookies to serve personalized ads. You can opt
            out of personalized advertising:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Decline cookies via the cookie consent banner on first visit
            </li>
            <li>
              Visit{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Google Ad Settings
              </a>{" "}
              to disable personalized ads
            </li>
            <li>
              Use the{" "}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                DAA opt-out tool
              </a>
            </li>
            <li>
              Enable &ldquo;Do Not Track&rdquo; or Global Privacy Control (GPC)
              in your browser
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Your CCPA Rights
          </h2>
          <p>As a California resident, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Know</strong> what personal information is collected and
              how it is used
            </li>
            <li>
              <strong>Delete</strong> personal information we hold about you
            </li>
            <li>
              <strong>Opt out</strong> of the sale or sharing of personal
              information
            </li>
            <li>
              <strong>Non-discrimination</strong> for exercising your rights
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            How to Exercise Your Rights
          </h2>
          <p>
            To make a request regarding your personal information, email us at{" "}
            <a
              href="mailto:hello@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              hello@fibertools.app
            </a>{" "}
            with the subject line &ldquo;CCPA Request.&rdquo; We will respond
            within 45 days as required by law.
          </p>
          <p>
            We will not discriminate against you for exercising any of your CCPA
            rights.
          </p>
        </section>
      </div>
    </main>
  );
}
