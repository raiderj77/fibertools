import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FiberTools handles your data. We collect minimal analytics, run no ads tracking without consent, and never sell your personal information.",
  keywords: ["privacy policy", "data protection", "fiber arts tools privacy", "FiberTools privacy"],
  openGraph: {
    title: "Privacy Policy",
    description:
      "How FiberTools handles your data. We collect minimal analytics, run no ads tracking without consent, and never sell your personal information.",
    url: "https://fibertools.app/privacy",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "How FiberTools handles your data. We collect minimal analytics, run no ads tracking without consent, and never sell your personal information.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Last updated: March 11, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Who We Are
          </h2>
          <p>
            FiberTools (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;)
            operates the website{" "}
            <a
              href="https://fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              fibertools.app
            </a>
            . We provide free, browser-based calculators and tools for knitters,
            crocheters, weavers, spinners, and embroiderers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What We Collect
          </h2>
          <p>
            All FiberTools calculators run entirely in your browser. We do not
            send your inputs, results, or calculations to any server. Here is
            what we do collect:
          </p>
          <p>
            <strong>Analytics (Google Analytics 4):</strong> We use GA4 to
            understand how people use the site — which pages are visited, how
            long sessions last, and general geographic region. GA4 uses
            first-party cookies. We have IP anonymization enabled. No personally
            identifiable information is collected through analytics.
          </p>
          <p>
            <strong>Advertising (Google AdSense):</strong> If and when ads are
            displayed, Google AdSense may use cookies to serve ads based on your
            prior visits to this or other websites. You can opt out of
            personalized advertising at{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Google Ad Settings
            </a>
            .
          </p>
          <p>
            <strong>Local Storage:</strong> Some tools save your preferences
            (such as unit toggle between yards and meters) in your
            browser&apos;s localStorage. This data never leaves your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Cookies
          </h2>
          <p>
            We use cookies for analytics and advertising. For full details, see
            our{" "}
            <a
              href="/cookies"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Cookie Policy
            </a>
            . You can manage your cookie preferences at any time through the
            cookie consent banner or your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            How We Use Your Information
          </h2>
          <p>We use the limited data we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Understand which tools are most popular so we can improve them</li>
            <li>Monitor site performance and fix errors</li>
            <li>Display relevant advertising to support the free service</li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, or share your personal
            information with third parties for their own marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Third-Party Services
          </h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Google Analytics 4</strong> — website analytics (
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Google Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Google AdSense</strong> — advertising (
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                How Google uses cookies in advertising
              </a>
              )
            </li>
            <li>
              <strong>Vercel</strong> — hosting and CDN (
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Vercel Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Microsoft Clarity</strong> — heatmaps and session recordings
              to understand how visitors interact with the site (
              <a
                href="https://privacy.microsoft.com/en-us/privacystatement"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Microsoft Privacy Statement
              </a>
              )
            </li>
            <li>
              <strong>Amazon Associates</strong> — affiliate product links. We may
              earn a small commission when you purchase through our links. This does
              not affect the price you pay. (
              <a
                href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Amazon Privacy Notice
              </a>
              )
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Your Rights
          </h2>
          <p>
            <strong>GDPR (EU/EEA/UK users):</strong> You have the right to
            access, correct, delete, or port your personal data. You may also
            object to or restrict processing. Since we collect minimal data, most
            of these rights are satisfied by default. Contact us if you have
            questions.
          </p>
          <p>
            <strong>CCPA/CPRA (California users):</strong> You have the right to
            know what personal information we collect, to request deletion, to
            request correction of inaccurate data, to opt out of the sale or
            sharing of personal information, and to limit the use of sensitive
            personal information. We do not sell personal information. We honor
            Global Privacy Control (GPC) signals as a valid opt-out request. See
            our{" "}
            <a
              href="/do-not-sell"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Do Not Sell My Personal Information
            </a>{" "}
            page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Children&apos;s Privacy
          </h2>
          <p>
            FiberTools is not directed at children under 13. We do not knowingly
            collect personal information from children. If you believe a child
            has provided us with personal data, please contact us and we will
            delete it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Data Retention
          </h2>
          <p>
            Analytics data is retained according to Google Analytics default
            settings (14 months). Microsoft Clarity session data is retained for
            up to 30 days. We do not maintain any separate database of
            user information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Sensitive Personal Information
          </h2>
          <p>
            Effective January 1, 2026, the CCPA/CPRA defines expanded categories
            of sensitive personal information including: mental and physical
            health data, biometric and genetic data, precise geolocation, and
            citizenship or immigration status.
          </p>
          <p>
            FiberTools does <strong>not</strong> collect, process, or store any
            of these sensitive data categories. Our tools are browser-based
            calculators for fiber arts and do not request, access, or infer any
            sensitive personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated date. Continued use of the site after
            changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Contact
          </h2>
          <p>
            Questions about this policy? Email us at{" "}
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
