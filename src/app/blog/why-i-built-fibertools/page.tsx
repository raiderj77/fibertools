import type { Metadata } from 'next';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: 'why-i-built-fibertools' }];
}

export async function generateMetadata(
  props: { params: Params }
): Promise<Metadata> {
  await props.params;
  return {
    title: 'Why I Built FiberTools Instead of Using a Spreadsheet | FiberTools',
    description:
      'The fragmented-tool workflow that drove me to build a single fiber arts calculator suite instead of switching between five browser tabs.',
    robots: { index: true, follow: true, googleBot: { 'max-snippet': -1 } },
    alternates: { canonical: '/blog/why-i-built-fibertools' },
  };
}

export default async function Page({ params }: { params: Params }) {
  await params;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Why I Built FiberTools Instead of Using a Spreadsheet',
    description:
      'The fragmented-tool workflow that drove me to build a single fiber arts calculator suite instead of switching between five browser tabs.',
    datePublished: '2026-05-06',
    dateModified: '2026-05-06',
    author: {
      '@type': 'Person',
      name: 'Jason Ramirez',
      jobTitle: 'Founder of FiberTools',
      url: 'https://fibertools.app/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FiberTools',
      url: 'https://fibertools.app',
    },
    mainEntityOfPage: 'https://fibertools.app/blog/why-i-built-fibertools',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="prose mx-auto max-w-3xl px-4 py-8">

        <h1 className="text-3xl font-bold mb-2">
          Why I Built FiberTools Instead of Using a Spreadsheet
        </h1>
        <p className="text-sm text-gray-400 mb-2">Last updated: May 6, 2026</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 mb-6">
          <span>By <strong className="text-gray-700">Jason Ramirez</strong></span>
          <span aria-hidden="true">&middot;</span>
          <span>Built by a working maker, not a content team</span>
          <span aria-hidden="true">&middot;</span>
          <Link href="/about" className="text-indigo-600 hover:underline">About us</Link>
        </div>

        {/* IN THIS POST */}
        <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8" aria-label="In this post">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">In this post</p>
          <ol className="space-y-1 list-decimal list-inside">
            {[
              ['#five-tab', 'The five-tab problem'],
              ['#single-tool', 'Why no single tool covered the workflow'],
              ['#blanket', 'The baby blanket that broke me'],
              ['#built', 'What I built it as'],
              ['#missing', "What I'm still missing"],
            ].map(([href, label]) => (
              <li key={href as string}>
                <a href={href as string} className="text-sm text-indigo-600 hover:underline">{label as string}</a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="text-gray-600 mb-6">
          FiberTools exists because I got tired of switching between five browser tabs to figure out how much
          yarn to buy for a baby blanket. This is the story of why a fragmented workflow drove me to build
          something better -- and what I learned about the problem along the way.
        </p>

        <h2 id="five-tab" className="text-2xl font-semibold mt-8 mb-4">The five-tab problem</h2>

        <p>
          A typical project planning session looked like this. Open Ravelry to look up a pattern&apos;s yardage
          requirements. Open a yardage calculator on a different site to convert that to skein count for the
          actual yarn I had. Open a gauge calculator on a third site when my swatch didn&apos;t match the
          pattern&apos;s gauge. Open the calculator app on my phone to do the basic multiplication that none of
          the online calculators handled together. Flip my yarn label over to check the CYC weight and yards
          per skein.
        </p>
        <p>
          Five contexts. Easy to lose track of where the numbers were coming from. I did lose track -- on a
          baby blanket -- and bought 800 yards when I needed 1,400. The blanket got finished with a visible
          color shift across the middle because the original dye lot was gone by the time I went back to the
          store.
        </p>
        <p>
          The frustrating part wasn&apos;t the math. The math is simple. It was that the math lived in five
          different places that didn&apos;t talk to each other, and every project meant reassembling the same
          workflow from scratch.
        </p>

        <h2 id="single-tool" className="text-2xl font-semibold mt-10 mb-4">Why no single tool covered the workflow</h2>

        <p>
          Ravelry covers patterns and project notes well but doesn&apos;t do calculation. The yarn substitution
          feature is search, not math. You can find a yarn with similar weight and fiber content, but Ravelry
          won&apos;t tell you how many skeins of the substitute you need for a specific yardage requirement at
          a specific gauge variance.
        </p>
        <p>
          Yarn brand calculators -- Lion Brand has one, a few others do too -- work for that brand&apos;s yarn
          only. Switch yarns and the calculator breaks because it&apos;s hardcoded to specific skein sizes.
          That&apos;s not a calculator, that&apos;s a marketing tool.
        </p>
        <p>
          Generic yardage calculators handle the easy part but ignore stitch pattern overhead, dye lot variance,
          and fingering-vs-worsted coverage differences. They give you a baseline number and leave the
          adjustments to you.{' '}
          <a
            href="https://yarnsub.com"
            target="_blank"
            rel="nofollow noopener"
            className="text-indigo-600 hover:underline"
          >
            yarnsub.com
          </a>{' '}
          is excellent for substitution specifically -- finding a yarn that matches another yarn&apos;s specs --
          but it doesn&apos;t help with project planning.
        </p>
        <p>
          I tried the Excel template approach for two weeks. Building the spreadsheet took longer than the
          projects I was using it for, and it broke every time I changed yarn weight or stitch pattern because
          the formulas weren&apos;t connected to each other. Each tool was solving 20% of the problem. Nobody
          was solving the workflow.
        </p>

        <h2 id="blanket" className="text-2xl font-semibold mt-10 mb-4">The baby blanket that broke me</h2>

        <p>
          The project: a basketweave baby blanket, 36 inches by 52 inches, worsted weight acrylic. The math I
          did: a rough estimate based on a similar blanket someone had posted on Ravelry. I looked at the
          yardage in their project notes and added what I thought was a reasonable buffer.
        </p>
        <p>
          What I missed: basketweave consumes more yarn than plain single crochet at the same dimensions. I
          didn&apos;t know the multiplier existed, let alone what it was. I also bought from a craft store that
          turned out not to stock the same dye lot two weeks later. So when I ran short with about a third of
          the blanket left, I was buying from whatever they had on the shelf that week. If I had read the dye lot
          number on the label, the whole disaster would have been preventable. I write more about{' '}
          <Link href="/blog/how-i-read-a-yarn-label-now" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">what I now check on every yarn label</Link>.
        </p>
        <p>
          Result: 800 yards purchased, 1,400 yards needed. The last 600 yards came from a slightly different
          shade that I noticed immediately and decided to call intentional. The blanket went to a family member
          who was polite about it. That night I started building the first version of what became FiberTools. I
          wanted one tool that handled gauge, stitch pattern overhead, project size presets, and yarn weight
          conversion in a single screen -- without requiring me to hold four intermediate numbers in my head
          while switching between tabs.
        </p>

        <h2 id="built" className="text-2xl font-semibold mt-10 mb-4">What I built it as</h2>

        <p>
          Single web app, runs in any browser, no login required, no tracking. Free, because nobody should pay
          four dollars to figure out how much yarn to buy. All the math runs in the browser -- your project
          numbers don&apos;t go to a server. One page per calculator type so you can bookmark exactly what you
          use and ignore the rest.
        </p>
        <p>
          FiberTools currently has 30+ calculators covering knitting, crochet, weaving, spinning, embroidery,
          and cross stitch. Some I built because I needed them personally. Some came from people who found the
          site and asked for something specific. The blanket calculator was one of the first.
        </p>
        <p>
          I&apos;m a developer, so building it was the straightforward part. The hard part was figuring out
          which calculations actually matter to a working maker -- what the real workflow looks like, which
          numbers people need, and where the existing tools were leaving gaps. That&apos;s what the first year
          of crocheting badly was for.
        </p>
        <p>
          The{' '}
          <Link href="/blanket-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">
            blanket calculator
          </Link>{' '}
          handles the basketweave problem now -- preset sizes, stitch pattern overhead, and dye lot buffer
          baked in. I have not bought the wrong amount of yarn for a blanket since.
        </p>

        <h2 id="missing" className="text-2xl font-semibold mt-10 mb-4">What I&apos;m still missing</h2>

        <p>
          A pattern import feature -- paste in a Ravelry link or PDF and the calculator pre-fills. This is
          the biggest remaining gap. Right now you still have to transfer numbers manually from the pattern to
          the tool, which is most of the friction.
        </p>
        <p>
          Multi-color yardage tracking for colorwork projects. Currently you run each color through the
          calculator separately and add the results yourself. It works but it&apos;s not one screen. A project
          history that doesn&apos;t require an account. Sharing a project plan with another maker without
          screenshotting the result. Both are on the list.
        </p>
        <p>
          These features are coming. The site has the bones now -- the calculation layer is solid, the tool
          count is high enough to cover most workflows. Adding the missing pieces happens when I find time
          between actually crocheting, which is still how I find the gaps worth fixing.
        </p>

        <p className="text-gray-600 mt-8">
          The point of FiberTools isn&apos;t that calculators are revolutionary. It&apos;s that fiber arts
          shouldn&apos;t require a five-tab browser workflow to plan a baby blanket. If you&apos;ve felt the
          same frustration, the tools are there. If they&apos;re missing something, I&apos;m a working maker
          too -- I&apos;ll find the gap eventually.
        </p>

        <p className="text-sm text-gray-400 mt-12 pt-6 border-t border-gray-200">
          Written by Jason Ramirez, founder of FiberTools.
        </p>

      </article>
    </>
  );
}
