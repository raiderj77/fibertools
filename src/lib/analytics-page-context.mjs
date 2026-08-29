export const GOOGLE_MEASUREMENT_ID = "G-T92LYDE8NN";

const TOOL_SHARE_CAMPAIGN = Object.freeze({
  campaign_source: "tool_share",
  campaign_medium: "referral",
  campaign_name: "calculator_result",
});

const SHAREABLE_TOOL_SLUGS = new Set([
  "blanket-calculator",
  "cast-on-calculator",
  "sock-calculator",
  "yarn-calculator",
  "yarn-weight-calculator",
]);

function readSingleParameter(searchParams, name) {
  const values = searchParams.getAll(name);
  return values.length === 1 ? values[0] : null;
}

export function buildSafeToolShareCampaign(search) {
  if (typeof search !== "string" || search.length === 0) return {};

  let searchParams;
  try {
    searchParams = new URLSearchParams(search);
  } catch {
    return {};
  }

  const source = readSingleParameter(searchParams, "utm_source");
  const medium = readSingleParameter(searchParams, "utm_medium");
  const campaign = readSingleParameter(searchParams, "utm_campaign");
  const content = readSingleParameter(searchParams, "utm_content");

  if (
    source !== TOOL_SHARE_CAMPAIGN.campaign_source ||
    medium !== TOOL_SHARE_CAMPAIGN.campaign_medium ||
    campaign !== TOOL_SHARE_CAMPAIGN.campaign_name ||
    !SHAREABLE_TOOL_SLUGS.has(content)
  ) {
    return {};
  }

  return {
    ...TOOL_SHARE_CAMPAIGN,
    campaign_content: content,
  };
}

export function buildAnalyticsPageContext(location) {
  const origin = location?.origin;
  const pathname = location?.pathname;

  if (typeof origin !== "string" || typeof pathname !== "string") return null;
  if (!pathname.startsWith("/") || pathname.includes("?") || pathname.includes("#")) {
    return null;
  }

  try {
    const parsedOrigin = new URL(origin);
    if (
      (parsedOrigin.protocol !== "https:" && parsedOrigin.protocol !== "http:") ||
      parsedOrigin.origin !== origin
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return {
    page_path: pathname,
    page_location: `${origin}${pathname}`,
    page_referrer: "",
  };
}

export function buildInitialAnalyticsConfig(location) {
  const pageContext = buildAnalyticsPageContext(location);
  if (!pageContext) return null;

  return {
    ...pageContext,
    ...buildSafeToolShareCampaign(location?.search),
  };
}

export function recordSanitizedPageView({
  location,
  analyticsAllowed,
  gtag,
}) {
  if (!analyticsAllowed || typeof gtag !== "function") return false;

  const pageContext = buildAnalyticsPageContext(location);
  if (!pageContext) return false;

  gtag("config", GOOGLE_MEASUREMENT_ID, {
    ...pageContext,
    ignore_referrer: true,
    send_page_view: false,
    update: true,
  });
  gtag("event", "page_view", pageContext);
  return true;
}
