import { NextResponse } from "next/server";

const TOOL_URLS = [
  "/yarn-calculator",
  "/needle-converter",
  "/gauge-calculator",
  "/yarn-weight-chart",
  "/stitch-counter",
  "/blanket-calculator",
  "/increase-decrease-calculator",
  "/stripe-generator",
  "/abbreviation-glossary",
  "/stitch-pattern-calculator",
  "/stitch-quick-reference",
  "/uk-to-us-converter",
  "/circle-calculator",
  "/needle-guide",
  "/amigurumi-shapes",
  "/project-cost-calculator",
  "/color-pooling-calculator",
  "/wpi-calculator",
  "/cast-on-calculator",
  "/hat-calculator",
  "/sock-calculator",
  "/sleeve-calculator",
  "/raglan-calculator",
  "/blocking-calculator",
  "/stash-estimator",
  "/c2c-calculator",
  "/granny-square-planner",
  "/spinning-ratio-calculator",
  "/weaving-sett-calculator",
  "/cross-stitch-calculator",
  "/thread-converter",
];

const BLOG_URLS = [
  "/blog/yarn-calculator-guide",
  "/blog/needle-size-chart-guide",
  "/blog/gauge-calculator-guide",
  "/blog/yarn-weight-chart-guide",
  "/blog/stitch-counter-guide",
  "/blog/blanket-size-guide",
  "/blog/increase-decrease-guide",
  "/blog/stripe-pattern-guide",
  "/blog/knitting-abbreviations-guide",
  "/blog/spinning-wheel-guide",
  "/blog/cross-stitch-fabric-guide",
  "/blog/weaving-sett-guide",
  "/blog/project-cost-guide",
  "/blog/color-pooling-guide",
  "/blog/thread-conversion-guide",
  "/blog/stitch-multiples-sampler-blanket-guide",
  "/blog/crochet-stitch-quick-reference-guide",
];

const HOST = "fibertools.app";

export async function POST() {
  const key = process.env.INDEXNOW_API_KEY;

  if (!key) {
    return NextResponse.json(
      { error: "INDEXNOW_API_KEY not configured" },
      { status: 500 }
    );
  }

  const urlList = [
    `https://${HOST}`,
    ...TOOL_URLS.map((path) => `https://${HOST}${path}`),
    ...BLOG_URLS.map((path) => `https://${HOST}${path}`),
  ];

  const body = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    return NextResponse.json({
      status: response.status,
      submitted: urlList.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit to IndexNow", details: String(error) },
      { status: 500 }
    );
  }
}
