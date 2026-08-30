import { NextResponse } from "next/server";

// Read-only Ravelry pattern search, proxied server-side so the API credentials
// never reach the browser.
//
// Env (set in Vercel project settings):
//   RAVELRY_API_USERNAME, read-only "Basic Auth: read only access" username
//   RAVELRY_API_PASSWORD, its paired password
//
// Query params are limited to the closed filter vocabulary used by the Yarn
// Calculator. This keeps the credentialed proxy bounded and cacheable.

const RAVELRY_API = "https://api.ravelry.com";
const ALLOWED_QUERIES = new Set(["", "blanket", "scarf", "wrap"]);
const ALLOWED_CRAFTS = new Set(["", "knitting", "crochet"]);
const ALLOWED_WEIGHTS = new Set(["", "lace", "fingering", "sport", "dk", "worsted", "bulky", "super bulky", "jumbo"]);
const ALLOWED_PARAMETER_NAMES = new Set(["q", "craft", "weight", "limit"]);

type RavPattern = {
  name?: string;
  permalink?: string;
  designer?: { name?: string };
  pattern_author?: { name?: string };
  free?: boolean;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const craft = searchParams.get("craft") || "";
  const weight = searchParams.get("weight") || "";
  const requestedLimit = searchParams.get("limit");
  const parameterNames = [...searchParams.keys()];
  const hasUnsupportedShape = parameterNames.some((name) => !ALLOWED_PARAMETER_NAMES.has(name))
    || [...ALLOWED_PARAMETER_NAMES].some((name) => searchParams.getAll(name).length > 1);
  if (hasUnsupportedShape
    || !ALLOWED_QUERIES.has(query)
    || !ALLOWED_CRAFTS.has(craft)
    || !ALLOWED_WEIGHTS.has(weight)
    || (requestedLimit !== null && requestedLimit !== "6")) {
    return NextResponse.json({ patterns: [], error: "unsupported_filters" }, { status: 400 });
  }
  const limit = 6;

  const user = process.env.RAVELRY_API_USERNAME;
  const pass = process.env.RAVELRY_API_PASSWORD;

  // Graceful no-op if not configured, the calculator page still works fine.
  if (!user || !pass) {
    return NextResponse.json(
      { patterns: [], configured: false },
      { status: 200 }
    );
  }

  const params = new URLSearchParams({
    page_size: String(limit),
    sort: "projects",
  });
  if (query) params.set("query", query);
  if (craft) params.set("craft", craft);
  if (weight) params.set("weight", weight);

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  try {
    const r = await fetch(`${RAVELRY_API}/patterns/search.json?${params.toString()}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "User-Agent": "FiberToolsApp/1.0 (+https://fibertools.app)",
      },
      next: { revalidate: 86400 }, // cache 24h to respect rate limits
    });

    if (!r.ok) {
      return NextResponse.json(
        { patterns: [], error: `ravelry_${r.status}` },
        { status: 200 }
      );
    }

    const data = await r.json();
    const patterns = (Array.isArray(data.patterns) ? data.patterns : []).map(
      (p: RavPattern) => ({
        name: p.name,
        url: p.permalink
          ? `https://www.ravelry.com/patterns/library/${p.permalink}`
          : undefined,
        designer: p.designer?.name || p.pattern_author?.name,
        free: Boolean(p.free),
      })
    );

    const res = NextResponse.json({ patterns, configured: true });
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );
    return res;
  } catch {
    return NextResponse.json(
      { patterns: [], error: "ravelry_unavailable" },
      { status: 200 }
    );
  }
}
