import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StashEstimatorTool from "./StashEstimatorTool";

const description = "Estimate yarn remaining in a partial skein from its measured weight and the same yarn's label weight and length. Category alone cannot determine yardage.";
export const metadata: Metadata = {
  title: { absolute: "Yarn Stash Estimator: Partial Skein Yardage" }, description,
  alternates: { canonical: "/stash-estimator" },
  openGraph: { title: "Yarn Stash Estimator", description, url: "https://fibertools.app/stash-estimator", type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Yarn Stash Estimator" }] },
  twitter: { card: "summary_large_image", title: "Yarn Stash Estimator", description, images: ["/og-image.png"] },
};
export default function StashEstimatorPage() {
  return <ToolLayout slug="stash-estimator" widgetFirst>
    <AnswerBlock what="A proportional estimate of remaining yarn length using the same yarn's label and a measured remaining weight."
      who="Crafters planning with a partial skein whose original label values are known."
      bottomLine="Remaining length = remaining weight divided by full label weight, multiplied by full label length."
      lastUpdated="2026-09-05" />
    <StashEstimatorTool />
    <section className="mt-10"><h2 className="text-xl font-semibold">Check the yarn, measurement, and project</h2>
      <p className="mt-3">Use a scale with enough resolution for the quantity being weighed. Subtract packaging or spool weight. For uneven or mixed yarns, a single weight ratio may not represent every section. Compare the estimate with a representative swatch or pattern requirement and allow for finishing, joins, and waste.</p>
      <p className="mt-3">The <a className="underline" href="https://www.craftyarncouncil.com/standards/yarn-weight-system" target="_blank" rel="noopener noreferrer">Craft Yarn Council weight system</a> provides gauge guidelines and category names, not universal length-per-mass values. Follow the exact yarn label and pattern gauge.</p>
    </section>
  </ToolLayout>;
}
