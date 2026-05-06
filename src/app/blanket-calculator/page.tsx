import type { Metadata } from "next";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import BlanketCalculatorTool from "./BlanketCalculatorTool";

export const metadata: Metadata = {
  title: "Blanket Yarn Calculator — How Much Do I Need?",
  description:
    "Calculate how much yarn you need for any blanket — baby to king size. Get stitch count, row count, and total yardage instantly. Free.",
  keywords: [
    "blanket size chart", "crochet blanket sizes", "blanket size calculator",
    "how big should a blanket be", "baby blanket size crochet", "throw blanket dimensions",
    "king size blanket crochet stitches", "how many chains for a throw blanket",
    "crochet blanket yardage chart", "blanket dimensions chart",
    "blanket yarn calculator", "crochet blanket calculator",
    "knitting blanket size guide", "blanket stitch count",
  ],
  authors: [{ name: "Jason Ramirez", url: "https://fibertools.app/about" }],
  openGraph: {
    title: "Blanket Yarn Calculator — How Much Do I Need?",
    description:
      "Calculate how much yarn you need for any blanket — baby to king size. Get stitch count, row count, and total yardage instantly. Free.",
    url: "https://fibertools.app/blanket-calculator",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Blanket Yarn Calculator — How Much Do I Need?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blanket Yarn Calculator — How Much Do I Need?",
    description:
      "Calculate how much yarn you need for any blanket — baby to king size. Get stitch count, row count, and total yardage instantly. Free.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/blanket-calculator" },
  other: { dateModified: "2026-05-05" },
};

export default function BlanketCalculatorPage() {
  return (
    <ToolLayout slug="blanket-calculator" widgetFirst>
      <AnswerBlock
        what="A calculator that determines how much yarn you need for any blanket size, from baby to king, with stitch counts, row counts, and total yardage."
        who="Knitters and crocheters planning a blanket project who want to buy the right amount of yarn before starting."
        bottomLine="Select your blanket size and enter your gauge to get an accurate yarn estimate — always buy an extra skein as a buffer."
        lastUpdated="2026-05-05"
      />

      <BlanketCalculatorTool />

      {/* ── Content sections ── */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do you calculate how much yarn you need for a blanket?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Multiply the finished width by the finished length to get square inches, then apply your yarn
            weight&rsquo;s coverage factor. Worsted weight (CYC 4) uses approximately 1.3 yards per square
            inch; bulky uses about 0.95. Add a 10% overage buffer, then divide by your skein&rsquo;s yardage
            to get skein count. Entering your gauge gives more precise stitch and row counts.<sup>1</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The coverage-factor method works well for a quick estimate, but gauge-based calculation is more
          accurate. A swatch lets you measure your actual stitches per inch rather than relying on the yarn
          weight average. Even a 4×4 inch swatch can reveal if your tension runs tight or loose compared to
          the label — which shifts total yardage by 10–20%.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Stitch pattern matters too. Plain stockinette uses less yarn per square inch than cables or bobble
          textures, which add significant yarn consumption. If your pattern is heavily textured, add an
          additional 10–15% on top of the baseline estimate.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What are the standard blanket sizes?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A standard throw measures 50×60 inches — large enough to cover an adult on a sofa. Baby and crib
            blankets run 36×52 inches. Bed blankets scale from twin (66×90 inches) to king (108×100 inches).
            The Craft Yarn Council recommends adding 10–15 inches of overhang per side for blankets designed
            to drape over a bed.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Lap blankets and stroller blankets fall in the 36×48 to 30×40 inch range — useful for portability
          without the yardage commitment of a full throw. Lovey blankets are typically 12×12 inches and use
          as little as 50–100 yards.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          When measuring for a bed blanket, measure from the mattress surface down to where you want the
          blanket to fall on each side. Most makers target mid-mattress depth (10–12 inches) rather than
          floor-length. Add both sides together and add that to the mattress width before calculating.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How much yarn do I need for a baby blanket?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A standard baby blanket (36×52 inches) in worsted weight (CYC 4) requires approximately
            1,000–1,400 yards depending on stitch density. Plain single crochet uses less; textured patterns
            like basketweave or bobble stitches use significantly more. Always purchase an extra skein —
            dye lots vary by batch, and matching one later is unreliable.<sup>3</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          For fingering weight baby blankets, double the yardage estimate — fingering covers roughly half the
          square inches per yard compared to worsted. A fingering-weight lace baby blanket of the same
          36×52 inch size typically consumes 1,800–2,400 yards.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Receiving blankets (30×30 inches) are significantly smaller and usually need 600–900 yards in
          worsted. Stroller blankets (30×40 inches) fall between receiving and crib size. The calculator
          above covers all these sizes with the preset size buttons.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What yarn weight is best for blankets?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Worsted (CYC 4) is the most versatile blanket weight — fast to work, widely available, and
            durable. DK (CYC 3) produces lighter fabric preferred for heirloom baby items. Bulky (CYC 5)
            and Super Bulky (CYC 6) work best for quick-knit chunky throws. The Craft Yarn Council lists
            5.0–5.5mm hook sizes as standard for worsted blanket projects.<sup>4</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          Fiber type affects drape and washability. Acrylic and acrylic blends are the practical choice for
          blankets that see heavy use — they&rsquo;re machine washable and hold color well. Wool makes
          warm, luxurious blankets but usually requires hand-washing or gentle machine cycles. Cotton and
          cotton blends work well for summer-weight throws but have less stretch, making gauge consistency
          more demanding.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Super Bulky and Jumbo weights (CYC 6–7) complete a throw in hours rather than days, which is
          appealing — but they require oversized hooks or needles (12–25mm) and produce a stiffer fabric
          with less drape. Arm-knitting blankets fall in the jumbo range.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How do pillow tuck and bed overhang affect yardage?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Pillow tuck adds 20 inches of extra length so the blanket drapes over the pillow stack and stays
            anchored. Bed overhang — the portion that hangs down each side — typically runs 10–15 inches per
            side. A queen mattress (60×80 inches) with standard 12-inch overhang and pillow tuck requires a
            finished blanket of approximately 90×112 inches.<sup>2</sup>
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          A blanket without overhang or tuck — just covering the mattress top — uses far less yarn but looks
          flat and moves around during sleep. Most bed blanket patterns assume at least a 10-inch drop on
          each side. The calculator adds overhang to both the width and one end of the length (footboard
          side), matching how most makers work.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          The yardage difference is substantial. A plain queen-size mattress cover (90×100 inches) at worsted
          weight needs approximately 2,300 yards. Adding 12-inch overhang all around and pillow tuck pushes
          that to nearly 4,000 yards — almost double. Checking the size before you buy is the most impactful
          step in any blanket project.<sup>5</sup>
        </p>
      </section>

      {/* ── References ── */}
      <section className="mt-12 pt-6 border-t border-bark-200 dark:border-bark-700">
        <h2 className="text-base font-semibold text-bark-700 dark:text-cream-300 mb-3">References</h2>
        <ol className="space-y-1.5 text-sm text-bark-500 dark:text-bark-400">
          <li>
            <span className="font-medium">1.</span>{" "}
            Craft Yarn Council — Standard Yarn Weight System.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/yarn-weight"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">2.</span>{" "}
            Craft Yarn Council — Gauge and Swatch Standards.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/gauge"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">3.</span>{" "}
            Ravelry — Blanket pattern database, yardage data from community project records.{" "}
            <Link
              href="https://www.ravelry.com/patterns/search#craft=knitting&pc=blanket"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              ravelry.com
            </Link>
          </li>
          <li>
            <span className="font-medium">4.</span>{" "}
            Craft Yarn Council — Needle and Hook Size Chart.{" "}
            <Link
              href="https://www.craftyarncouncil.com/standards/needle-hook-chart"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              craftyarncouncil.com
            </Link>
          </li>
          <li>
            <span className="font-medium">5.</span>{" "}
            Yarnspirations — Blanket Yardage and Size Guide.{" "}
            <Link
              href="https://www.yarnspirations.com/blogs/ideas-and-inspiration"
              className="text-sage-600 dark:text-sage-400 underline"
              target="_blank"
              rel="nofollow noopener"
            >
              yarnspirations.com
            </Link>
          </li>
        </ol>
      </section>
    </ToolLayout>
  );
}
