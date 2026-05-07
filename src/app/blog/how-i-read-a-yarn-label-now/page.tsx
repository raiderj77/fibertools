import type { Metadata } from 'next';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: 'how-i-read-a-yarn-label-now' }];
}

export async function generateMetadata(
  props: { params: Params }
): Promise<Metadata> {
  await props.params;
  return {
    title: 'How I Read a Yarn Label Now (And What I Missed for Six Months) | FiberTools',
    description:
      "A working maker's guide to yarn labels -- the symbols, numbers, and gauge info I ignored for six months and what I learned the hard way.",
    robots: { index: true, follow: true, googleBot: { 'max-snippet': -1 } },
    alternates: { canonical: '/blog/how-i-read-a-yarn-label-now' },
  };
}

export default async function Page({ params }: { params: Params }) {
  await params;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'How I Read a Yarn Label Now (And What I Missed for Six Months)',
    description:
      "A working maker's guide to yarn labels -- the symbols, numbers, and gauge info I ignored for six months and what I learned the hard way.",
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
    mainEntityOfPage: 'https://fibertools.app/blog/how-i-read-a-yarn-label-now',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="prose mx-auto max-w-3xl px-4 py-8">

        <h1 className="text-3xl font-bold mb-2">
          How I Read a Yarn Label Now (And What I Missed for Six Months)
        </h1>
        <p className="text-sm text-gray-400 mb-2">Last updated: May 6, 2026</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-6">
          <span>By <strong className="text-gray-700">Jason Ramirez</strong></span>
          <span aria-hidden="true">&middot;</span>
          <span>Built by a working maker, not a content team</span>
          <span aria-hidden="true">&middot;</span>
          <Link href="/about" className="text-indigo-600 hover:underline">About us</Link>
        </div>

        {/* IN THIS POST */}
        <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8" aria-label="In this post">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">In this post</p>
          <ol className="space-y-1 list-decimal list-inside">
            {[
              ['#cyc-weight', 'First thing I check now: the CYC weight number'],
              ['#gauge', 'Second: the gauge swatch info on the label'],
              ['#dye-lot', 'Dye lot -- the number I almost never noticed'],
              ['#care', 'Fiber content and care symbols (the wool hat lesson)'],
              ['#yardage', 'Yardage per skein, not just total weight'],
            ].map(([href, label]) => (
              <li key={href as string}>
                <a href={href as string} className="text-sm text-indigo-600 hover:underline">{label as string}</a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="text-gray-600 mb-6">
          For my first six months of crochet I treated yarn labels as packaging -- something to tear off and
          throw away. Then I started losing projects to dye lot mismatches, gauge surprises, and one memorable
          disaster involving a wool hat and a hot wash cycle. Here&apos;s everything I now read on a yarn label,
          in the order I read it, and why each piece matters.
        </p>

        <h2 id="cyc-weight" className="text-2xl font-semibold mt-8 mb-4">First thing I check now: the CYC weight number</h2>

        <p>
          The 0&ndash;7 number printed inside the skein symbol on the label is the{' '}
          <a
            href="https://www.craftyarncouncil.com/standards/yarn-weight-system"
            target="_blank"
            rel="nofollow noopener"
            className="text-indigo-600 hover:underline"
          >
            Craft Yarn Council weight classification
          </a>
          . 0 is lace, 1 is fingering, 2 is sport, 3 is DK, 4 is worsted, 5 is bulky, 6 is super bulky, 7 is
          jumbo. That&apos;s the full range, and every label from a mainstream yarn brand uses this system.
        </p>
        <p>
          For my first six months I&apos;d grab a yarn that looked medium-weight without checking the number.
          Which meant I&apos;d substitute a CYC 3 DK for a pattern that called for CYC 4 worsted because both
          looked &ldquo;medium-ish&rdquo; in the store. DK and worsted are close enough that they can feel similar in your
          hand. They are not interchangeable in a pattern.
        </p>
        <p>
          The result: gauge that didn&apos;t match the pattern, garments that came out two sizes off, blankets
          with the wrong drape. The fix is simple: check the number first, every time, before anything else on
          the label. If the pattern says CYC 4, the label should say 4. That single habit eliminated most of
          my substitution mistakes.
        </p>

        <h2 id="gauge" className="text-2xl font-semibold mt-10 mb-4">Second: the gauge swatch info on the label</h2>

        <p>
          Most yarn labels show a small grid with stitch and row counts -- that&apos;s the manufacturer&apos;s
          recommended gauge over 4 inches on the recommended needle or hook size. It&apos;s an average across
          many knitters and crocheters, not a guarantee for your hands. These standards are{' '}
          <a
            href="https://www.craftyarncouncil.com/standards/yarn-label-information"
            target="_blank"
            rel="nofollow noopener"
            className="text-indigo-600 hover:underline"
          >
            documented by the Craft Yarn Council
          </a>
          , but the standard is what the label should show -- your project gauge is what actually matters.
        </p>
        <p>
          My early mistake: I assumed label gauge was my gauge. I started a sweater that called for 18 stitches
          per 4 inches, used the label number instead of swatching, and ended up with a sweater 4 inches too
          wide. I&apos;m a slightly loose crocheter. The label&apos;s 18 stitches was my 16 stitches. That
          difference compounded across 40 inches of width.
        </p>
        <p>
          Why this matters more than people acknowledge: a tight knitter might get 20 stitches per 4 inches on
          the same yarn a label calls at 18. That two-stitch difference across a 40-inch sweater is 20 extra
          stitches -- several inches of width. The label gauge tells you what hook or needle to start with for
          your swatch. It is not a substitute for swatching.
        </p>

        <h2 id="dye-lot" className="text-2xl font-semibold mt-10 mb-4">Dye lot -- the number I almost never noticed</h2>

        <p>
          Most labels have a small &quot;Dye Lot&quot; or &quot;Lot No.&quot; number, usually printed near the
          barcode. Not the SKU, not the color name, not the color number -- a separate batch identifier that
          tells you which production run this skein came from.
        </p>
        <p>
          Yarn from different dye lots can look identical on the store shelf and visibly different in a finished
          project. The shift shows up most under natural light, especially across large flat areas like blanket
          bodies or the back of a sweater. Two skeins of the same color from different lots can read as the
          same indoors and as slightly different shades in daylight.
        </p>
        <p>
          My disaster project: bought four skeins of acrylic for a blanket, came back two weeks later for two
          more, didn&apos;t check the lot number. Finished blanket has a faint vertical color shift right where
          I switched skeins. Visible enough that the recipient noticed and asked if it was intentional. It was
          not.
        </p>
        <p>
          What I do now: buy all skeins for a project at once, from the same lot. If I have to buy more later,
          I check the lot number before paying. If the store doesn&apos;t have my lot, I either order online
          from a shop that lists lot numbers, or I alternate rows of old and new yarn for several inches to
          blend the transition gradually. This single check saves more projects than any other label habit.
        </p>

        <h2 id="care" className="text-2xl font-semibold mt-10 mb-4">Fiber content and care symbols (the wool hat lesson)</h2>

        <p>
          Fiber content is usually printed clearly on the label: 100% acrylic, 80% wool 20% nylon, and so on.
          Pay attention here because care depends entirely on it. Two hats that look identical can have
          completely different washing requirements based on what&apos;s in the yarn.
        </p>
        <p>
          Care symbols are the small icons showing wash temperature, drying method, ironing guidance, and
          bleach tolerance. They follow{' '}
          <a
            href="https://www.craftyarncouncil.com/standards/care-symbols"
            target="_blank"
            rel="nofollow noopener"
            className="text-indigo-600 hover:underline"
          >
            international care symbol standards
          </a>
          : a washtub icon for washing, a square for drying, a circle for dry cleaning, a triangle for bleach,
          an iron icon for ironing. A hand inside the washtub means hand wash only. A crossed-out washtub means
          dry clean only.
        </p>
        <p>
          The wool hat lesson: I made a hat for a friend using 100% untreated wool, then machine washed it on
          warm to clean it before gifting. I discovered felting the hard way. The hat shrunk to about two-thirds
          its original size and the fibers matted into a solid puck. Untreated wool felts when it gets hot and
          agitated. That&apos;s physics, not a defect.
        </p>
        <p>
          The rule I follow now: superwash wool (labeled as such) can go in the machine on cold or wool cycle.
          Untreated wool needs hand wash or a dedicated wool cycle with no agitation. Acrylic and acrylic blends
          are generally forgiving -- machine wash and dry on low. Cotton and cotton blends are usually fine but
          can shrink on hot. Read the symbols before you start the project, and plan the care instructions into
          whatever you&apos;re gifting.
        </p>

        <h2 id="yardage" className="text-2xl font-semibold mt-10 mb-4">Yardage per skein, not just total weight</h2>

        <p>
          Labels list both weight (grams or ounces) and length (yards or meters). The length number is what
          matters for project planning -- patterns specify yardage, not weight. Buying yarn by weight without
          checking yardage is where skein-count substitution breaks down.
        </p>
        <p>
          My early confusion: I thought &quot;100g of yarn&quot; meant a consistent amount across all yarns. It
          doesn&apos;t. A 100g skein of fingering wool is roughly 400 yards. A 100g skein of worsted cotton is
          roughly 180 yards. Same weight, very different lengths. If a pattern calls for 800 yards and you buy
          four 100g skeins of worsted cotton thinking that&apos;s enough, you&apos;re short by about 80 yards
          before the project even starts.
        </p>
        <p>
          This is why substituting by skein count alone breaks projects. A pattern calling for 5 skeins of a
          specific yarn means whatever yardage that yarn comes in, multiplied by 5. Always convert to total
          yardage first, then divide by your substitute yarn&apos;s per-skein yardage to get the right skein
          count. The{' '}
          <Link href="/yarn-calculator" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">
            yarn calculator
          </Link>{' '}
          handles this conversion automatically -- you put in pattern yardage and substitute yarn yards-per-skein,
          it tells you how many skeins to buy.
        </p>

        <p className="text-gray-600 mt-8">
          None of this is hidden information. It&apos;s all printed right on the label, in roughly the same
          place on every yarn brand. I just didn&apos;t bother reading it for the first six months because
          nothing on it seemed important. Now it&apos;s the first thing I check when I pick up a skein, before
          I even look at the color.
        </p>

        <p className="text-sm text-gray-400 mt-12 pt-6 border-t border-gray-200">
          Written by Jason Ramirez, founder of FiberTools.
        </p>

      </article>
    </>
  );
}
