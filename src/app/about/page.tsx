import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "About — Your Friendly Developer",
  description:
    "The real story behind FiberTools. Built by Jason Ramirez, a self-taught developer and CADC-II counselor from Prunedale, California.",
  keywords: [
    "about FiberTools",
    "Your Friendly Developer",
    "Jason Ramirez",
    "fiber arts calculators",
    "knitting tools",
    "crochet tools",
  ],
  openGraph: {
    title: "About — Your Friendly Developer",
    description:
      "The real story behind FiberTools. Built by Jason Ramirez, a self-taught developer and CADC-II counselor from Prunedale, California.",
    url: "https://fibertools.app/about",
    images: [
      {
        url: "https://fibertools.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "About FiberTools — Your Friendly Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Your Friendly Developer",
    description:
      "The real story behind FiberTools. Built by Jason Ramirez, a self-taught developer and CADC-II counselor from Prunedale, California.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/about" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://fibertools.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: "https://fibertools.app/about",
    },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jason Ramirez",
  jobTitle: "Web Developer, CADC-II Counselor",
  worksFor: {
    "@type": "Organization",
    name: "Your Friendly Developer LLC",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Prunedale",
    addressRegion: "California",
  },
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
        About Your Friendly Developer
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">
        Last updated: April 16, 2026
      </p>

      <div className="prose prose-bark dark:prose-invert max-w-none space-y-6 text-bark-700 dark:text-cream-300">
        <p>
          Hi. I&rsquo;m the person behind this. This is why I built this.
        </p>

        <p>
          I&rsquo;m not going to pretend this started with a vision board or a
          business plan. It started in a storage shed in Salinas in 2013, when I
          was thirty-seven years old with nothing to my name and nowhere to be.
        </p>

        <p>
          I&rsquo;d been homeless for two years. Living out of my truck, sleeping
          in a shed behind my son&rsquo;s grandmother&rsquo;s house. The last two
          years of my drinking and using looked like that. On September 27th,
          2013, I got sober. Got a bed in a treatment facility. That&rsquo;s
          where my life actually started.
        </p>

        <p>
          What nobody tells you about early recovery is how broke it is. Not just
          financially broke, though that too. Broke in every way. No credit. No
          savings. No plan. No idea what retirement even meant for someone like
          me. I was going to work until I died. That was the whole plan.
        </p>

        <p>Then I got my first laptop.</p>

        <p>
          I&rsquo;d been working at the treatment center where I got sober. Went
          from client to overnight staff when my old counselor, who had become
          the director, offered me the job. He saw something in me I
          couldn&rsquo;t see yet. I walked through that door feeling like a
          complete fraud. I walked through it anyway.
        </p>

        <p>
          On my days off I started trying to figure out how to make money online.
          I tried probably a hundred different things over the next thirteen
          years. None of them worked. Not because the ideas were bad, because
          I&rsquo;m an addict, and addicts chase shiny objects. I&rsquo;d start
          something, get excited about something else, abandon the first thing,
          chase the new thing. Repeat. For over a decade.
        </p>

        <p>
          What finally changed it wasn&rsquo;t willpower. It was everything
          I&rsquo;d learned in recovery, and in the mental health field working
          with clients, and fixing my own credit from scratch without
          anyone&rsquo;s help, and figuring out the tax system after years of
          not filing, and slowly, painfully, teaching myself SEO, then content
          strategy, then AI and LLM optimization, then UI design that actual
          humans enjoy using.
        </p>

        <p>
          Thirteen years of self-education. Every skill on these sites I learned
          the hard way because I had to.
        </p>

        <p>
          I built these tools because people like me needed them and
          couldn&rsquo;t afford them. People who are starting over. People who
          are broke and scared and trying to figure out a system that was never
          explained to them. People who need real information without the
          paywall, without the condescension, without the assumption that they
          already know what they&rsquo;re doing.
        </p>

        <p>
          I still work a full-time job. I&rsquo;m pursuing my Bachelor of Social
          Work with plans for my MSW. I take photos. And when I get home or get
          done with school work, I come here. This is the other thing that turns
          me on and settles me down at the same time. There&rsquo;s something
          about building something useful that hits different when you spent years
          building nothing.
        </p>

        <p>
          Your Friendly Developer is my LLC. I am the developer. This is my work.
        </p>

        <p>
          If you&rsquo;re looking for the person behind these sites, it&rsquo;s
          me. A CADC-II counselor, a self-taught web builder, a recovering addict
          with over twelve years of sobriety, a person who fixed their own credit
          and figured out their own taxes and is still figuring out everything
          else one day at a time.
        </p>

        <p>
          I&rsquo;m not a corporation. I&rsquo;m not a content farm. I&rsquo;m
          one person who lived a lot of the things these tools are about.
        </p>

        <p>That&rsquo;s why I built them.</p>

        <section>
          <h2 className="text-2xl font-semibold text-bark-800 dark:text-cream-100 mt-10 mb-4">
            About FiberTools
          </h2>

          <p>
            Not every tool I build comes from personal crisis. Some just come
            from noticing a gap. FiberTools came from watching how scattered and
            inconsistent the information was for fiber artists trying to do basic
            calculations &mdash; yarn yardage, gauge conversions, needle sizes
            across international standards.
          </p>

          <p>
            I built this the same way I&rsquo;ve built everything: researching
            until I understood it well enough to make it useful for someone else.
            Every calculator here is based on established CYC standards and
            industry conventions. Every tool is free.
          </p>

          <p>
            Built by a developer who respects the craft, even if I&rsquo;m not
            the one holding the needles.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mt-8 mb-3">
            Get in Touch
          </h2>
          <p>
            Have a suggestion, found a bug, or want to request a new tool?
            I&rsquo;d love to hear from you.
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
          <p>I read every message and do my best to respond within a few days.</p>
        </section>

        <hr className="border-bark-200 dark:border-bark-700 my-8" />

        <p className="text-sm text-bark-500 dark:text-cream-500">
          Jason Ramirez &mdash; Your Friendly Developer LLC &mdash; Prunedale,
          California
        </p>
      </div>
    </main>
  );
}
