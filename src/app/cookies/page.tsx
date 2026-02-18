import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How FiberTools uses cookies — analytics, advertising, and how to manage your preferences.",
  alternates: { canonical: "/cookies" },
};

export default function CookiePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Cookie Policy
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Last updated: February 17, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What Are Cookies
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help the site remember your preferences and understand
            how you use it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Cookies We Use
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-bark-200 dark:border-bark-600">
                  <th className="text-left py-2 pr-4 font-semibold">Cookie</th>
                  <th className="text-left py-2 pr-4 font-semibold">Provider</th>
                  <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                  <th className="text-left py-2 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bark-100 dark:divide-bark-700">
                <tr>
                  <td className="py-2 pr-4">_ga, _ga_*</td>
                  <td className="py-2 pr-4">Google Analytics</td>
                  <td className="py-2 pr-4">
                    Distinguish unique users, track page views and sessions
                  </td>
                  <td className="py-2">2 years</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">_gid</td>
                  <td className="py-2 pr-4">Google Analytics</td>
                  <td className="py-2 pr-4">Distinguish users</td>
                  <td className="py-2">24 hours</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">_gat</td>
                  <td className="py-2 pr-4">Google Analytics</td>
                  <td className="py-2 pr-4">Throttle request rate</td>
                  <td className="py-2">1 minute</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Various</td>
                  <td className="py-2 pr-4">Google AdSense</td>
                  <td className="py-2 pr-4">
                    Serve and measure advertisements
                  </td>
                  <td className="py-2">Varies</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Local Storage
          </h2>
          <p>
            In addition to cookies, FiberTools uses your browser&apos;s
            localStorage to save preferences like your preferred unit system
            (yards vs. meters) and dark mode setting. This data never leaves
            your device and is not shared with anyone.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Essential vs. Non-Essential Cookies
          </h2>
          <p>
            <strong>Essential:</strong> FiberTools does not use any cookies that
            are strictly necessary for the site to function. All tools work
            without cookies.
          </p>
          <p>
            <strong>Non-essential (analytics &amp; advertising):</strong> Google
            Analytics and AdSense cookies are non-essential. Under GDPR, we
            request your consent before loading these. You can withdraw consent
            at any time via the cookie banner.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Google Consent Mode v2
          </h2>
          <p>
            We implement Google Consent Mode v2, which means:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Before you consent, Google tags load in a restricted mode that does
              not store cookies
            </li>
            <li>
              After you consent, full analytics and ad personalization cookies
              are enabled
            </li>
            <li>
              If you decline, Google tags remain restricted and no tracking
              cookies are set
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            How to Manage Cookies
          </h2>
          <p>You can manage cookies in several ways:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Cookie banner:</strong> Use the consent banner that appears
              when you first visit to accept or decline non-essential cookies
            </li>
            <li>
              <strong>Browser settings:</strong> Most browsers let you block or
              delete cookies through their settings menu
            </li>
            <li>
              <strong>Google opt-out:</strong> Visit{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
            </li>
            <li>
              <strong>Ad personalization:</strong> Visit{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Google Ad Settings
              </a>{" "}
              to manage personalized ads
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Contact
          </h2>
          <p>
            Questions about cookies? Email us at{" "}
            <a
              href="mailto:hello@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              hello@fibertools.app
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
