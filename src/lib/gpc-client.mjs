export const GPC_COOKIE_NAME = "empire_gpc";

export function hasGPCConsentCookie(cookieString) {
  return cookieString.split(";").some((part) => {
    const [name, ...valueParts] = part.trim().split("=");
    return name === GPC_COOKIE_NAME && valueParts.join("=") === "1";
  });
}

export function detectGPCClient(options = {}) {
  const navigatorObject =
    options.navigatorObject === undefined
      ? typeof navigator === "undefined"
        ? null
        : navigator
      : options.navigatorObject;
  const cookieString =
    options.cookieString === undefined
      ? typeof document === "undefined"
        ? ""
        : document.cookie
      : options.cookieString;

  return (
    navigatorObject?.globalPrivacyControl === true ||
    hasGPCConsentCookie(cookieString)
  );
}
