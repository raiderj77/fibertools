import { createStitchProofPurchaseDependencies } from "@/lib/stitchproof-purchase-server";
import { handleStitchProofAccessRequest } from "@/lib/stitchproof-purchase-service.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dependencies = createStitchProofPurchaseDependencies();

export const POST = (request: Request) => handleStitchProofAccessRequest({
  request, env: process.env, dependencies, now: new Date(),
});
