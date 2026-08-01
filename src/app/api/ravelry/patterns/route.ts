import { NextResponse } from "next/server";

// Read-only Ravelry pattern search, proxied server-side so the API credentials
// never reach the browser.
//
// Env (set in Vercel project settings):
//   RAVELRY_API_USERNAME, read-only "Basic Auth: read only access" username
//   RAVELRY_API_PASSWORD, its paired password
//
// Query params: q (approved project keyword), craft (knitting|crochet),
//               weight (worsted|dk|...), limit (default 6, max 12)

const RAVELRY_API = "https://api.ravelry.com";
const ALLOWED_CRAFTS = new Set(["knitting", "crochet"]);
const ALLOWED_QUERIES = new Set([
  "blanket",
  "sweater",
  "hat",
  "scarf",
  "socks",
  "amigurumi",
  "shawl",
  "mittens",
]);
const ALLOWED_WEIGHTS = new Set([
  "lace",
  "fingering",
  "sport",
  "dk",
  "worsted",
  "bulky",
  "super bulky",
  "jumbo",
]);

function cleanKeyword(value: string | null) {
  return (value || "")
    .replace(/[^a-z0-9 '&-]/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

type RavPhoto = {
  square_url?: string;
  small_url?: string;
  thumbnail_url?: string;
  medium_url?: string;
};
type RavPattern = {
  name?: string;
  permalink?: string;
  designer?: { name?: string };
  pattern_author?: { name?: string };
  first_photo?: RavPhoto;
  free?: boolean;
};

export async function GET(request: Request) {
  const user = process.env.RAVELRY_API_USERNAME;
  const pass = process.env.RAVELRY_API_PASSWORD;

  // Graceful no-op if not configured, the calculator page still works fine.
  if (!user || !pass) {
    return NextResponse.json(
      { patterns: [], configured: false },
      { status: 200 }
    );
  }

  const { searchParams } = new URL(request.url);
  const requestedQuery = cleanKeyword(searchParams.get("q"));
  const query = ALLOWED_QUERIES.has(requestedQuery) ? requestedQuery : "";
  const requestedCraft = searchParams.get("craft") || "";
  const craft = ALLOWED_CRAFTS.has(requestedCraft) ? requestedCraft : "";
  const requestedWeight = searchParams.get("weight") || "";
  const weight = ALLOWED_WEIGHTS.has(requestedWeight) ? requestedWeight : "";
  const limit = Math.min(Math.max(Math.trunc(Number(searchParams.get("limit"))) || 6, 1), 12);

  if (
    (requestedQuery && !query) ||
    (requestedCraft && !craft) ||
    (requestedWeight && !weight)
  ) {
    return NextResponse.json(
      { patterns: [], error: "invalid_pattern_search" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    page_size: String(limit),
    sort: "projects", // most-made = most useful/proven
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
      signal: AbortSignal.timeout(8000),
    });

    if (!r.ok) {
      return NextResponse.json(
        { patterns: [], error: "pattern_search_unavailable" },
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
        thumbnail:
          p.first_photo?.square_url ||
          p.first_photo?.small_url ||
          p.first_photo?.thumbnail_url ||
          p.first_photo?.medium_url,
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
      { patterns: [], error: "pattern_search_unavailable" },
      { status: 200 }
    );
  }
}
