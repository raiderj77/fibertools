import type { Metadata } from 'next';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: 'what-i-got-wrong-first-year-crochet' }];
}

export async function generateMetadata(
  props: { params: Params }
): Promise<Metadata> {
  await props.params;
  return {
    title: 'What I Got Wrong My First Year of Crochet | FiberTools',
    description:
      'Five honest mistakes from my first year of crochet -- yarn that was harder than it looked, patterns that humbled me, and a hook hold that hurt.',
    robots: { index: true, follow: true, googleBot: { 'max-snippet': -1 } },
    alternates: { canonical: '/blog/what-i-got-wrong-first-year-crochet' },
  };
}

export default async function Page({ params }: { params: Params }) {
  await params;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'What I Got Wrong My First Year of Crochet',
    description:
      'Five honest mistakes from my first year of crochet -- yarn that was harder than it looked, patterns that humbled me, and a hook hold that hurt.',
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
    mainEntityOfPage: 'https://fibertools.app/blog/what-i-got-wrong-first-year-crochet',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="prose mx-auto max-w-3xl px-4 py-8">

        <h1 className="text-3xl font-bold mb-2">
          What I Got Wrong My First Year of Crochet
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
              ['#yarn', 'I bought beginner yarn that was actually terrible to learn on'],
              ['#pattern', 'I picked patterns based on the photo, not the difficulty'],
              ['#yardage', 'I underestimated how much yarn a baby blanket actually needs'],
              ['#hook', 'I held the hook wrong for six months'],
              ['#teacher', "I learned from one YouTube channel and got that one teacher's bad habits"],
            ].map(([href, label]) => (
              <li key={href as string}>
                <a href={href as string} className="text-sm text-indigo-600 hover:underline">{label as string}</a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="text-gray-600 mb-6">
          I started crocheting a year ago. I&apos;m now the developer behind FiberTools, but I&apos;m not a master
          crocheter. I&apos;m someone who built calculator tools because the existing ones frustrated me, and built
          them while making every beginner mistake there is. Here are five I&apos;m still embarrassed about, in
          case you&apos;re starting now and want to skip a few of them.
        </p>

        <h2 id="yarn" className="text-2xl font-semibold mt-8 mb-4">I bought beginner yarn that was actually terrible to learn on</h2>

        <p>
          The yarn was{' '}
          <a
            href="https://www.yarnspirations.com/products/red-heart-super-saver-yarn"
            target="_blank"
            rel="nofollow noopener"
            className="text-indigo-600 hover:underline"
          >
            Red Heart Super Saver
          </a>
          . I bought it because it was cheap, widely available, and I&apos;d seen it recommended in multiple
          beginner posts. My reasoning was simple: thick yarn is easier to see, and cheap yarn means I can waste
          it while learning. Both of those things are true. The problem is that Super Saver is a 4-ply yarn with
          a loose twist, which means the hook catches between the plies constantly. Every few stitches I was
          splitting the yarn instead of catching it cleanly, and I had no idea that was the problem.
          Reading the label fully would have flagged the splitting issue too &mdash; I cover what I look for now in{' '}
          <Link href="/blog/how-i-read-a-yarn-label-now" className="text-sage-600 dark:text-sage-400 underline hover:opacity-80">how I read a yarn label now</Link>.
        </p>
        <p>
          Frogging (unraveling and redoing) a section of Super Saver looks bad in a way that smooth yarn does
          not. The yarn gets fuzzy and separates further each time you pull it back through. I thought I was
          just being sloppy. I wasn&apos;t. The yarn was working against me.
        </p>
        <p>
          What I should have used: something with a tighter twist and a smooth surface. A tightly-plied worsted
          acrylic or a smooth wool. Lion Brand Pound of Love, Paintbox Simply DK, or basically any yarn where
          the plies are wound tightly enough that there&apos;s no gap for a hook to catch. The stitches are
          easier to see, easier to count, and easier to frog cleanly when you make a mistake.
        </p>

        <h2 id="pattern" className="text-2xl font-semibold mt-10 mb-4">I picked patterns based on the photo, not the difficulty</h2>

        <p>
          The pattern was{' '}
          <a
            href="https://www.allaboutami.com/elephantpattern/"
            target="_blank"
            rel="nofollow noopener"
            className="text-indigo-600 hover:underline"
          >
            Stephanie Lau&apos;s elephant pattern at All About Ami
          </a>
          . Round body. Simple shape. Looked achievable. I had finished two basic spheres and figured a small
          animal was the natural next step.
        </p>
        <p>
          What I didn&apos;t register before starting: the pattern was rated intermediate. I told myself that
          was a conservative rating. It was not. The invisible decrease looks simple in a diagram but requires
          your hook to enter the front loops of two stitches simultaneously in a way that feels backwards until
          you&apos;ve done it fifty times. The color changes for the inner ears require you to carry yarn while
          working in the round, which I had never done. The trunk has to be attached at an exact angle or the
          elephant looks like it has a neck injury. The ears need to be pinned symmetrically before sewing or
          one will sit higher than the other.
        </p>
        <p>
          The thing I didn&apos;t understand yet: small amigurumi is not simple amigurumi. Small means each
          stitch placement matters more, not less. A quarter-inch error in where you sew the trunk on a 4-inch
          elephant is immediately visible. The same error on a 12-inch stuffed animal gets lost. I should have
          read the difficulty rating, and I should have understood why small objects have tighter tolerances
          before I started one.
        </p>

        <h2 id="yardage" className="text-2xl font-semibold mt-10 mb-4">I underestimated how much yarn a baby blanket actually needs</h2>

        <p>
          I bought 800 yards for what I thought would be a small baby blanket. I needed about 1,400. This was
          not a close miss. I ran out of yarn with a third of the blanket left and had to buy more, which turned
          into a dye lot problem, which turned into a blanket with a visible color shift across the middle that
          I had to frame as a design decision.
        </p>
        <p>
          The gap came from three places. First, I measured a blanket I liked the look of but didn&apos;t
          record the actual dimensions, so my mental picture of &quot;small blanket&quot; was about 30% larger
          than what I had planned. Second, I chose a basketweave stitch pattern because it looked good, without
          knowing that textured stitches like basketweave consume significantly more yarn than plain single
          crochet at the same dimensions. Third, I decided to add a border after I was already underway, which
          I hadn&apos;t included in my original estimate at all.
        </p>
        <p>
          What I do now: calculate the base yardage, add 15% for stitch pattern overhead, add another 10% for
          borders and finishing, then buy one extra skein on top of that. The{' '}
          <Link href="/blanket-calculator" className="text-indigo-600 hover:underline">
            blanket calculator
          </Link>{' '}
          handles the base math, but you still need to add the stitch-pattern overhead yourself. Basketweave
          and bobble stitches can run 30% more than the same area in single crochet. It matters.
        </p>

        <h2 id="hook" className="text-2xl font-semibold mt-10 mb-4">I held the hook wrong for six months</h2>

        <p>
          I held the hook in a pencil grip with my forearm slightly rotated toward me. This is a common way to
          hold a crochet hook, and for the first three months it felt fine. I was making things, my tension was
          reasonably consistent, and I assumed I was doing it right because nothing hurt.
        </p>
        <p>
          Around month four, I started getting tension in my forearm during longer sessions. By month five I had
          a dull ache at the base of my thumb that showed up after about an hour of work and lingered into the
          next day. I thought I was just tired. It took me several more weeks to connect the pain directly to
          how I was holding the hook, because nobody had told me that grip and wrist angle matter.
        </p>
        <p>
          I switched to a knife grip with a more neutral wrist angle. The first few sessions felt slower because
          the movements were unfamiliar. The forearm ache stopped within a week.{' '}
          <a
            href="https://www.tincanknits.com/blog/how-to-hold-the-yarn"
            target="_blank"
            rel="nofollow noopener"
            className="text-indigo-600 hover:underline"
          >
            Tin Can Knits has a good guide to yarn and hook hold
          </a>{' '}
          that covers both grip styles and why wrist position matters. If your hand or wrist hurts after
          crocheting, check the grip before assuming you just need to crochet less. Nobody told me this when I
          was learning.
        </p>

        <h2 id="teacher" className="text-2xl font-semibold mt-10 mb-4">I learned from one YouTube channel and got that one teacher&apos;s bad habits</h2>

        <p>
          I found a creator early whose pace worked for me. Clear explanations, good camera angles, comfortable
          speed. I watched everything they made for about three months and practiced what they showed.
        </p>
        <p>
          What I didn&apos;t realize was that I had absorbed their specific yarn-over direction, their specific
          way of making invisible decreases, and their specific approach to tension. None of those things are
          objectively wrong. But they&apos;re not the only way to do any of it. When I eventually tried a
          technique my first teacher hadn&apos;t covered and found a second tutorial for it, the new teacher
          held the yarn in a completely different way. She got the same results. I realized that what I thought
          of as &quot;how you crochet&quot; was actually &quot;how one specific person crochets.&quot;
        </p>
        <p>
          The fix, once I understood the problem, was to deliberately rotate through multiple teachers for any
          technique I wanted to learn. Watch at least two or three people demonstrate the same stitch before
          deciding which approach clicks. Conflicting advice from different teachers is not noise. It&apos;s
          data about which parts of the technique are essential and which parts are just that one person&apos;s
          preference.
        </p>

        <p className="text-gray-600 mt-8">
          None of these are catastrophes. They&apos;re just things I&apos;d tell myself a year ago if I could.
          If you&apos;re a few weeks in and something is not working, it might be the yarn, the pattern, or how
          you&apos;re holding the hook before it&apos;s about your skill. Worth checking those before you decide
          you&apos;re not made for this.
        </p>

        <p className="text-sm text-gray-400 mt-12 pt-6 border-t border-gray-200">
          Written by Jason Ramirez, founder of FiberTools.
        </p>

      </article>
    </>
  );
}
