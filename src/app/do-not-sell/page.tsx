import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Do Not Sell My Personal Information",
  description:
    "FiberTools does not sell personal information for money. Learn about privacy and opt-out rights under US state laws.",
  keywords: ["do not sell", "CCPA", "privacy rights", "personal information"],
  openGraph: {
    title: "Do Not Sell My Personal Information",
    description:
      "FiberTools does not sell personal information for money. Learn about privacy and opt-out rights under US state laws.",
    url: "https://fibertools.app/do-not-sell",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Do Not Sell My Personal Information" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Do Not Sell My Personal Information",
    description:
      "FiberTools does not sell personal information for money. Learn about privacy and opt-out rights under US state laws.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/do-not-sell" },
};

export default function DoNotSellPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Do Not Sell My Personal Information
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Last updated: August 1, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            No Monetary Sale
          </h2>
          <p>
            FiberTools does not sell personal information for money. Advertising
            is currently paused. If advertising is activated, disclosures used
            for cross-context behavioral advertising may be treated as sharing,
            targeted advertising, or a sale under some US state laws, even when
            no money changes hands. The opt-out methods below would apply.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What Data We Collect
          </h2>
          <p>
            FiberTools collects minimal data. Core calculator inputs and results
            remain in your browser. Depending on the features you choose, data
            handled by us or our service providers may include:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Optional analytics data via Google Analytics 4 after permission
              (page views, session duration, and general location)
            </li>
            <li>
              An email address if you voluntarily subscribe to the newsletter
            </li>
            <li>
              Craft, yarn-weight, and project-type filters if you explicitly
              request an optional Ravelry pattern search
            </li>
            <li>
              IP address, page and device information, identifiers, and consent
              choices via Google AdSense if advertising is later enabled
            </li>
          </ul>
          <p>
            We do not require a name, email address, or phone number to use the
            calculators. Calculator dimensions, gauge, pasted pattern text, and
            results are not sent to analytics or advertising providers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Advertising and Data Sharing
          </h2>
          <p>
            Under CCPA, sharing personal information for cross-context
            behavioral advertising may be considered a &ldquo;sale.&rdquo;
            AdSense is currently paused. Before activation, FiberTools will
            publish Google&apos;s US state regulations message and verify its current
            state targeting and GPP opt-out signal. European TCF consent is a
            separate process. You can opt out of personalized advertising or
            sharing:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              In a covered US state, use Google&apos;s Do Not Sell or Share My
              Personal Information link shown on the site after the US-state
              message is activated
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
              Enable Global Privacy Control (GPC) in your browser; FiberTools
              treats it as an opt-out and blocks the Google advertising bootstrap
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Your CCPA Privacy Rights
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
              <strong>Correct</strong> inaccurate personal information
            </li>
            <li>
              <strong>Opt out</strong> of the sale or sharing of personal
              information
            </li>
            <li>
              <strong>Limit use of sensitive data</strong>, request we limit
              the use of any sensitive personal information (note: FiberTools
              does not collect sensitive personal information)
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
    </div>
  );
}
