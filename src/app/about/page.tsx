import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FiberTools",
  description:
    "Free fiber arts calculators for knitters, crocheters, and weavers. Our mission: make yarn math accessible to everyone.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        About FiberTools
      </h1>
      <p className="text-sm text-bark-500 dark:text-cream-400 mb-8">
        Making fiber arts more accessible, one calculation at a time
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Our Mission
          </h2>
          <p>
            FiberTools was created to solve a simple problem: fiber arts math
            shouldn't be a barrier to creativity. Whether you're calculating yarn
            requirements, checking gauge, or planning a project, our tools make
            the numbers easy so you can focus on what matters — creating
            beautiful things.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What We Believe
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Accessibility First
              </h3>
              <p>
                Every tool we build is completely free, requires no account, and
                works on any device. We believe helpful resources should be
                available to everyone, regardless of experience level or budget.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Education Through Tools
              </h3>
              <p>
                Our calculators don't just give answers — they help you
                understand the "why" behind the numbers. We include explanations,
                tips, and learning resources with every tool.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Community-Driven Development
              </h3>
              <p>
                We listen to the fiber arts community. New tools are built based
                on real needs expressed by knitters, crocheters, and weavers.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Our Tools
          </h2>
          <p>
            We specialize in practical calculators that solve common fiber arts
            challenges:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Yarn Calculators:</strong> Estimate yardage, compare
              weights, calculate substitutions
            </li>
            <li>
              <strong>Gauge Tools:</strong> Convert between stitch counts,
              calculate project dimensions
            </li>
            <li>
              <strong>Project Planning:</strong> Budget yarn costs, estimate
              time, plan colorwork
            </li>
            <li>
              <strong>Reference Guides:</strong> Yarn weight charts, needle size
              conversions, fiber care
            </li>
          </ul>
          <p className="mt-4">
            All tools are built with modern web standards, work offline when
            possible, and are regularly updated based on user feedback.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            How We Operate
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Free & Always Will Be
              </h3>
              <p>
                FiberTools will always be free to use. We may display
                non-intrusive ads to cover hosting and development costs, but
                the core functionality will never require payment.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Privacy Respect
              </h3>
              <p>
                We collect minimal data and never sell personal information. Our
                tools work without tracking when possible. See our{" "}
                <a
                  href="/privacy"
                  className="text-sage-600 dark:text-sage-400 underline"
                >
                  Privacy Policy
                </a>{" "}
                for details.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Transparency
              </h3>
              <p>
                We're open about how our tools work, what data we collect, and
                how we make decisions. Questions? Check our{" "}
                <a
                  href="/contact"
                  className="text-sage-600 dark:text-sage-400 underline"
                >
                  Contact page
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            For the Community
          </h2>
          <p>
            FiberTools is more than just calculators — it's a resource for the
            entire fiber arts community:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Educational Content:</strong> Blog posts, tutorials, and
              guides to help crafters learn and grow
            </li>
            <li>
              <strong>Beginner-Friendly:</strong> Tools designed to be
              approachable for new crafters while still useful for experts
            </li>
            <li>
              <strong>Inclusive Design:</strong> Accessible to crafters with
              different abilities, devices, and internet speeds
            </li>
            <li>
              <strong>Open Feedback:</strong> We actively seek and implement
              community suggestions
            </li>
          </ul>
        </section>

        <section className="bg-cream-50 dark:bg-bark-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-4">
            Technical Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Built With
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Next.js 14 (App Router)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>React</li>
                <li>Vercel Hosting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-bark-800 dark:text-cream-100">
                Features
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Dark/light mode support</li>
                <li>Mobile-first responsive design</li>
                <li>Fast page loads</li>
                <li>SEO optimized</li>
                <li>Accessibility compliant</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Get Involved
          </h2>
          <p>
            FiberTools grows with community input. Here's how you can help:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Suggest a Tool:</strong> Have an idea for a calculator
              that would help your crafting?{" "}
              <a
                href="/contact"
                className="text-sage-600 dark:text-sage-400 underline"
              >
                Let us know
              </a>
              !
            </li>
            <li>
              <strong>Report Issues:</strong> Found a bug or something that
              doesn't work right? We'll fix it.
            </li>
            <li>
              <strong>Share Feedback:</strong> Tell us what's working, what's
              not, and what you'd like to see next.
            </li>
            <li>
              <strong>Spread the Word:</strong> Share FiberTools with fellow
              crafters who might find it useful.
            </li>
          </ul>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-bark-200 dark:border-cream-800">
          <a
            href="/tools"
            className="px-6 py-3 bg-sage-600 text-cream-100 rounded-lg font-medium text-center hover:bg-sage-700 transition-colors"
          >
            Explore Our Tools
          </a>
          <a
            href="/contact"
            className="px-6 py-3 bg-bark-200 dark:bg-bark-700 text-bark-800 dark:text-cream-300 rounded-lg font-medium text-center hover:bg-bark-300 dark:hover:bg-bark-600 transition-colors"
          >
            Contact Us
          </a>
        </div>

        <p className="text-sm text-bark-500 dark:text-cream-400 pt-4">
          Last updated: February 24, 2026
        </p>
      </div>
    </main>
  );
}