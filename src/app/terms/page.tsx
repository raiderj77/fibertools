import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms and conditions for using FiberTools.app, free calculators for knitters, crocheters, and weavers.",
  keywords: ["terms of use", "terms and conditions", "fiber arts tools terms", "FiberTools terms"],
  openGraph: {
    title: "Terms of Use",
    description:
      "Terms and conditions for using FiberTools.app, free calculators for knitters, crocheters, and weavers.",
    url: "https://fibertools.app/terms",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Terms of Use" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use",
    description:
      "Terms and conditions for using FiberTools.app, free calculators for knitters, crocheters, and weavers.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Terms of Use
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Last updated: August 26, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Acceptance of Terms of Use
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
            Description of FiberTools Service
          </h2>
          <p>
            FiberTools provides free, browser-based calculators and reference
            tools for fiber arts including knitting, crochet, weaving, spinning,
            and embroidery. Calculator inputs run entirely in your browser and are
            not stored on our servers. FiberTools also offers an optional paid
            Fiber Project Planning Pack and a limited manual Designer Pattern
            Preflight pilot under the separate terms below. The StitchProof Designer
            workspace is a browser-local preview whose proposed paid download remains
            unavailable unless FiberTools separately enables a verified checkout.
          </p>
        </section>

        <section id="fiber-project-planning-pack">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Fiber Project Planning Pack Terms
          </h2>
          <p>
            The Fiber Project Planning Pack is a $17 digital PDF workbook for
            personal project-planning use. A purchaser may save and print clean
            working copies for their own projects, but may not resell, redistribute,
            publish, sublicense, or claim ownership of the workbook or its templates.
          </p>
          <p>
            The pack is a general organizational aid, not a pattern, calculator,
            professional instruction, or guarantee of project results. Stripe processes
            checkout. After successful payment, Stripe returns the purchaser to FiberTools,
            where FiberTools verifies the paid Checkout Session and provides the approved
            private PDF as a digital download. If the download does not complete, contact
            hello@fibertools.app. Any refund must be confirmed through Stripe; a download
            or website message is not confirmation of a refund. When checkout is unavailable,
            the website shows a contact action and does not accept payment.
          </p>
        </section>

        <section id="stitchproof-designer-workspace">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            StitchProof Designer Workspace Terms
          </h2>
          <p>
            StitchProof applies deterministic rules to supported US-terminology
            amigurumi round notation. The free checker remains available for up to
            20 rounds. The Designer workspace preview can check larger projects,
            record user corrections, and compare two versions in the browser. When
            checkout is available, the Designer Report has a $9 base price once for one pattern
            project, including its revisions and report exports. Any applicable tax
            and the final total are shown by Stripe before payment. It is not a
            subscription. An unrelated pattern needs its own project purchase. The
            free checker, on-screen preview, and private JSON backup remain available
            without payment. If the purchase controls say checkout is unavailable,
            you cannot start a new checkout through FiberTools. A previously opened
            Stripe checkout may remain payable until it expires; closing new sales
            does not itself cancel that session or issue a refund.
          </p>
          <p>
            Pattern text and project metadata are not uploaded to FiberTools by the
            workspace. Saving is off by default. If you explicitly save a project on
            the device, you are responsible for access to that device and browser
            profile. Clearing browser data may permanently remove the project. JSON
            backup and restore are provided for portability; you are responsible for
            protecting exported files and any printer or cloud destination you select.
          </p>
          <p>
            Before checkout, keep a private recovery backup. It contains the project
            and its purchase recovery key, so anyone with that file may be able to
            restore the project and its access. Stripe processes payment in a separate
            tab; no pattern instructions or project title are sent to Stripe. FiberTools
            verifies the payment online before enabling professional print/PDF and CSV
            exports. A backup, checkout redirect, or local paid label alone does not
            prove payment. Previously exported files can be kept and used offline.
          </p>
          <p>
            Restoring the same project backup preserves its purchase reference for
            revisions; it does not require another purchase. Clearing browser data
            without a backup can remove the local recovery key. If access cannot be
            verified, contact hello@fibertools.app with your Stripe receipt, not your
            pattern or recovery key. Payment or refund questions are handled separately
            from local project storage; a website message is not confirmation of a refund.
          </p>
          <p>
            A Designer QA Report records what the deterministic parser could and could
            not evaluate. It is not professional tech editing, pattern testing,
            certification, authorship detection, or a guarantee that a pattern is
            correct, safe, original, human-written, publishable, or error-free. It does
            not verify gauge, sizing, fit, yarn choice, assembly, images, charts, garment
            shaping, knitting instructions, or unsupported crochet notation. User-entered
            corrections remain the user&apos;s assertions and are not independently verified
            by FiberTools. A human review is still appropriate before publication.
          </p>
          <p>
            You retain ownership of pattern content you enter. The default report does
            not reproduce the full pattern. If you explicitly choose to include short
            instruction excerpts, you confirm that you have the right to reproduce those
            excerpts in your private output.
          </p>
        </section>

        <section id="designer-pattern-preflight">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Designer Pattern Preflight Pilot Terms
          </h2>
          <p>
            The limited pilot price is $39 for one submitted crochet pattern, one
            version up to 10 pages, a manual math and consistency review, and one
            written report. The delivery target is three business days after confirmed
            payment and working access to a complete pattern. It is a target, not a
            guaranteed deadline.
          </p>
          <p>
            This service is an affordable preflight intended to flag possible supported
            arithmetic errors, inconsistencies, missing information, and areas requiring
            human review. It is not professional tech editing, pattern testing, rewriting,
            grading, sizing or fit verification, gauge or yarn verification, certification,
            or a guarantee that a pattern or finished item is error-free. No ongoing revision
            rounds or ongoing consultation are included. FiberTools does not provide
            clinical, legal, copyright, or business advice through this service.
          </p>
          <p>
            You confirm that you created the submitted pattern or have permission to share
            it for review, and that your private link grants FiberTools temporary view access.
            You retain ownership of your pattern. FiberTools will not use it for AI training,
            public examples, marketing, or product development without separate written permission.
          </p>
          <p>
            If FiberTools cannot access or fulfill a paid submission, contact
            jason@fibertools.app. Refund decisions are handled through Stripe based on the
            circumstances. FiberTools does not issue refunds automatically, and no website
            workflow may be treated as confirmation until Stripe records the refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Disclaimer of Warranties and Accuracy
          </h2>
          <p>
            FiberTools is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; without warranties of any kind, either express or
            implied. While we strive for accuracy in all calculations, we cannot
            guarantee that results will be error-free.
          </p>
          <p>
            Yarn quantities, gauge calculations, stitch counts, parser results,
            comparisons, and other outputs are planning or review aids. Actual
            results may vary based on your yarn, tension, tools, technique, pattern
            wording, and unsupported instructions. Always swatch and use appropriate
            human review before relying on an output.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Limitation of Liability for Calculations
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
            Intellectual Property and Copyright
          </h2>
          <p>
            All content on FiberTools, including text, graphics, logos, icons,
            and software, is the property of FiberTools or its content
            suppliers and is protected by copyright law. You may use the tools
            for personal and commercial crafting purposes, but you may not
            reproduce, distribute, or create derivative works of the site itself.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Acceptable Use of FiberTools
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
            Third-Party Links and Resources
          </h2>
          <p>
            FiberTools may contain links to third-party websites (such as yarn
            retailers, pattern sites, or MyCrochetKit). We are not responsible
            for the content or privacy practices of those sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Advertising on FiberTools
          </h2>
          <p>
            FiberTools keeps its self-service calculators free with support from
            affiliate links and may add advertising after AdSense approval. Google AdSense is not currently
            enabled. If ads are enabled later, cookie use will follow your consent
            choices. See our{" "}
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
            Privacy and Data Protection
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
            Modifications to These Terms
          </h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will
            be posted on this page with an updated date. Your continued use of
            the site constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Governing Law and Jurisdiction
          </h2>
          <p>
            These terms are governed by the laws of the State of California,
            United States, without regard to conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Contact Us About Terms
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
    </div>
  );
}
