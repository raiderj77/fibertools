import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "About Jason Ramirez, the maker behind FiberTools",
  description:
    "FiberTools is made by Jason Ramirez. He is a developer and a counselor in recovery who took up crochet as a calming hobby. He builds free, accurate fiber arts tools. Here is the real story.",
  keywords: [
    "about FiberTools",
    "Jason Ramirez",
    "fiber arts calculators",
    "knitting tools",
    "crochet tools",
    "crochet for mental health",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "About Jason Ramirez, the maker behind FiberTools",
    description:
      "The real story behind FiberTools. Made by Jason Ramirez, a developer and counselor in recovery who crochets.",
    url: "https://fibertools.app/about",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "About FiberTools by Jason Ramirez",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Jason Ramirez, the maker behind FiberTools",
    description:
      "The real story behind FiberTools. Made by Jason Ramirez, a developer and counselor in recovery who crochets.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/about" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://fibertools.app" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://fibertools.app/about" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jason Ramirez",
  jobTitle: "Founder and Developer, FiberTools",
  description:
    "Developer and counselor in recovery who took up crochet as a calming hobby and builds free, accurate fiber arts tools.",
  knowsAbout: ["Crochet", "Knitting", "Fiber arts", "Web development"],
  sameAs: ["https://bsky.app/profile/friendlydeveloper.bsky.social"],
  worksFor: { "@type": "Organization", name: "Your Friendly Developer LLC" },
  url: "https://fibertools.app/about",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <h1 className="text-3xl font-bold text-bark-800 dark:text-cream-100 mb-2">
        About Jason Ramirez
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">Last updated: June 30, 2026</p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <p>
          Hi. I am Jason Ramirez. I make FiberTools. It is just me, not a big team and
          not a robot. I build these tools, and I use them too.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mt-10 mb-4">
            Why I make things
          </h2>
          <p>
            I am a developer and a counselor. I am also in recovery.
          </p>
          <p>
            Crochet is one of my hobbies. It keeps my hands and my mind busy, and that
            helps me stay calm. I also like photography, coding, and building websites. My
            work as a counselor helps too. I picked up crochet for this reason. It keeps me
            grounded.
          </p>
          <p>
            I share the recovery part on purpose. Recovery gave a lot to me. Now I want to
            give some of that back. Maybe my story helps someone else. If you are
            struggling, you are not alone. It is okay to ask for help. Here is where you
            can reach out:
          </p>
          <ul>
            <li>
              <strong>988</strong> is the Suicide and Crisis Lifeline. You can call or
              text, any time, day or night.
            </li>
            <li>
              <strong>SAMHSA National Helpline:</strong>{" "}
              <a href="tel:1-800-662-4357" className="text-sage-600 dark:text-sage-400 underline">
                1-800-662-4357
              </a>
              . It is free and private. Someone is there all day and all night. They can
              help you find care.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mt-10 mb-4">
            Why FiberTools exists
          </h2>
          <p>
            I tried a lot of fiber arts calculators. Each one did just one thing. One did
            gauge. One did yarn amounts. One did needle sizes. I got tired of jumping
            between them. So I built one place that does it all. It is free, and you do not
            need to log in.
          </p>
          <p>
            FiberTools is a real toolbox for makers. It is not a blog with a calculator
            stuck on the side. I use it every day. When I find something missing, I add it.
          </p>
          <p>
            Every calculator uses Craft Yarn Council (CYC) standards. That is the same
            system yarn makers use all over the world. It covers yarn weights (0 to 7, from
            Lace to Jumbo), hook and needle sizes, and gauge. The size charts match real
            maker standards, not guesses.
          </p>
          <p>
            I checked every formula by hand before I put it online. I also tested each one
            with tricky numbers. Big blankets. Odd swatch sizes. Stitch counts that do not
            divide evenly.
          </p>
          <p>
            Now I crochet too. So I test the tools on my own projects. My first granny
            squares came out a little crooked. One gauge swatch was too tight. Once I even
            bought too little yarn. Being new helps me. I still remember which parts are
            hard. Every tool is free. Ads keep it free, and I plan to keep it that way.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mt-8 mb-3">
            Get in Touch
          </h2>
          <p>
            Do you have an idea? Did you find a bug? Do you want a new tool? I would love
            to hear from you.
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:hello@fibertools.app" className="text-sage-600 dark:text-sage-400 underline">
              hello@fibertools.app
            </a>
          </p>
          <p>I read every message. I try to reply within a few days.</p>
        </section>

        <hr className="border-bark-200 dark:border-bark-700 my-8" />

        <p className="text-sm text-bark-500 dark:text-cream-500">
          Jason Ramirez / Your Friendly Developer LLC
        </p>
      </div>
    </main>
  );
}
