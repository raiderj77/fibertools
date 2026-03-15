import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the FiberTools team. Report bugs, suggest features, or ask questions about our free fiber arts calculators.",
  keywords: ["contact", "feedback", "bug report", "FiberTools contact"],
  openGraph: {
    title: "Contact",
    description:
      "Get in touch with the FiberTools team. Report bugs, suggest features, or ask questions about our free fiber arts calculators.",
    url: "https://fibertools.app/contact",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Contact" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description:
      "Get in touch with the FiberTools team. Report bugs, suggest features, or ask questions about our free fiber arts calculators.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-8">
        Contact Us
      </h1>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-8 text-bark-700 dark:text-cream-300">
        <section>
          <p>
            FiberTools is a free collection of online calculators and utilities
            built specifically for knitters, crocheters, weavers, spinners, and
            fiber artists of every skill level. Every tool on the site is
            designed by someone with over 30 years of hands-on fiber arts
            experience, so we understand the real-world problems crafters face
            when planning projects, converting measurements, or adjusting
            patterns.
          </p>
          <p>
            Whether you are a beginner figuring out how much yarn you need for
            your first scarf or an experienced maker calculating complex shaping
            for a custom garment, we want to hear from you. Your feedback helps
            us improve existing tools, fix errors, and build new calculators
            that the fiber arts community actually needs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Get in Touch
          </h2>
          <p>
            The best way to reach us is by email. Send your message to the
            address below and we will get back to you as quickly as we can.
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
            What Can I Help You With?
          </h2>
          <p>
            We welcome all kinds of messages from the fiber arts community. Here
            are some of the most common reasons people get in touch:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Tool feedback</strong> — Let us know if a calculator gave
              you an unexpected result, if the interface is confusing, or if
              you have ideas for improving an existing tool. Specific details
              (the values you entered, the result you expected) help us
              investigate faster.
            </li>
            <li>
              <strong>Yarn calculation questions</strong> — Unsure which
              calculator to use for your project, or need help interpreting a
              result? We are happy to point you in the right direction.
            </li>
            <li>
              <strong>Pattern suggestions</strong> — If you would like to see a
              calculator or reference chart for a specific technique, stitch
              pattern, or craft discipline, let us know. Many of the tools on
              FiberTools started as user suggestions.
            </li>
            <li>
              <strong>Bug reports</strong> — Something broken, displaying
              incorrectly, or not loading? Please include the device and
              browser you are using so we can reproduce the issue.
            </li>
            <li>
              <strong>Accessibility issues</strong> — We are committed to
              making every tool usable by everyone. If you encounter a barrier
              related to screen readers, keyboard navigation, color contrast,
              or any other accessibility concern, please tell us so we can fix
              it.
            </li>
            <li>
              <strong>Partnership and collaboration inquiries</strong> — If you
              are a yarn brand, pattern designer, fiber arts educator, or
              content creator interested in working together, we would love to
              hear your ideas.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Response Time
          </h2>
          <p>
            FiberTools is maintained by a small, dedicated team, so we
            typically respond within 2&ndash;3 business days. If your message is
            about a critical bug that prevents a tool from working, we will do
            our best to prioritize it. We read every email we receive, even if
            it takes a little time to reply.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Other Ways to Connect
          </h2>
          <p>
            While email is the fastest way to reach us directly, you can also
            explore the full suite of free tools available on FiberTools. If you
            have not tried them yet, here are a few popular starting points:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Link
                href="/yarn-calculator"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Yarn Calculator
              </Link>{" "}
              — Estimate how much yarn you need for any project based on gauge,
              dimensions, and stitch pattern.
            </li>
            <li>
              <Link
                href="/gauge-calculator"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Gauge Calculator
              </Link>{" "}
              — Convert your swatch measurements into accurate stitch and row
              counts for pattern sizing.
            </li>
            <li>
              <Link
                href="/blanket-calculator"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Blanket Size Calculator
              </Link>{" "}
              — Find the right dimensions and yarn requirements for blankets of
              every size, from baby to king.
            </li>
          </ul>
          <p>
            Browse all of our tools from the homepage to discover calculators for
            hats, socks, granny squares, cross-stitch, color pooling, and much
            more.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Frequently Asked Questions
          </h2>

          <h3 className="text-lg font-medium text-bark-800 dark:text-cream-100 mt-4">
            Is FiberTools free?
          </h3>
          <p>
            Yes. Every calculator and tool on FiberTools is completely free to
            use. The site is supported by ads, which allows us to keep all tools
            available without requiring a subscription or login. We also offer
            offline access through our progressive web app, so you can use your
            favorite tools even without an internet connection.
          </p>

          <h3 className="text-lg font-medium text-bark-800 dark:text-cream-100 mt-4">
            Who creates these tools?
          </h3>
          <p>
            FiberTools is created by a fiber arts expert with over 30 years of
            experience in knitting, crochet, weaving, and other textile crafts.
            Every calculator is built with real-world crafting scenarios in mind,
            tested against established references, and refined based on
            community feedback.
          </p>

          <h3 className="text-lg font-medium text-bark-800 dark:text-cream-100 mt-4">
            Can I suggest a new calculator?
          </h3>
          <p>
            Absolutely. Many of the tools on FiberTools were inspired by
            requests from crafters just like you. If there is a calculation you
            find yourself doing by hand over and over, send us an email at{" "}
            <a
              href="mailto:hello@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              hello@fibertools.app
            </a>{" "}
            and describe the problem you are trying to solve. We review every
            suggestion and prioritize based on how many crafters would benefit.
          </p>
        </section>
      </div>
    </main>
  );
}
