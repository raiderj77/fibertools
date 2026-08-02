import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How FiberTools uses cookies, analytics, advertising, and how to manage your preferences.",
  keywords: ["cookie policy", "cookies", "analytics cookies", "FiberTools cookies"],
  openGraph: {
    title: "Cookie Policy",
    description:
      "How FiberTools uses cookies, analytics, advertising, and how to manage your preferences.",
    url: "https://fibertools.app/cookies",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Cookie Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy",
    description:
      "How FiberTools uses cookies, analytics, advertising, and how to manage your preferences.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/cookies" },
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Cookie Policy
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Last updated: August 1, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What Are Browser Cookies
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help the site remember your preferences and understand
            how you use it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Cookies and Browser Storage Used on FiberTools
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
                  <td className="py-2 pr-4">cookie_consent (localStorage)</td>
                  <td className="py-2 pr-4">FiberTools</td>
                  <td className="py-2 pr-4">Record the optional analytics choice</td>
                  <td className="py-2">Until cleared or replaced</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">empire_gpc</td>
                  <td className="py-2 pr-4">FiberTools</td>
                  <td className="py-2 pr-4">Honor a server-observed Global Privacy Control signal</td>
                  <td className="py-2">Up to 30 days; removed when the signal stops</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">TCF consent record (future)</td>
                  <td className="py-2 pr-4">Google Privacy &amp; messaging</td>
                  <td className="py-2 pr-4">Record and communicate advertising choices</td>
                  <td className="py-2">Exact storage and retention must be verified before activation</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Various</td>
                  <td className="py-2 pr-4">Google AdSense (currently paused)</td>
                  <td className="py-2 pr-4">
                    Serve and measure advertisements
                  </td>
                  <td className="py-2">Not set while paused; later varies by choice and cookie</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Local Storage and Preferences
          </h2>
          <p>
            In addition to cookies, FiberTools uses your browser&apos;s
            localStorage to save preferences like your preferred unit system
            (yards vs. meters), dark mode setting, and optional analytics
            choice. These preferences remain on your device unless a service
            must receive the choice to honor it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Essential vs. Non-Essential Cookies
          </h2>
          <p>
            <strong>Privacy-essential:</strong> The calculators work without
            cookies. When a browser sends Global Privacy Control, FiberTools uses
            the first-party empire_gpc cookie to preserve that opt-out before any
            optional Google service can load. It is removed after the browser
            stops sending the signal.
          </p>
          <p>
            <strong>Non-essential services:</strong> Google Analytics cookies are
            optional and are controlled by the separate Analytics choices control.
            AdSense is currently paused. Before advertising is activated, Google
            Privacy &amp; messaging, a Google-certified consent management platform
            using IAB TCF v2.3, will manage advertising choices separately. You
            can withdraw an analytics choice at any time through the Analytics
            choices link in the footer.
          </p>
          <p>
            If ads are activated, third-party vendors including Google may use
            cookies or similar storage to serve ads based on this visit and prior
            visits to FiberTools or other sites. Before activation, FiberTools
            will either disable third-party ad serving beyond Google or list and
            link every enabled advertising vendor and network in the Privacy
            Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Google Privacy and Consent Controls
          </h2>
          <p>
            Our release controls separate optional analytics, the certified Google
            privacy message, and actual ad inventory. This means:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              FiberTools does not download Google Analytics until you explicitly
              allow analytics
            </li>
            <li>
              Allowing analytics does not grant advertising storage or ad
              personalization
            </li>
            <li>
              When advertising is eventually enabled, Google&apos;s certified IAB
              TCF v2.3 message will collect, record, and communicate advertising
              choices; a legacy FiberTools analytics choice cannot activate ads
            </li>
            <li>
              A Global Privacy Control signal blocks both optional analytics and
              the Google advertising bootstrap on FiberTools
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
              <strong>Analytics choices:</strong> Use the analytics banner when you first
              visit, or the Analytics choices link in the footer later, to allow or
              decline optional analytics
            </li>
            <li>
              <strong>European advertising consent:</strong> After advertising is
              activated, use Google&apos;s message or the Privacy and cookie settings
              link shown in the footer where European regulations apply
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
            Contact Us About Cookies
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
    </div>
  );
}
