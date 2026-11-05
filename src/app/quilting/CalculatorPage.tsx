import AnswerBlock from "@/components/AnswerBlock";
import Link from "next/link";
import { quiltingRetailers } from "@/lib/quilting-retailers";
import { getRelatedTools } from "@/lib/tools";
import QuiltingLayout from "./QuiltingLayout";
import PlanningCalculator from "./PlanningCalculator";

const content = {
  backing: { title: "Quilt Backing Calculator", description: "Compare backing yardage for 44, 90, and 108 inch fabric widths.", example: "For an 84 x 96 inch quilt with 4 inch overhang, backing is 92 x 104 inches. At 44 inches, use 3 panels and 8.75 yards; at 108 inches, use 1 panel and 3 yards.", limits: "This assumes 2 inches of unusable selvedge or seams. Confirm fabric width, shrinkage, directionality, and your preferred overhang before buying." },
  binding: { title: "Quilt Binding Calculator", description: "Plan continuous binding strips and yardage from your quilt dimensions.", example: "An 84 x 96 inch quilt has a 360 inch perimeter. Adding 10 inches gives 370 inches: 9 strips at 44 inch fabric width and 0.75 yard at 2.5 inch strips.", limits: "The result includes a fixed 10 inch allowance for joins and overlap; adjust for your binding method, joins, and prewashing." },
  border: { title: "Quilt Border Calculator", description: "Compare lengthwise and crosswise fabric plans for mitered quilt borders.", example: "A 60 x 72 inch quilt with a 6 inch cut border finishes at 72 x 84 inches. On 44 inch fabric, lengthwise needs 2.5 yards and crosswise needs 1.5 yards.", limits: "Enter cut width including your seam allowance. Mitered corners are assumed; directional prints, grain, shrinkage, and piecing choices can change the plan." },
  batting: { title: "Quilt Batting Calculator", description: "Find required batting dimensions and a fitting common packaged size.", example: "An 84 x 96 inch quilt with 4 inch overhang needs 92 x 104 inch batting, so Queen 90 x 108 does not fit and King 120 x 120 is selected. A 60 x 72 quilt needs 68 x 80 and fits Twin 72 x 90.", limits: "Listed packaged sizes are common packaged sizes, not manufacturer-verified specifications. Check the actual package, loft, shrinkage guidance, and quilting method." },
} as const;

export default function CalculatorPage({ type }: { type: keyof typeof content }) {
  const item = content[type];
  const related = getRelatedTools(`quilting/${type}-calculator`, 3);
  return <QuiltingLayout title={item.title} description={item.description}>
    <div className="mt-8"><AnswerBlock what="A browser-only quilt planning calculator." who="Quilters estimating materials before shopping or cutting." bottomLine="Use this as a planning aid and verify your materials before purchase." lastUpdated="2026-10-23" /></div>
    <PlanningCalculator type={type} />
    <section className="mt-10"><h2 className="section-heading">How it works</h2><p className="text-bark-600">All measurements are inches. Results round yardage up to the next quarter yard so the plan does not understate the calculated requirement.</p></section>
    <section className="mt-10"><h2 className="section-heading">Worked example</h2><p className="text-bark-600">{item.example}</p></section>
    <section className="mt-10"><h2 className="section-heading">Assumptions and limits</h2><p className="text-bark-600">{item.limits}</p></section>
    <section className="mt-10"><h2 className="section-heading">Frequently asked questions</h2><h3 className="font-semibold text-bark-700">Are these purchase guarantees?</h3><p className="text-bark-600">No. They are bounded arithmetic planning aids; measure your project and check product details before purchasing.</p></section>
    {type === "backing" && <section className="mt-10"><p className="text-sm text-bark-500">Amazon links are affiliate links and cost the reader nothing extra. The Fat Quarter Shop link is a regular retailer link, not an affiliate link.</p><a href={quiltingRetailers.fatQuarterShopWideback} rel="nofollow noopener noreferrer" className="mt-3 inline-block text-plum-600 underline hover:text-plum-700">Browse wideback fabric at Fat Quarter Shop</a></section>}
    <section className="mt-12"><h2 className="section-heading">Related Fiber Arts Tools</h2><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{related.map((tool) => <Link key={tool.slug} href={`/${tool.slug}`} className="tool-card"><h3 className="font-medium text-bark-700">{tool.shortName}</h3><p className="mt-1 text-sm text-bark-500">{tool.description}</p></Link>)}</div></section>
  </QuiltingLayout>;
}
