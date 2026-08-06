const TOOL_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function buildToolShareUrl(currentUrl, toolSlug) {
  if (!TOOL_SLUG_PATTERN.test(toolSlug)) {
    throw new TypeError("toolSlug must be a canonical FiberTools slug");
  }

  const current = new URL(currentUrl);
  const shareUrl = new URL(`/${toolSlug}`, current.origin);
  shareUrl.searchParams.set("utm_source", "tool_share");
  shareUrl.searchParams.set("utm_medium", "referral");
  shareUrl.searchParams.set("utm_campaign", "calculator_result");
  shareUrl.searchParams.set("utm_content", toolSlug);
  return shareUrl.toString();
}
