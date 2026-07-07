import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
import StashEstimatorTool from "./StashEstimatorTool";

export const metadata: Metadata = {
  title: "Yarn Stash Estimator",
  description:
    "Estimate remaining yardage in partial skeins by weight, plus a yardage reference table for unlabeled yarn by weight category.",
  keywords: [
    "yarn stash calculator",
    "partial skein yardage",
    "how much yarn is left",
    "yarn weight yardage chart",
    "remaining yarn calculator",
  ],
  alternates: { canonical: "/stash-estimator" },
};

export default function StashEstimatorPage() {
  return (
    <ToolLayout slug="stash-estimator" widgetFirst>
      <AnswerBlock
        what="A tool that estimates remaining yardage in partial skeins by weight, with a reference table for unlabeled yarn by weight category."
        who="Yarn crafters with partial skeins who need to know if they have enough yarn left for a project."
        bottomLine="Weigh your partial skein and enter the original skein specs to find out how many yards remain."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Yarn Stash Estimator Tool</h2>
        <h2>How to Estimate Remaining Yardage</h2>
        <h2>Stash Estimation Results and Yardage Reference</h2>
      </div>
      <StashEstimatorTool />

      {/* Content sections */}

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          How can I use a yarn weight yardage chart to estimate remaining yarn?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            A yardage reference table shows the standard yards per ounce for each weight category, so you can multiply your partial skein weight by that ratio to estimate how much yarn remains. This works best for yarn with stable construction like smooth singles or traditional plies, and gives you a quick ballpark figure when you do not have the label.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          The key is that each yarn weight category has a typical yardage range. Fingering weight yields roughly 400 to 500 yards per ounce, worsted weight gives you about 180 to 220 yards per ounce, and bulky weight lands around 60 to 100 yards per ounce. If your partial skein weighs 1 ounce and came from a worsted weight yarn, you can estimate somewhere between 180 and 220 yards remaining. For a more accurate starting point, pick the middle of that range for your weight category.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Keep notes when you buy yarn about the yardage and weight from the label, even just in a phone note with a photo of the ball band. Over time you will spot patterns in which yarn brands run shorter or longer for their weight, and that knowledge makes your estimates even sharper. Novelty yarns like boucles or fuzzy textured yarns will throw off the estimate because their construction creates dead air space, so use this method only for straightforward yarn.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-bark-800 dark:text-cream-100 mb-3">
          What is the best way to build a personal yarn stash reference system?
        </h2>
        <div className="border-l-4 border-sage-500 bg-sage-50/50 dark:bg-sage-950/20 pl-4 rounded-r-lg py-3 mb-5">
          <p className="text-bark-700 dark:text-cream-300 text-[15px] leading-relaxed">
            Organize your stash by yarn weight category, and keep the label or a photo of the ball band with each skein so you always have weight, yardage, and fiber content on hand. This makes it possible to estimate partial skeins in minutes and saves you from having to recalculate the same yarn twice.
          </p>
        </div>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed mb-4">
          When you start a project, label each ball or skein with a piece of tape showing the project name and date. As you finish or set skeins aside, write the remaining weight on that same tape. This record becomes invaluable: you can quickly see which projects used which yarns, how much weight you expected to use versus what you actually used, and spot yarns that consistently run longer or shorter than their labels claim. Some crafters keep a spreadsheet or app, but a simple notebook with photos of ball bands and weight notes works just as well.
        </p>
        <p className="text-bark-600 dark:text-bark-400 text-[15px] leading-relaxed">
          Store partial skeins in a labeled bag by weight category and fiber type so you can grab what you need for small projects, color matching, or trying a stitch gauge. When you encounter a skein with no label, you can compare its feel and heft against your reference collection to guess its weight category. Over a few months you will develop a hands-on sense for what fingering versus worsted versus chunky really feels like, which makes mystery yarn much less mysterious the next time.
        </p>
      </section>
    </ToolLayout>
  );
}
