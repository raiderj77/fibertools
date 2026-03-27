import type { Metadata } from 'next';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: 'crochet-hook-size-chart' }];
}

export async function generateMetadata(
  props: { params: Params }
): Promise<Metadata> {
  const { slug } = await props.params;
  return {
    title: 'Crochet Hook Size Chart — US & Metric Guide | FiberTools',
    description:
      'Complete crochet hook size chart: US sizes, metric mm, yarn weight pairings, steel hooks for thread crochet, and inline vs tapered hook guidance.',
    robots: { index: true, follow: true, googleBot: { 'max-snippet': -1 } },
    alternates: { canonical: '/blog/crochet-hook-size-chart' },
  };
}

export default async function Page({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Crochet Hook Size Chart — Complete US and Metric Guide',
    description:
      'Complete crochet hook size chart covering US letter sizes, metric millimeters, yarn weight pairings, and steel hooks for thread crochet.',
    datePublished: '2026-03-27',
    dateModified: '2026-03-27',
    author: {
      '@type': 'Organization',
      name: 'FiberTools',
      url: 'https://fibertools.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FiberTools',
      url: 'https://fibertools.app',
    },
    mainEntityOfPage: 'https://fibertools.app/blog/crochet-hook-size-chart',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What size crochet hook is best for beginners?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A G/6 (4.0 mm) or H/8 (5.0 mm) hook paired with worsted weight yarn is the best starting point. The medium size is comfortable to hold, stitches are easy to see and count, and the resulting fabric is firm without being stiff.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between US and metric crochet hook sizes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'US sizes use a letter-and-number system (B/1 through Q) while metric sizes are measured in millimeters. US letter designations are not perfectly standardized across manufacturers — always verify by the millimeter size. A J hook from one brand may be 5.50 mm; another brand\'s J may be 6.00 mm.',
        },
      },
      {
        '@type': 'Question',
        name: 'What hook size do I use for amigurumi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For worsted weight amigurumi, use a G/6 (4.0 mm) hook — smaller than the yarn label recommends. The tighter fabric prevents stuffing from showing through gaps between stitches. Always check your pattern\'s gauge specification.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are steel crochet hooks used for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Steel hooks are used for crochet thread (size 10 cotton, lace yarn) for projects like doilies, filet crochet curtains, and delicate edgings. They run on a reverse numbering system — higher numbers are smaller hooks. A Steel 6 or 7 is a standard starting point for size 10 thread.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="prose mx-auto max-w-3xl px-4 py-8">

        {/* FTC DISCLOSURE */}
        <p className="text-sm text-gray-500 border border-gray-200 rounded p-3 mb-6">
          <strong>Disclosure:</strong> This page contains affiliate links to Amazon (tag: ytearnings-20).
          We may earn a small commission at no extra cost to you if you purchase through these links.
        </p>

        <h1 className="text-3xl font-bold mb-2">
          Crochet Hook Size Chart — Complete US and Metric Guide
        </h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: March 27, 2026</p>

        {/* PINTEREST VISUAL INTRO */}
        <p className="text-gray-600 mb-4">
          Pin this chart for quick reference at your craft table: a color-coded table showing every
          standard US crochet hook letter, its metric millimeter equivalent, and the yarn weight it
          pairs with — from a fine B/1 (2.25 mm) for lace all the way up to a Q hook (15 mm+) for
          jumbo arm-knitting yarn. Scroll down for the full printable-friendly table.
        </p>

        {/* ANSWER BLOCK — 50-70 words before first H2 */}
        <p className="lead text-lg text-gray-700 bg-gray-50 border-l-4 border-indigo-400 pl-4 py-3 mb-8">
          Crochet hooks in the US use a letter-and-number system (B/1 through Q) alongside
          metric millimeter sizes. The most common beginner hook is a G/6 (4.0 mm) paired
          with worsted weight yarn. This guide covers the full US-to-metric conversion chart,
          steel hooks for thread work, and which hook size to use for each yarn weight category.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">US Letter Size to Metric Conversion Chart</h2>

        <p>
          Most patterns published in the United States use the letter-and-number system alongside
          metric sizes. International patterns almost always use millimeters. The chart below covers
          every standard size. Note that the letter system is <em>not</em> perfectly standardized
          across manufacturers — a J hook from one brand may be 5.50 mm while another brand's J
          is 6.00 mm. Always verify by millimeter size.
        </p>

        <div className="overflow-x-auto my-6">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border border-gray-200">US Size</th>
                <th className="px-4 py-2 text-left border border-gray-200">Metric (mm)</th>
                <th className="px-4 py-2 text-left border border-gray-200">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['B/1', '2.25 mm', 'Fingering weight (CYC 1)'],
                ['C/2', '2.75 mm', 'Fingering to sport weight'],
                ['D/3', '3.25 mm', 'Sport to DK weight'],
                ['E/4', '3.50 mm', 'DK weight'],
                ['F/5', '3.75 mm', 'DK to worsted weight'],
                ['G/6', '4.00 mm', 'Worsted weight (CYC 4) — most common beginner size'],
                ['H/8', '5.00 mm', 'Worsted to bulky weight'],
                ['I/9', '5.50 mm', 'Bulky weight (CYC 5)'],
                ['J/10', '6.00 mm', 'Bulky weight'],
                ['K/10.5', '6.50 mm', 'Bulky weight'],
                ['L/11', '8.00 mm', 'Super bulky (CYC 6)'],
                ['M/13', '9.00 mm', 'Super bulky'],
                ['N/15', '10.00 mm', 'Super bulky to jumbo'],
                ['P/16', '11.50 mm', 'Jumbo weight (CYC 7)'],
                ['Q', '15.00 mm+', 'Jumbo and arm-knitting yarn'],
              ].map(([us, mm, use]) => (
                <tr key={us} className="even:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200 font-mono font-medium">{us}</td>
                  <td className="px-4 py-2 border border-gray-200 font-mono">{mm}</td>
                  <td className="px-4 py-2 border border-gray-200 text-gray-600">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          If you are working from a vintage pattern or a pattern with no size listed, a{' '}
          <a href="/needle-guide" className="text-indigo-600 hover:underline">
            needle and hook size gauge card
          </a>{' '}
          lets you identify any hook by inserting the shaft into labeled holes until you find a
          snug fit. Our free{' '}
          <a href="/needle-guide" className="text-indigo-600 hover:underline">
            Needle Guide tool
          </a>{' '}
          also converts between US, metric, and UK sizes in one place.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Hook Size by Yarn Weight</h2>

        <p>
          The{' '}
          <a
            href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Craft Yarn Council (CYC) standard
          </a>{' '}
          recommends the following hook size ranges as starting points. Your personal tension
          determines whether you need to go up or down from these suggestions — which is why
          swatching matters.
        </p>

        <div className="overflow-x-auto my-6">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border border-gray-200">CYC Weight</th>
                <th className="px-4 py-2 text-left border border-gray-200">Category Name</th>
                <th className="px-4 py-2 text-left border border-gray-200">Recommended Hook Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['CYC 0', 'Lace', 'B/1 to E/4 (2.25–3.5 mm) or steel hooks 4–7'],
                ['CYC 1', 'Fingering / Super Fine', 'B/1 to E/4 (2.25–3.5 mm)'],
                ['CYC 2', 'Sport / Fine', 'E/4 to 7 (3.5–4.5 mm)'],
                ['CYC 3', 'DK / Light', 'G/6 to I/9 (4.0–5.5 mm)'],
                ['CYC 4', 'Worsted / Medium', 'G/6 to K/10.5 (4.0–6.5 mm)'],
                ['CYC 5', 'Bulky', 'K/10.5 to M/13 (6.5–9.0 mm)'],
                ['CYC 6', 'Super Bulky', 'M/13 to Q (9.0–15.0 mm)'],
                ['CYC 7', 'Jumbo', 'Q and larger (15.0 mm+)'],
              ].map(([cyc, name, range]) => (
                <tr key={cyc} className="even:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200 font-mono font-medium">{cyc}</td>
                  <td className="px-4 py-2 border border-gray-200">{name}</td>
                  <td className="px-4 py-2 border border-gray-200 text-gray-600">{range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          Use the{' '}
          <a href="/yarn-weight-chart" className="text-indigo-600 hover:underline">
            Yarn Weight Chart
          </a>{' '}
          on FiberTools to identify any unlabeled yarn by wraps-per-inch or gauge swatch before
          selecting a hook. This matters especially when substituting yarn — the same CYC category
          from different brands can have noticeably different thicknesses.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Steel Hooks for Thread Crochet</h2>

        <p>
          Steel hooks are a separate system for crochet thread (size 10 cotton, lace yarn, bedspread
          weight). They are smaller and harder than aluminum hooks to handle fine thread tension.
          Unlike regular hooks, steel sizes run <strong>backward</strong> — a higher number means a
          smaller hook.
        </p>

        <p>
          Common steel hook sizes and their uses: Steel 14 (0.75 mm) is the finest available, for
          delicate lacework. Steel 10 (1.15 mm) and Steel 8 (1.50 mm) are used for lightweight
          doilies. Steel 6 (1.80 mm) is a standard starting point for size 10 thread and filet
          crochet curtains. Steel 0 (3.25 mm) bridges the gap between thread and regular yarn. For
          classic filet crochet, a Steel 6 or 7 with size 10 thread is the most common combination.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Inline vs Tapered Hooks</h2>

        <p>
          Beyond size, hook design affects how you crochet. The two main styles are inline (Boye
          style) and tapered (Susan Bates style).
        </p>

        <p>
          Inline hooks have the throat cut in line with the shaft — the hook and shaft are the same
          diameter. The yarn sits in a defined groove, which helps tight crocheters maintain
          consistent stitch size. Tapered hooks have a throat that curves outward from a slightly
          larger hook head to a narrower shaft. Stitches slide off more easily, which some crocheters
          find faster. Neither is objectively better. Try both with the same yarn and pattern — your
          preference depends on your tension and grip style.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Ergonomic Handles: Worth the Investment</h2>

        <p>
          Standard aluminum hooks are thin cylinders — effective but hard on the hands during long
          sessions. Ergonomic handles are thicker, cushioned, and often contoured to reduce grip
          tension. Boye and Susan Bates both make ergonomic lines.{' '}
          <a
            href="https://www.amazon.com/s?k=ergonomic+crochet+hook+set&tag=ytearnings-20"
            target="_blank"
            rel="noopener noreferrer sponsored nofollow"
            className="text-indigo-600 hover:underline"
          >
            Ergonomic hook sets on Amazon (affiliate link)
          </a>{' '}
          range from $15–$40 for a full set and include sizes B through K.
        </p>

        <p>
          If you crochet more than an hour at a time, ergonomic handles reduce hand fatigue
          significantly. The difference becomes more apparent with finer yarn and tighter tension.
          You can also purchase separate ergonomic grip sleeves that slide over standard hooks if
          you already have a set you love.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">How to Identify an Unlabeled Hook</h2>

        <p>
          Hook markings wear off. Secondhand sets, inherited collections, and unlabeled craft store
          hooks are common. Two reliable methods:
        </p>

        <p>
          A <strong>needle gauge card</strong> has labeled holes — insert the hook shaft (not the
          throat) until you find the snug fit. A <strong>digital caliper</strong> measures the shaft
          diameter in millimeters and costs under $10. Both tools work for knitting needles too.
          The FiberTools{' '}
          <a href="/needle-guide" className="text-indigo-600 hover:underline">
            Needle Guide
          </a>{' '}
          provides the full size reference without any tools at all.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Hook Recommendations by Project Type</h2>

        <p>
          Different project types benefit from specific hook choices beyond just matching yarn weight.
          For <strong>amigurumi</strong> in worsted weight, use a G/6 (4.0 mm) — one to two sizes
          smaller than the yarn label recommends — to create a dense fabric that hides stuffing.
        </p>

        <p>
          For <strong>granny squares</strong> and <strong>blankets</strong> in worsted, a standard
          H/8 (5.0 mm) or I/9 (5.5 mm) produces a fabric with good drape. For
          {' '}<strong>shawls and wraps</strong> in DK or lace weight, go one size up from the yarn
          label to create an open, drapey fabric. Use our{' '}
          <a href="/gauge-calculator" className="text-indigo-600 hover:underline">
            Gauge Calculator
          </a>{' '}
          to confirm your stitch count matches the pattern requirements before committing to a full
          project.
        </p>

        {/* FAQ SECTION */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg">What size crochet hook is best for beginners?</h3>
            <p>
              A G/6 (4.0 mm) or H/8 (5.0 mm) hook paired with worsted weight (CYC 4) yarn is the
              best starting combination. The medium size is comfortable to hold, stitches are easy to
              see and count, and worsted yarn is widely available and inexpensive. Avoid very fine or
              very bulky yarn until you are comfortable with basic stitches.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">What is the difference between US and metric crochet hook sizes?</h3>
            <p>
              US sizes use a letter-and-number system (B/1 through Q). Metric sizes are measured in
              millimeters and are universally standardized. The US letter system is not consistent
              across all manufacturers — always check the millimeter size when purchasing hooks or
              following international patterns.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">What hook size do I use for amigurumi?</h3>
            <p>
              For worsted weight amigurumi, use a G/6 (4.0 mm) — smaller than the yarn label
              recommends. The tighter fabric prevents stuffing from showing through gaps. Check your
              pattern's gauge note; some patterns specify 12–14 sc per 4 inches, which gives you a
              precise target.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">What are steel crochet hooks used for?</h3>
            <p>
              Steel hooks are used for crochet thread — size 10 cotton, lace yarn, or fine bedspread
              weight — for projects like doilies, filet crochet curtains, and decorative edgings.
              They use a reverse numbering system where higher numbers are smaller hooks. A Steel 6
              or 7 is the standard starting point for size 10 thread.
            </p>
          </div>
        </div>

        {/* ATTRIBUTION */}
        <p className="text-sm text-gray-400 mt-12 pt-6 border-t border-gray-200">
          Content reviewed by a fiber arts specialist with 30+ years of experience in knitting,
          crochet, and fiber arts education.
        </p>

      </article>
    </>
  );
}
