"use client";

// Amazon affiliate "materials for this project" — static curated search links.
// ytearnings-20 (fibertools.app registered in the Associates account). Amazon
// pays on any qualifying purchase within 24h of the click, so category search
// links earn even when the buyer picks a different item.
const TAG = "ytearnings-20";

const WEIGHT_YARN = {
  lace: "lace weight yarn",
  fingering: "fingering weight yarn",
  sport: "sport weight yarn",
  dk: "DK weight yarn",
  worsted: "worsted weight yarn",
  bulky: "bulky weight yarn",
  superbulky: "super bulky yarn",
  jumbo: "jumbo yarn",
};

function amazon(q) {
  return "https://www.amazon.com/s?k=" + encodeURIComponent(q) + "&tag=" + TAG;
}
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function track(label) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "materials_click", { item: label });
  }
}

export default function FiberGear({ weight, craft, visible }) {
  if (!visible) return null;

  const yarn = WEIGHT_YARN[weight] || "yarn for your project";
  const tool =
    craft === "crochet"
      ? { label: "Crochet hooks", q: "crochet hook set ergonomic" }
      : craft === "knit"
      ? { label: "Knitting needles", q: "knitting needles set" }
      : { label: "Needles & hooks", q: "knitting needles crochet hook set" };

  const items = [
    { icon: "🧶", label: cap(yarn), q: yarn },
    { icon: "🪡", label: tool.label, q: tool.q },
    { icon: "📍", label: "Stitch markers", q: "stitch markers knitting crochet" },
    { icon: "🧵", label: "Tapestry needles", q: "tapestry needles yarn darning" },
  ];

  return (
    <section className="border-t border-cream-300 dark:border-bark-700 pt-8">
      <h2 className="text-lg font-display text-bark-800 dark:text-cream-100 mb-1">
        Get the materials
      </h2>
      <p className="text-sm text-bark-500 dark:text-bark-400 mb-4">
        Everything you need for this project, on Amazon.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it) => (
          <a
            key={it.label}
            href={amazon(it.q)}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={() => track(it.label)}
            className="group flex flex-col items-center gap-1.5 rounded-lg border border-cream-300 dark:border-bark-700 p-3 text-center transition hover:border-sage-400 dark:hover:border-sage-500"
          >
            <span className="text-2xl" aria-hidden="true">{it.icon}</span>
            <span className="text-sm font-medium text-bark-800 dark:text-cream-100 group-hover:text-sage-600 dark:group-hover:text-sage-400">
              {it.label}
            </span>
          </a>
        ))}
      </div>
      <p className="text-xs text-bark-400 dark:text-bark-500 mt-3">
        As an Amazon Associate, FiberTools earns from qualifying purchases.
      </p>
    </section>
  );
}
