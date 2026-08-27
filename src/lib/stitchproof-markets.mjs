/** Owner-approved sales scope, not a tax category or proof of buyer location. */
export const STITCHPROOF_MARKET_POLICY_VERSION = "STITCHPROOF-MARKETS-2026-08-27";

export const STITCHPROOF_MARKETS = Object.freeze([
  ["US", "United States"], ["CA", "Canada"], ["GB", "United Kingdom"],
  ["AU", "Australia"], ["NZ", "New Zealand"],
  ["AT", "Austria"], ["BE", "Belgium"], ["DK", "Denmark"], ["FI", "Finland"],
  ["FR", "France"], ["DE", "Germany"], ["IS", "Iceland"], ["IE", "Ireland"],
  ["IT", "Italy"], ["LU", "Luxembourg"], ["NL", "Netherlands"], ["NO", "Norway"],
  ["PT", "Portugal"], ["ES", "Spain"], ["SE", "Sweden"], ["CH", "Switzerland"],
  ["JP", "Japan"], ["SG", "Singapore"], ["KR", "South Korea"],
].map(([code, name]) => Object.freeze({ code, name })));

const countries = new Set(STITCHPROOF_MARKETS.map(({ code }) => code));

/** No locale/IP inference or coercion: this is an explicit checkout choice. */
export function isStitchProofPurchaseCountry(value) {
  return typeof value === "string" && countries.has(value);
}
