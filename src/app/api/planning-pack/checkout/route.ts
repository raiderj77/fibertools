import "server-only";

import planningPackReleaseManifest from "../../../../../config/planning-pack-release-manifest.json";
import { handlePlanningPackCheckoutRequest } from "@/lib/planning-pack-delivery.mjs";
import { createPlanningPackDeliveryDependencies } from "@/lib/planning-pack-delivery-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dependencies = createPlanningPackDeliveryDependencies();

export async function GET() {
  return handlePlanningPackCheckoutRequest({
    manifest: planningPackReleaseManifest,
    env: process.env,
    dependencies,
  });
}
