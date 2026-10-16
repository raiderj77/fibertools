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

const MYCROCHETKIT_CAMPAIGN = Object.freeze({
  campaign_source: "mycrochetkit",
  campaign_medium: "referral",
  campaign_name: "planner_to_calculator",
});

const MYCROCHETKIT_PLACEMENTS = new Set([
  "about_body",
  "about_footer",
  "about_nav",
  "companion_card",
  "footer",
  "hero",
  "materials_gauge",
  "materials_hook",
  "materials_yarn",
  "primary_nav",
  "privacy_footer",
  "privacy_nav",
  "progress_blanket",
  "progress_counter",
]);

function readSingleParameter(searchParams, name) {
  const values = searchParams.getAll(name);
  return values.length === 1 ? values[0] : null;
}

export function buildSafeCampaignAttribution(search) {
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

  const contracts = [
    [TOOL_SHARE_CAMPAIGN, SHAREABLE_TOOL_SLUGS],
    [MYCROCHETKIT_CAMPAIGN, MYCROCHETKIT_PLACEMENTS],
  ];

  for (const [contract, allowedContent] of contracts) {
    if (
      source === contract.campaign_source &&
      medium === contract.campaign_medium &&
      campaign === contract.campaign_name &&
      allowedContent.has(content)
    ) {
      return {
        ...contract,
        campaign_content: content,
      };
    }
  }

  return {};
}

export function buildSafeToolShareCampaign(search) {
  return buildSafeCampaignAttribution(search);
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
    ...buildSafeCampaignAttribution(location?.search),
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
