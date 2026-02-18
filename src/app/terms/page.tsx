import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms and conditions for using FiberTools.app — free calculators for knitters, crocheters, and weavers.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Terms of Use
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Last updated: February 17, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Acceptance of Terms
          </h2>
          <p>
            By accessing or using FiberTools (
            <a
              href="https://fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              fibertools.app
            </a>
            ), you agree to be bound by these Terms of Use. If you do not agree,
            please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Description of Service
          </h2>
          <p>
            FiberTools provides free, browser-based calculators and reference
            tools for fiber arts including knitting, crochet, weaving, spinning,
            and embroidery. All calculations run entirely in your browser — we do
            not process or store your inputs on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Disclaimer of Warranties
          </h2>
          <p>
            FiberTools is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; without warranties of any kind, either express or
            implied. While we strive for accuracy in all calculations, we cannot
            guarantee that results will be error-free.
          </p>
          <p>
            Yarn quantities, gauge calculations, stitch counts, and other
            outputs are estimates. Actual results may vary based on your yarn,
            tension, tools, and technique. Always buy extra yarn and swatch
            before starting a project.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, FiberTools and its
            operators shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            site. This includes, but is not limited to, damages resulting from
            inaccurate calculations, wasted materials, or project outcomes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Intellectual Property
          </h2>
          <p>
            All content on FiberTools — including text, graphics, logos, icons,
            and software — is the property of FiberTools or its content
            suppliers and is protected by copyright law. You may use the tools
            for personal and commercial crafting purposes, but you may not
            reproduce, distribute, or create derivative works of the site itself.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Acceptable Use
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Use the site in any way that violates applicable laws or
              regulations
            </li>
            <li>
              Attempt to interfere with or disrupt the site&apos;s
              infrastructure
            </li>
            <li>Scrape, crawl, or harvest data from the site in bulk</li>
            <li>
              Reproduce or redistribute the tools as your own product
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Third-Party Links
          </h2>
          <p>
            FiberTools may contain links to third-party websites (such as yarn
            retailers, pattern sites, or MyCrochetKit). We are not responsible
            for the content or privacy practices of those sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Advertising
          </h2>
          <p>
            FiberTools is a free service supported by advertising. Ads are served
            by Google AdSense and may use cookies. See our{" "}
            <a
              href="/privacy"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/cookies"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Cookie Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Privacy
          </h2>
          <p>
            Your use of FiberTools is also governed by our{" "}
            <a
              href="/privacy"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Privacy Policy
            </a>
            , which describes how we collect and use information.
          </p>
          <p>
            <strong>GDPR:</strong> If you are located in the EU, EEA, or UK,
            you have rights under the General Data Protection Regulation
            including the right to access, correct, and delete your data.
          </p>
          <p>
            <strong>CCPA:</strong> If you are a California resident, you have
            rights under the California Consumer Privacy Act including the right
            to know, delete, and opt out of the sale of personal information. We
            do not sell personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Modifications
          </h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will
            be posted on this page with an updated date. Your continued use of
            the site constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Governing Law
          </h2>
          <p>
            These terms are governed by the laws of the State of California,
            United States, without regard to conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Contact
          </h2>
          <p>
            Questions about these terms? Email us at{" "}
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
