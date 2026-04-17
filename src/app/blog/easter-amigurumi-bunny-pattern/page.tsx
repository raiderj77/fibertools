import type { Metadata } from 'next';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: 'easter-amigurumi-bunny-pattern' }];
}

export async function generateMetadata(
  props: { params: Params }
): Promise<Metadata> {
  await props.params;
  return {
    title: 'Easter Bunny Amigurumi Pattern — Free Crochet Guide',
    description:
      'Free Easter bunny amigurumi crochet pattern with step-by-step instructions, hook size guide, and yarn calculator tips. Make your bunny in one afternoon.',
    robots: { index: true, follow: true, googleBot: { 'max-snippet': -1 } },
    alternates: { canonical: '/blog/easter-amigurumi-bunny-pattern' },
  };
}

export default async function Page({ params }: { params: Params }) {
  await params;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Easter Bunny Amigurumi Pattern — Free Crochet Guide',
    description:
      'Free Easter bunny amigurumi crochet pattern with hook size guide and yarn calculator tips.',
    datePublished: '2026-03-28',
    dateModified: '2026-04-16',
    author: { '@type': 'Organization', name: 'FiberTools', url: 'https://fibertools.app' },
    publisher: { '@type': 'Organization', name: 'FiberTools', url: 'https://fibertools.app' },
    mainEntityOfPage: 'https://fibertools.app/blog/easter-amigurumi-bunny-pattern',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What hook size do I use for amigurumi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For worsted weight (CYC 4) yarn, use a G/6 (4.0 mm) hook — one to two sizes smaller than the yarn label recommends. The tighter fabric prevents stuffing from showing through stitch gaps. For DK weight (CYC 3), use an E/4 (3.5 mm) hook.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much yarn do I need for a small amigurumi bunny?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A small amigurumi bunny (about 5 inches tall) uses approximately 50 to 80 yards of worsted weight yarn for the main color, plus 10 to 20 yards each for accent colors like the inner ear and tail. Use the FiberTools Yarn Calculator to get exact estimates for your yarn weight and project size.',
        },
      },
      {
        '@type': 'Question',
        name: 'What stuffing do I use for amigurumi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Polyester fiberfill is the standard stuffing for amigurumi. Fill firmly but not so tightly that the fabric stretches and gaps appear between stitches. For a softly weighted base, a small amount of polypellets or plastic beads in a small bag inside the body creates a satisfying heft.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I make amigurumi without safety eyes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Embroidered eyes using black yarn or embroidery floss are a safe alternative, especially for items intended for young children or babies where safety eyes present a choking hazard. Use a yarn needle to satin stitch two small ovals or circles onto the face before closing the head.',
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

        <h1 className="text-3xl font-bold mb-2">
          Easter Bunny Amigurumi Pattern — Free Crochet Guide
        </h1>
        <p className="text-sm text-gray-400 mb-2">Last updated: April 16, 2026</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-6">
          <span>By <strong className="text-gray-700">The FiberTools Editorial Team</strong></span>
          <span aria-hidden="true">&middot;</span>
          <span>Fiber arts experts with 30+ years of experience</span>
          <span aria-hidden="true">&middot;</span>
          <span>Last reviewed: April 2026</span>
          <span aria-hidden="true">&middot;</span>
          <Link href="/about" className="text-indigo-600 hover:underline">About us</Link>
        </div>

        {/* IN THIS GUIDE */}
        <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6" aria-label="In this guide">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">In this guide</p>
          <ol className="space-y-1 list-decimal list-inside">
            {[
              ['#materials', 'Materials'],
              ['#abbreviations', 'Abbreviations'],
              ['#body', 'Pattern — Body'],
              ['#head', 'Pattern — Head'],
              ['#ears', 'Pattern — Ears'],
              ['#finishing', 'Finishing'],
              ['#gauge-notes', 'Hook Size and Gauge Notes'],
            ].map(([href, label]) => (
              <li key={href as string}>
                <a href={href as string} className="text-sm text-indigo-600 hover:underline">{label as string}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* PINTEREST VISUAL INTRO */}
        <p className="text-gray-600 mb-4">
          Pin this for later: a soft, round-bellied Easter bunny worked entirely in single crochet
          rounds, with floppy ears, a pompom tail, and a bow at the neck. The finished bunny stands
          about 5 inches tall and works up in two to three hours with worsted weight yarn.
        </p>

        {/* ANSWER BLOCK */}
        <p className="lead text-lg text-gray-700 bg-gray-50 border-l-4 border-indigo-400 pl-4 py-3 mb-8">
          This free Easter bunny amigurumi pattern uses worsted weight yarn (CYC 4) and a G/6 (4.0 mm)
          hook — one size smaller than the label recommends, so the fabric is tight enough to hide
          the stuffing. The bunny crochets in continuous spiral rounds with no seams on the body.
          Estimated yarn: 60&ndash;80 yards main color, 15 yards accent.
        </p>

        <h2 id="materials" className="text-2xl font-semibold mt-8 mb-4">Materials</h2>

        <p>
          Before you start, check your hook size against the{' '}
          <Link href="/blog/crochet-hook-size-chart" className="text-indigo-600 hover:underline">
            crochet hook size chart
          </Link>{' '}
          and your yarn weight using the{' '}
          <Link href="/yarn-weight-chart" className="text-indigo-600 hover:underline">
            Yarn Weight Chart
          </Link>
          . Both are free tools on FiberTools.
        </p>

        <ul className="list-disc ml-6 space-y-1 my-4 text-gray-700">
          <li>Worsted weight (CYC 4) yarn in white or cream — approx. 60–80 yards</li>
          <li>Pink or light pink yarn — approx. 15 yards (inner ears, cheeks)</li>
          <li>G/6 (4.0 mm) crochet hook</li>
          <li>Polyester fiberfill stuffing</li>
          <li>Two 12mm black safety eyes (or embroidery floss for child-safe eyes)</li>
          <li>Yarn needle and scissors</li>
          <li>Stitch marker</li>
        </ul>

        <p>
          Use the{' '}
          <Link href="/yarn-calculator" className="text-indigo-600 hover:underline">
            FiberTools Yarn Calculator
          </Link>{' '}
          to confirm yardage if you&apos;re using DK weight (CYC 3) instead — you&apos;ll need
          slightly less yarn but should drop to an E/4 (3.5 mm) hook to keep the fabric tight.
        </p>

        <h2 id="abbreviations" className="text-2xl font-semibold mt-10 mb-4">Abbreviations</h2>

        <p>
          This pattern uses US crochet terminology. See the{' '}
          <Link href="/abbreviation-glossary" className="text-indigo-600 hover:underline">
            FiberTools Abbreviation Glossary
          </Link>{' '}
          for a full reference.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border border-gray-200">Abbreviation</th>
                <th className="px-4 py-2 text-left border border-gray-200">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['MR', 'Magic ring'],
                ['sc', 'Single crochet (US)'],
                ['inc', 'Increase: 2 sc in same stitch'],
                ['dec', 'Invisible decrease: sc2tog through front loops'],
                ['sl st', 'Slip stitch'],
                ['ch', 'Chain'],
                ['BLO', 'Back loop only'],
                ['st(s)', 'Stitch(es)'],
              ].map(([abbr, meaning]) => (
                <tr key={abbr} className="even:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200 font-mono font-medium">{abbr}</td>
                  <td className="px-4 py-2 border border-gray-200 text-gray-700">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 id="body" className="text-2xl font-semibold mt-10 mb-4">Pattern — Body</h2>

        <p>
          Work in continuous spiral rounds. Place a stitch marker in the first stitch of each round
          and move it up as you work. Use the{' '}
          <Link href="/stitch-counter" className="text-indigo-600 hover:underline">
            FiberTools Stitch Counter
          </Link>{' '}
          to track your stitch count — amigurumi rounds are easy to lose count in.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 my-6 font-mono text-sm space-y-1">
          <p><strong>Round 1:</strong> MR, 6 sc in ring. (6 sts)</p>
          <p><strong>Round 2:</strong> inc in each st around. (12 sts)</p>
          <p><strong>Round 3:</strong> *sc 1, inc* repeat 6 times. (18 sts)</p>
          <p><strong>Round 4:</strong> *sc 2, inc* repeat 6 times. (24 sts)</p>
          <p><strong>Round 5:</strong> *sc 3, inc* repeat 6 times. (30 sts)</p>
          <p><strong>Round 6:</strong> *sc 4, inc* repeat 6 times. (36 sts)</p>
          <p><strong>Rounds 7–12:</strong> sc in each st around. (36 sts) — 6 rounds even</p>
          <p><strong>Round 13:</strong> *sc 4, dec* repeat 6 times. (30 sts)</p>
          <p><strong>Round 14:</strong> *sc 3, dec* repeat 6 times. (24 sts)</p>
          <p className="text-gray-500">→ Insert safety eyes between rounds 9 and 10, approx. 8 sts apart. Begin stuffing firmly.</p>
          <p><strong>Round 15:</strong> *sc 2, dec* repeat 6 times. (18 sts)</p>
          <p><strong>Round 16:</strong> *sc 1, dec* repeat 6 times. (12 sts)</p>
          <p><strong>Round 17:</strong> dec 6 times. (6 sts)</p>
          <p className="text-gray-500">→ Finish stuffing. Fasten off, leave a 6-inch tail. Close opening with yarn needle.</p>
        </div>

        <h2 id="head" className="text-2xl font-semibold mt-10 mb-4">Pattern — Head</h2>

        <div className="bg-gray-50 rounded-lg p-4 my-6 font-mono text-sm space-y-1">
          <p><strong>Round 1:</strong> MR, 6 sc. (6 sts)</p>
          <p><strong>Round 2:</strong> inc each st. (12 sts)</p>
          <p><strong>Round 3:</strong> *sc 1, inc* × 6. (18 sts)</p>
          <p><strong>Round 4:</strong> *sc 2, inc* × 6. (24 sts)</p>
          <p><strong>Round 5:</strong> *sc 3, inc* × 6. (30 sts)</p>
          <p><strong>Rounds 6–10:</strong> sc around. (30 sts)</p>
          <p><strong>Round 11:</strong> *sc 3, dec* × 6. (24 sts)</p>
          <p><strong>Round 12:</strong> *sc 2, dec* × 6. (18 sts)</p>
          <p className="text-gray-500">→ Insert safety eyes between rounds 7 and 8, approx. 7 sts apart. Stuff firmly.</p>
          <p><strong>Round 13:</strong> *sc 1, dec* × 6. (12 sts)</p>
          <p><strong>Round 14:</strong> dec × 6. (6 sts)</p>
          <p className="text-gray-500">→ Close and attach head to body with yarn needle.</p>
        </div>

        <h2 id="ears" className="text-2xl font-semibold mt-10 mb-4">Pattern — Ears (make 2)</h2>

        <p>
          Make the outer ear in main color, the inner ear in pink. Hold them together and sc around
          the edge to join, or sew the inner ear onto the outer ear with a yarn needle before
          attaching to head.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 my-6 font-mono text-sm space-y-1">
          <p className="text-gray-500">Outer ear (main color):</p>
          <p><strong>Round 1:</strong> MR, 4 sc. (4)</p>
          <p><strong>Round 2:</strong> inc, sc 2, inc. (6)</p>
          <p><strong>Rounds 3–8:</strong> sc around. (6) — 6 rows even</p>
          <p className="text-gray-500">Fasten off. Do not stuff.</p>
          <p className="text-gray-500 mt-2">Inner ear (pink): Work outer ear pattern through Round 5 only. Sew onto outer ear.</p>
        </div>

        <h2 id="finishing" className="text-2xl font-semibold mt-10 mb-4">Finishing</h2>

        <p>
          Sew ears to top of head, angled slightly outward. Make a small pompom from white yarn
          (approximately 2 cm diameter) and sew to back of body as a tail. Add a small ribbon or
          yarn bow at the neck. Weave in all ends securely &mdash; amigurumi gets handled and needs
          well-secured ends.
        </p>

        <p>
          For nose and cheeks, use pink embroidery floss to satin stitch a small triangle nose
          between the eyes, and two small circles for rosy cheeks. Blush powder applied with a
          cotton swab is a popular alternative for soft cheek color.
        </p>

        <h2 id="gauge-notes" className="text-2xl font-semibold mt-10 mb-4">Hook Size and Gauge Notes</h2>

        <p>
          Gauge is not critical for amigurumi since fit is not required &mdash; but density is.
          Your finished fabric should have no visible gaps between stitches when gently stretched.
          If you can see the stuffing through the fabric, go down one hook size.
        </p>

        <p>
          The standard rule: use a hook one to two sizes smaller than the yarn label recommends.
          For this pattern with worsted weight (CYC 4): G/6 (4.0 mm) rather than the typical
          H/8 or I/9. Check the full{' '}
          <Link href="/blog/crochet-hook-size-chart" className="text-indigo-600 hover:underline">
            crochet hook size chart
          </Link>{' '}
          if you&apos;re substituting a different weight.
        </p>

        {/* KEY TAKEAWAYS */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mt-10 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">Key Takeaways</p>
          <ul className="space-y-2">
            {[
              'Use a G/6 (4.0 mm) hook with worsted weight (CYC 4) — one to two sizes smaller than the yarn label recommends — for a dense, stuffing-hiding fabric.',
              'Work in continuous spiral rounds; always place a stitch marker in the first stitch of each round to track your position.',
              'Insert safety eyes before closing the head (between rounds 7–8) — impossible to add once the opening is sewn shut.',
              'Stuff firmly but not so tight that the fabric stretches or gaps appear; add polypellets in a small bag for a weighted base.',
              'For child-safe bunnies, embroider eyes with black yarn or floss instead of safety eyes (choking hazard for under-3).',
              'Gauge is not critical for fit — but fabric density is: no gaps between stitches when gently stretched.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-indigo-800">
                <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Frequently Asked Questions</h2>

        <div className="bg-white rounded-2xl border border-gray-200 px-6 divide-y divide-gray-100">
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">What hook size do I use for amigurumi?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-gray-600 leading-relaxed">For worsted weight (CYC 4), use a G/6 (4.0 mm) hook. For DK weight (CYC 3), use E/4 (3.5 mm). The goal is a tight, dense fabric with no visible gaps. If stuffing shows through, go down one hook size.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">How much yarn do I need for a small amigurumi bunny?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-gray-600 leading-relaxed">Approximately 60–80 yards of worsted weight main color, plus 15 yards of pink accent. Use the <Link href="/yarn-calculator" className="text-indigo-600 hover:underline">Yarn Calculator</Link> for exact estimates if substituting a different weight.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">What stuffing do I use for amigurumi?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-gray-600 leading-relaxed">Polyester fiberfill is standard. Fill firmly but stop before the fabric visibly stretches. For a weighted base, a small organza bag of polypellets inside the body adds a satisfying heft.</p></div>
          </details>
          <details className="group py-1">
            <summary className="flex items-start justify-between gap-4 py-3 cursor-pointer list-none text-left">
              <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">Can I make amigurumi without safety eyes?</span>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </summary>
            <div className="pb-4 pr-8"><p className="text-sm text-gray-600 leading-relaxed">Yes — embroider eyes with black yarn or floss for items intended for young children. Satin stitch two small ovals before closing the head. Safety eyes are a choking hazard for children under 3.</p></div>
          </details>
        </div>

        {/* TRY THE TOOL CTA */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mt-10 text-center">
          <p className="text-lg font-semibold text-indigo-800 mb-2">Plan your amigurumi project</p>
          <p className="text-sm text-indigo-700 mb-4">
            Use the free Amigurumi Shape Calculator to size your bunny up or down — generates round-by-round stitch counts for any target size.
          </p>
          <a href="/amigurumi-shapes" className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Open Amigurumi Calculator &rarr;
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-12 pt-6 border-t border-gray-200">
          Content reviewed by a fiber arts specialist with 30+ years of experience in knitting,
          crochet, and fiber arts education.
        </p>

      </article>
    </>
  );
}
