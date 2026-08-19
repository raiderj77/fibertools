import { createClient } from "@supabase/supabase-js";

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required server configuration: ${name}`);
  return value;
}

function stripeLivemode() {
  const mode = requiredEnvironment("STRIPE_MODE").toLowerCase();
  if (mode !== "test" && mode !== "live") throw new Error("STRIPE_MODE must be either test or live.");
  return mode === "live";
}

function retentionBatchSize() {
  const raw = process.env.PREFLIGHT_RETENTION_BATCH_SIZE?.trim() || "100";
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 500) {
    throw new Error("PREFLIGHT_RETENTION_BATCH_SIZE must be an integer from 1 to 500.");
  }
  return parsed;
}

function privacySafeErrorCode(error) {
  const candidate = error && typeof error === "object" && "code" in error ? String(error.code) : "unknown";
  return /^[a-z0-9_.-]{1,80}$/i.test(candidate) ? candidate.toLowerCase() : "unknown";
}

function requestedAction(livemode) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--apply")) {
    throw new Error("Only the optional --apply flag is supported.");
  }
  if (!args.includes("--apply")) return "plan";

  const requiredConfirmation = livemode
    ? "apply-designer-preflight-live"
    : "apply-designer-preflight-test";
  if (process.env.DESIGNER_PREFLIGHT_OPS_APPLY_CONFIRM?.trim() !== requiredConfirmation) {
    throw new Error("Mutation requires the matching explicit apply confirmation.");
  }
  return "apply";
}

async function main() {
  const livemode = stripeLivemode();
  const action = requestedAction(livemode);
  const supabase = createClient(
    requiredEnvironment("SUPABASE_URL"),
    requiredEnvironment("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  );

  const rpcName = action === "apply"
    ? "run_designer_preflight_ops_watchdog"
    : "plan_designer_preflight_ops_watchdog";
  const rpcArgs = action === "apply"
    ? { p_stripe_livemode: livemode, p_retention_limit: retentionBatchSize() }
    : { p_stripe_livemode: livemode };
  const { data, error } = await supabase.rpc(rpcName, rpcArgs);
  if (error) {
    console.error(`Designer preflight watchdog failed with code ${privacySafeErrorCode(error)}.`);
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify({ ok: true, action, stripeMode: livemode ? "live" : "test", result: data }));
}

await main();
