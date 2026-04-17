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
        Last updated: April 16, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Who We Are at FiberTools
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
            What Data We Collect
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
            Cookies and Tracking Technologies
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
          <p>
            We work with third-party advertising partners, including Google, who
            may use cookies to serve ads based on your prior visits to this
            website or other websites. You can opt out of personalized
            advertising at{" "}
            <a
              href="https://ads.google.com/settings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Google Ad Settings
            </a>{" "}
            or the{" "}
            <a
              href="https://optout.aboutads.info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Digital Advertising Alliance opt-out portal
            </a>
            .
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
            Third-Party Services We Use
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
            Your Data Privacy Rights
          </h2>
          <p>
            <strong>GDPR (EU/EEA/UK users):</strong> You have the right to
            access, correct, delete, or port your personal data. You may also
            object to or restrict processing. Since we collect minimal data, most
            of these rights are satisfied by default. Contact us if you have
            questions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Children&apos;s Privacy Protection
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
            Data Retention and Storage
          </h2>
          <p>
            Analytics data is retained according to Google Analytics default
            settings (14 months). Microsoft Clarity session data is retained for
            up to 30 days. We do not maintain any separate database of
            user information.
          </p>
        </section>

        <section id="california-privacy" aria-labelledby="california-heading">
          <h2 id="california-heading" className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            California Privacy Rights (CCPA/CPRA)
          </h2>

          <p>
            If you are a California resident, the California Consumer Privacy Act (CCPA) as amended
            by the California Privacy Rights Act (CPRA) grants you specific rights regarding your
            personal information. These rights are effective as of January 1, 2026.
          </p>

          <h3>Information We Collect</h3>
          <p>In the past 12 months we have collected the following categories of personal information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Identifiers:</strong> IP address, browser type, device identifiers collected via analytics and advertising.</li>
            <li><strong>Internet or network activity:</strong> Pages visited, tools used, time on site, referring URLs.</li>
            <li><strong>Commercial information:</strong> Product interactions inferred from tool usage (e.g., yarn-related interests) used for affiliate advertising targeting.</li>
            <li><strong>Inferred data:</strong> Interests or preferences inferred from browsing behavior via advertising and affiliate partners.</li>
          </ul>

          <h3>Sensitive Personal Information</h3>
          <p>
            As of January 1, 2026, California law defines an expanded category of sensitive personal
            information. <strong>FiberTools does not collect sensitive personal information</strong>
            {" "}as defined under CPRA, which includes: precise geolocation data, racial or ethnic origin,
            religious beliefs, union membership, contents of private communications, genetic data,
            biometric data, health or medical information, sexual orientation, or financial account data.
          </p>

          <h3>Data Minimization</h3>
          <p>
            We collect only the minimum personal information necessary to operate this service and
            serve relevant advertising. We do not collect personal information beyond what is
            reasonably necessary and proportionate to the purposes disclosed in this policy.
          </p>

          <h3>How We Use Your Information</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>To display advertising through Google AdSense</li>
            <li>To serve relevant product recommendations through Amazon Associates and other affiliate programs</li>
            <li>To analyze site traffic and improve tool functionality via analytics</li>
            <li>To maintain site security and prevent fraud</li>
          </ul>
          <p>We do not sell your personal information as defined under CCPA. Sharing data with advertising partners for targeted advertising may constitute &ldquo;sharing&rdquo; under CPRA — you may opt out using the methods below.</p>

          <h3>Your Rights as a California Resident</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Right to Know:</strong> Request disclosure of categories and specific pieces of personal information collected in the past 12 months.</li>
            <li><strong>Right to Delete:</strong> Request deletion of personal information we have collected, subject to certain exceptions.</li>
            <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information.</li>
            <li><strong>Right to Opt-Out:</strong> Opt out of the sale or sharing of your personal information. You may also use a Global Privacy Control (GPC) signal, which we honor automatically.</li>
            <li><strong>Right to Limit Use of Sensitive Information:</strong> Direct us to limit use of sensitive personal information to necessary service functions.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of these rights.</li>
          </ul>

          <h3>Do Not Sell or Share My Personal Information</h3>
          <p>
            To opt out of sharing for advertising purposes, use a{" "}
            <a
              href="https://globalprivacycontrol.org/"
              rel="noopener noreferrer"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Global Privacy Control (GPC)
            </a>-enabled
            browser, or contact us via the{" "}
            <a
              href="/contact"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Contact page
            </a>{" "}
            to submit a manual opt-out request.
          </p>

          <h3>How to Submit a Request</h3>
          <p>
            Contact us via the{" "}
            <a
              href="/contact"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Contact page
            </a>
            . We will respond within 45 days. Identity verification may be required.
          </p>

          <h3>Data Retention</h3>
          <p>Analytics data is retained for 26 months. Server logs are retained for 90 days. We do not retain tool calculation inputs beyond your browser session.</p>
        </section>

        <section id="state-privacy" aria-labelledby="state-heading">
          <h2 id="state-heading" className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Additional U.S. State Privacy Rights
          </h2>
          <p>
            Residents of the following states have privacy rights similar to California&apos;s CCPA/CPRA.
            To exercise your rights, contact us via the{" "}
            <a href="/contact" className="text-sage-600 dark:text-sage-400 underline">Contact page</a>.
            We will respond within the timeframe required by your state&apos;s law.
          </p>
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Law</th>
                <th>Effective</th>
                <th>Key Rights</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Colorado</td><td>CPA</td><td>Jul 2023</td><td>Access, delete, correct, opt-out, portability</td></tr>
              <tr><td>Connecticut</td><td>CTDPA</td><td>Jul 2023</td><td>Access, delete, correct, opt-out, portability</td></tr>
              <tr><td>Virginia</td><td>VCDPA</td><td>Jan 2023</td><td>Access, delete, correct, opt-out</td></tr>
              <tr><td>Texas</td><td>TDPSA</td><td>Jul 2024</td><td>Access, delete, correct, opt-out</td></tr>
              <tr><td>Florida</td><td>FDBR</td><td>Jul 2024</td><td>Access, delete, correct, opt-out</td></tr>
              <tr><td>Montana</td><td>MTCPA</td><td>Oct 2024</td><td>Access, delete, correct, opt-out</td></tr>
              <tr><td>Oregon</td><td>OCPA</td><td>Jul 2024</td><td>Access, delete, correct, opt-out, portability</td></tr>
              <tr><td>Tennessee</td><td>TIPA</td><td>Jul 2025</td><td>Access, delete, correct, opt-out</td></tr>
              <tr><td>Minnesota</td><td>MNDPA</td><td>Jul 2025</td><td>Access, delete, correct, opt-out, portability</td></tr>
              <tr><td>Maryland</td><td>MODPA</td><td>Oct 2025</td><td>Access, delete, correct, opt-out; bans sale of sensitive data</td></tr>
              <tr><td>Indiana</td><td>IDCPA</td><td>Jan 2026</td><td>Access, delete, correct, opt-out</td></tr>
              <tr><td>Kentucky</td><td>KYCPA</td><td>Jan 2026</td><td>Access, delete, correct, opt-out</td></tr>
              <tr><td>Rhode Island</td><td>RIDPA</td><td>Jan 2026</td><td>Access, delete, correct, opt-out</td></tr>
            </tbody>
          </table>
          <p className="mt-4">
            We honor Global Privacy Control (GPC) signals from all states that require it.
            We do not sell personal information to third parties. We do not engage in targeted
            advertising using sensitive personal information.
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
            Contact Us About Privacy
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
