import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "FiberTools is committed to making our calculators and tools accessible to everyone, including people with disabilities.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        Accessibility Statement
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Last updated: February 17, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Our Commitment
          </h2>
          <p>
            FiberTools is committed to ensuring digital accessibility for people
            with disabilities. We are continually improving the user experience
            for everyone and applying the relevant accessibility standards.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Standards We Follow
          </h2>
          <p>
            We aim to conform to the{" "}
            <a
              href="https://www.w3.org/TR/WCAG22/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              Web Content Accessibility Guidelines (WCAG) 2.2
            </a>{" "}
            at Level AA. These guidelines explain how to make web content more
            accessible to people with a wide range of disabilities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What We&apos;ve Done
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Semantic HTML throughout — proper headings, landmarks, labels, and
              form elements
            </li>
            <li>
              Keyboard navigable — all tools and navigation can be used without a
              mouse
            </li>
            <li>
              Color contrast — our sage/bark/cream color palette meets WCAG AA
              contrast ratios
            </li>
            <li>
              Dark mode — reduces eye strain and improves readability in low-light
              environments
            </li>
            <li>
              Responsive design — works on screens from mobile to desktop
            </li>
            <li>
              Large touch targets — buttons and inputs are sized for easy tapping
              on mobile devices
            </li>
            <li>
              No auto-playing media — no unexpected sounds or animations
            </li>
            <li>
              Text resizing — content reflows properly when text size is increased
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Known Limitations
          </h2>
          <p>
            While we strive for full accessibility, some areas may have
            limitations:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Some older blog content may not yet have fully optimized heading
              structures
            </li>
            <li>
              Third-party content such as advertisements may not meet our
              accessibility standards
            </li>
          </ul>
          <p>
            We are actively working to address these limitations and welcome your
            feedback.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Assistive Technology
          </h2>
          <p>FiberTools is designed to be compatible with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Screen readers (VoiceOver, NVDA, JAWS, TalkBack)</li>
            <li>Voice control software</li>
            <li>Screen magnification tools</li>
            <li>Keyboard-only navigation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Feedback
          </h2>
          <p>
            We welcome your feedback on the accessibility of FiberTools. If you
            encounter any accessibility barriers or have suggestions for
            improvement, please contact us:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:hello@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              hello@fibertools.app
            </a>
          </p>
          <p>
            We aim to respond to accessibility feedback within 5 business days
            and to resolve issues as quickly as possible.
          </p>
        </section>
      </div>
    </main>
  );
}
