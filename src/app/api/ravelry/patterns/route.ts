import { NextResponse } from "next/server";

// Read-only Ravelry pattern search, proxied server-side so the API credentials
// never reach the browser. Mirrors api/indexnow/route.ts (Node runtime, env vars).
//
// Env (set in Vercel project settings):
//   RAVELRY_API_USERNAME  — read-only "Basic Auth: read only access" username
//   RAVELRY_API_PASSWORD  — its paired password
//
// Query params: q (keyword), craft (knitting|crochet), weight (worsted|dk|...),
//               pc (pattern category e.g. blanket, pullover), limit (default 6, max 12)

export const dynamic = "force-dynamic"; // TEMP: no route caching while debugging

const RAVELRY_API = "https://api.ravelry.com";

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

  // Graceful no-op if not configured — the calculator page still works fine.
  if (!user || !pass) {
    return NextResponse.json(
      { patterns: [], configured: false },
      { status: 200 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const craft = searchParams.get("craft") || "";
  const weight = searchParams.get("weight") || "";
  const pc = searchParams.get("pc") || "";
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 6, 1), 12);

  const params = new URLSearchParams({
    page_size: String(limit),
    sort: "projects", // most-made = most useful/proven
  });
  if (query) params.set("query", query);
  if (craft) params.set("craft", craft);
  if (weight) params.set("weight", weight);
  if (pc) params.set("pc", pc);

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  try {
    const r = await fetch(`${RAVELRY_API}/patterns/search.json?${params.toString()}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "User-Agent": "FiberToolsApp/1.0 (+https://fibertools.app)",
      },
      cache: "no-store", // TEMP: live read while debugging auth (restore caching after)
    });

    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      return NextResponse.json(
        { patterns: [], error: `ravelry_${r.status}`, detail },
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
  } catch (err) {
    return NextResponse.json(
      { patterns: [], error: String(err) },
      { status: 200 }
    );
  }
}
