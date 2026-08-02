export const GOOGLE_MEASUREMENT_ID = "G-T92LYDE8NN";

export const EXPECTED_GOOGLE_ADSENSE_CLIENT_ID = "ca-pub-7171402107622932";

export const GOOGLE_ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() || EXPECTED_GOOGLE_ADSENSE_CLIENT_ID;

const GOOGLE_POLICY_PATHS = ["/privacy", "/cookies", "/do-not-sell", "/terms"];

export function isGooglePolicyPath(pathname: string): boolean {
  return GOOGLE_POLICY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
