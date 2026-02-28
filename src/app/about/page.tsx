import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "FiberTools provides free online calculators and references for knitters, crocheters, weavers, spinners, and embroiderers. All tools run in your browser.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-8">
        About FiberTools
      </h1>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            What We Do
          </h2>
          <p>
            FiberTools is a free collection of calculators and references built
            for the fiber arts community. Whether you knit, crochet, weave,
            spin, or embroider, our tools help you plan projects, convert
            measurements, and solve the math so you can focus on creating.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            How It Works
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>100% client-side.</strong> Every calculation runs in your
              browser. Your data never leaves your device.
            </li>
            <li>
              <strong>Works offline.</strong> Once loaded, the tools work without
              an internet connection.
            </li>
            <li>
              <strong>No account required.</strong> No signup, no login, no
              tracking of your projects.
            </li>
            <li>
              <strong>Mobile-first.</strong> Designed to work on your phone at
              the yarn store or on the couch.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Our Tools
          </h2>
          <p>
            We offer 15+ tools covering yarn yardage calculation, needle and
            hook size conversion, gauge calculation, blanket sizing, stitch
            counting, stripe pattern generation, spinning ratios, weaving sett,
            cross stitch sizing, thread conversion, and more. See the full list
            on our{" "}
            <Link
              href="/"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              homepage
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100">
            Contact
          </h2>
          <p>
            Have a question, suggestion, or bug report? Reach us at{" "}
            <a
              href="mailto:hello@fibertools.app"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              hello@fibertools.app
            </a>{" "}
            or visit our{" "}
            <Link
              href="/contact"
              className="text-sage-600 dark:text-sage-400 underline"
            >
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
