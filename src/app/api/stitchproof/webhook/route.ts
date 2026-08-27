import { createStitchProofPurchaseDependencies } from "@/lib/stitchproof-purchase-server";
import { handleStitchProofWebhookRequest } from "@/lib/stitchproof-purchase-service.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dependencies = createStitchProofPurchaseDependencies();

export const POST = (request: Request) => handleStitchProofWebhookRequest({
  request, env: process.env, dependencies, now: new Date(),
});
