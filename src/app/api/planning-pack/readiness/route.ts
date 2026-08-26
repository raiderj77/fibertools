import { getPlanningPackDeliveryEnvironmentReadiness } from "@/lib/planning-pack-delivery-config.mjs";

export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export async function GET() {
  const readiness = getPlanningPackDeliveryEnvironmentReadiness(process.env);
  return Response.json(
    { ready: readiness.ready, checks: readiness.checks },
    { status: 200, headers: HEADERS }
  );
}
