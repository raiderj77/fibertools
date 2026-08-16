import type { Metadata } from "next";
import Link from "next/link";
import AnswerBlock from "@/components/AnswerBlock";
import ToolLayout from "@/components/ToolLayout";
import FabricSubstituteTool from "./FabricSubstituteTool";

export const metadata: Metadata = {
  title: "Fabric Substitute Finder: Compare 30 Fabrics",
  description: "Find fabric substitutes or project ideas by comparing construction, stretch, weight, drape, structure, opacity, and recovery across 30 garment fabrics.",
  keywords: [
    "fabric substitute",
    "fabric substitution chart",
    "what can I make with this fabric",
    "fabric compatibility",
    "rayon challis substitute",
    "cotton lawn substitute",
    "knit fabric stretch comparison",
  ],
  alternates: { canonical: "/fabric-substitute" },
  openGraph: {
    title: "Fabric Substitute Finder: Compare 30 Fabrics",
    description: "Compare construction, stretch, weight, drape, structure, opacity, and recovery before changing fabric.",
    url: "https://fibertools.app/fabric-substitute",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "FiberTools Fabric Substitute Finder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fabric Substitute Finder",
    description: "Find compatible fabric alternatives or projects suited to fabric you already have.",
    images: ["https://fibertools.app/og-image.png"],
  },
  other: { dateModified: "2026-08-16" },
};

export default function FabricSubstitutePage() {
  return (
    <ToolLayout slug="fabric-substitute" widgetFirst showDefaultReferences={false}>
      <AnswerBlock
        what="A deterministic comparison tool for 30 common garment fabrics. It ranks substitutes and suggests project categories using documented physical properties."
        who="Sewists choosing fabric for a pattern, stash owners deciding what to make, educators, guilds, and anyone comparing an unfamiliar fabric name."
        bottomLine="Match construction and required stretch first. The score narrows the choices; an actual washed swatch confirms the fabric."
        lastUpdated="2026-08-16"
      />

      <FabricSubstituteTool />

      <section className="mt-12">
        <h2 className="section-heading">How to substitute fabric without changing the whole project</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-300">
          <p>
            A fabric name is useful, but it is not a complete specification. Two linens can differ in weight,
            opacity, finish, and movement. Satin describes a weave, not a single fiber or weight. Fleece can
            mean a light microfleece or a bulky winter fabric. A safe substitution starts with the pattern&apos;s
            job: does the garment need stretch to go over the head, crisp body to hold a collar, fluid drape to
            fall from gathers, or opacity without a lining? Those needs matter more than finding a fabric with a
            vaguely similar name.
          </p>
          <p>
            Start by matching broad construction. Woven patterns usually assume limited stretch and use shaping,
            ease, or closures. Knit patterns often depend on stretch and recovery for fit. Replacing one with the
            other is not a routine swap, which is why this finder gives construction 30 of the available 100
            points and gives no stretch points to a woven-to-knit comparison. That is not the tool being dramatic;
            it is the difference between a T-shirt behaving like a T-shirt and behaving like a small canvas tent.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">What the 100-point compatibility score measures</h2>
        <div className="overflow-x-auto rounded-xl border border-bark-200 dark:border-bark-700" tabIndex={0} aria-label="Fabric scoring weights">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-cream-100 text-bark-700 dark:bg-bark-800 dark:text-cream-200"><tr><th className="px-4 py-3">Property</th><th className="px-4 py-3">Points</th><th className="px-4 py-3">Why it matters</th></tr></thead>
            <tbody className="divide-y divide-bark-100 text-bark-600 dark:divide-bark-700 dark:text-bark-300">
              <tr><td className="px-4 py-3">Construction</td><td className="px-4 py-3">30</td><td className="px-4 py-3">Woven or knit behavior and the specific structure.</td></tr>
              <tr><td className="px-4 py-3">Stretch</td><td className="px-4 py-3">20</td><td className="px-4 py-3">Crosswise and lengthwise working ranges.</td></tr>
              <tr><td className="px-4 py-3">Weight</td><td className="px-4 py-3">15</td><td className="px-4 py-3">Broad GSM overlap, not an invented single value.</td></tr>
              <tr><td className="px-4 py-3">Drape</td><td className="px-4 py-3">15</td><td className="px-4 py-3">How softly the fabric hangs and follows the body.</td></tr>
              <tr><td className="px-4 py-3">Structure</td><td className="px-4 py-3">10</td><td className="px-4 py-3">How well the fabric holds shape away from the body.</td></tr>
              <tr><td className="px-4 py-3">Opacity</td><td className="px-4 py-3">5</td><td className="px-4 py-3">Whether lining or deliberate transparency may be needed.</td></tr>
              <tr><td className="px-4 py-3">Recovery</td><td className="px-4 py-3">5</td><td className="px-4 py-3">How readily stretched fabric returns toward its original size.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-300">
          The same inputs always produce the same order. No model guesses what you meant, and no retailer pays to
          move a fabric higher. A known poor pairing receives a penalty even if a few broad ratings happen to
          overlap. Recommended-substitute lists do not add secret bonus points; a candidate still has to earn its
          place from its properties. Scores of 82 and above are labeled strong, 65–81 reasonable, 45–64 possible
          with adjustments, and anything below 45 poor.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">Worked example: rayon challis to cotton lawn</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-300">
          <p>
            Suppose a loose blouse recommends rayon challis and cotton lawn is available. Both are lightweight
            plain-woven fabrics with little mechanical stretch, so the basic construction and pattern opening can
            remain plausible. Cotton lawn is generally crisper, less fluid, and easier to control while sewing.
            The blouse may hold gathers and a collar more clearly, but it will not flow around the body in quite
            the same way. Opacity also varies, so the actual lawn still needs a held-up-to-light check.
          </p>
          <p>
            Matching fiber alone would not reach that conclusion. Cotton jersey also contains cotton, but its knit
            loops, stretch, recovery, and curling edges make it behave very differently from cotton lawn. Likewise,
            a polyester chiffon and silk chiffon can share a construction and visual lightness while differing in
            hand, heat sensitivity, static, and pressing needs. Fiber provides useful care and comfort context; it
            does not override construction or the properties measured by the score.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">Common fabric-substitution mistakes</h2>
        <ul className="space-y-3 text-[15px] leading-relaxed text-bark-600 dark:text-bark-300">
          <li><strong>Shopping by fiber name only:</strong> the same fiber can be knitted or woven into fabrics with opposite behavior.</li>
          <li><strong>Ignoring recovery:</strong> stretch without recovery can leave knees, elbows, necklines, or waistbands permanently bagged out.</li>
          <li><strong>Comparing folded bolts:</strong> four layers can hide transparency and exaggerate body; inspect one layer as the garment will use it.</li>
          <li><strong>Skipping wash tests:</strong> shrinkage, puckering, color loss, and a changed finish are cheaper to discover on a swatch than a finished garment.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">How to use a match in the real world</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-300">
          <p>
            Read the top score and its cautions rather than treating the number as permission to cut immediately.
            Compare the actual fabric&apos;s label or supplier specification with the displayed range. Measure stretch
            over a relaxed 10 cm or 4 inch section without forcing it, then check whether it returns. Hold the
            fabric in a single and double layer to judge opacity. Drape it over your hand or a curved surface and
            compare it with the fabric recommended by the pattern.
          </p>
          <p>
            Next, wash and dry a useful test piece exactly as the finished item will be cared for. Measure before
            and after. Sew representative seams, hems, buttonholes, elastic, or topstitching—not just one straight
            line through the easy part. If the design depends on fit, make a test garment in a less precious fabric
            with similar weight and behavior. The <Link href="/project-cost-calculator" className="font-medium text-sage-700 underline dark:text-sage-300">project cost calculator</Link> can help compare the material cost before buying full yardage.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">What “What can I make?” means</h2>
        <p className="text-[15px] leading-relaxed text-bark-600 dark:text-bark-300">
          The project flow starts with common, documented uses for the selected fabric and explains why its weight,
          drape, or structure fits. It also flags projects where stretch is important, when a lining may be useful,
          how difficult the handling is for a beginner, and whether the fabric hangs softly or holds shape. These
          are project categories rather than downloadable patterns. A specific pattern&apos;s fabric list, stretch
          gauge, wearing ease, seam allowance, and interfacing instructions remain the authority for that design.
      </p>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">Limits, ranges, and human review</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-bark-600 dark:text-bark-300">
          <p>
            The database uses broad comparison ranges because fabric production is variable. Fiber blends, yarn
            size, weave or knit density, brushing, coating, washing, and other finishes all change performance.
            GSM measures mass per area; it does not independently prove thickness, warmth, stretch, or drape.
            Ratings from 1 to 5 are comparison aids, not laboratory certifications. The records were reviewed on
            August 16, 2026, and the source notes identify which references support each family.
          </p>
          <p>
            FiberTools does not ask for notes about your project and does not send typed fabric searches to
            analytics. If analytics consent is granted, the page can record privacy-safe events such as selecting a
            known fabric ID, switching flows, expanding a result, or marking the result helpful. No retailer fabric
            links appear until a real, reviewed link exists; FiberTools will not invent a recommendation merely to
            fill a box. To report a questionable range or suggest a documented correction, use the <Link href="/contact" className="font-medium text-sage-700 underline dark:text-sage-300">contact page</Link>.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-heading">Related material planning tools</h2>
        <ul className="space-y-3 text-[15px]">
          <li><Link href="/yarn-weight-chart" className="font-medium text-sage-700 underline dark:text-sage-300">Yarn Weight and Substitution Guide</Link><span className="text-bark-500"> — compare yarn categories, fibers, and substitution behavior.</span></li>
          <li><Link href="/needle-guide" className="font-medium text-sage-700 underline dark:text-sage-300">Needle Guide</Link><span className="text-bark-500"> — review needle types and sizes for fiber projects.</span></li>
          <li><Link href="/project-cost-calculator" className="font-medium text-sage-700 underline dark:text-sage-300">Project Cost Calculator</Link><span className="text-bark-500"> — estimate materials, notions, and time before purchasing.</span></li>
        </ul>
      </section>

      <section className="mt-12 border-t border-bark-200 pt-6 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-200">Fabric data sources</h2>
        <p className="mt-2 text-sm leading-relaxed text-bark-500">Source selection favors textile education and established sewing instruction over a single retailer&apos;s product descriptions. See the repository source notes for the field-by-field method and review date.</p>
        <ul className="mt-3 space-y-2 text-sm text-bark-500">
          <li><a href="https://cottonworks.com/learning-hub/knitting/single-and-double-knits/" target="_blank" rel="noopener noreferrer" className="text-sage-700 underline dark:text-sage-300">CottonWorks, Single and Double Knits</a> — jersey, rib, interlock, and Ponte structures.</li>
          <li><a href="https://cottonworks.com/learning-hub/weaving/basic-woven-fabric-designs/" target="_blank" rel="noopener noreferrer" className="text-sage-700 underline dark:text-sage-300">CottonWorks, Basic Woven Fabric Designs</a> — plain and twill weave behavior.</li>
          <li><a href="https://www.seamwork.com/fabric-guides/the-ultimate-guide-to-sewing-with-silk" target="_blank" rel="noopener noreferrer" className="text-sage-700 underline dark:text-sage-300">Seamwork, Guide to Sewing with Silk</a> — chiffon, georgette, satin, charmeuse, organza, and crepe.</li>
          <li><a href="https://www.seamwork.com/issues/2017/04/one-pattern-three-fabrics-2" target="_blank" rel="noopener noreferrer" className="text-sage-700 underline dark:text-sage-300">Seamwork, One Pattern, Three Fabrics</a> — cotton lawn, linen, and rayon challis behavior.</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
