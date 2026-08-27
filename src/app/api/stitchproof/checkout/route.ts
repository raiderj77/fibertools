import { createStitchProofPurchaseDependencies } from "@/lib/stitchproof-purchase-server";
import { handleStitchProofCheckoutRequest } from "@/lib/stitchproof-purchase-service.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dependencies = createStitchProofPurchaseDependencies();

const handle = (request: Request) => handleStitchProofCheckoutRequest({
  request, env: process.env, dependencies, now: new Date(),
});

export const GET = handle;
export const POST = handle;
