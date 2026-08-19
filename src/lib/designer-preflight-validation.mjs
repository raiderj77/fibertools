export const PREFLIGHT_TERMINOLOGY = ["us", "uk", "mixed", "unsure"];
export const PREFLIGHT_SKILL_LEVELS = ["beginner", "intermediate", "advanced", "all-levels"];
export const PREFLIGHT_PATTERN_TYPES = [
  "amigurumi",
  "accessory",
  "garment",
  "home-decor",
  "blanket",
  "other",
];

const SHARE_HOSTS = new Set([
  "drive.google.com",
  "docs.google.com",
  "dropbox.com",
  "www.dropbox.com",
  "1drv.ms",
  "onedrive.live.com",
]);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasFilePayload(value) {
  return ["file", "files", "patternFile", "fileName", "mimeType", "fileContent"].some(
    (key) => Object.prototype.hasOwnProperty.call(value, key)
  );
}

export function isAllowedSecureShareUrl(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      SHARE_HOSTS.has(url.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
}

/**
 * Validate and normalize the public no-account submission payload.
 * The MVP accepts links only; uploaded files and file metadata are rejected.
 */
export function validatePreflightSubmission(value) {
  const errors = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { success: false, errors: { form: "Enter the required submission details." } };
  }

  if (hasFilePayload(value)) {
    errors.secureShareUrl = "File uploads are not accepted in this pilot. Use a supported private share link.";
  }

  const requestId = text(value.requestId);
  const name = text(value.name);
  const email = text(value.email).toLowerCase();
  const patternTitle = text(value.patternTitle);
  const terminology = text(value.terminology);
  const skillLevel = text(value.skillLevel);
  const patternType = text(value.patternType);
  const comments = text(value.comments);
  const secureShareUrl = text(value.secureShareUrl);
  const website = text(value.website);

  if (!UUID_PATTERN.test(requestId)) errors.requestId = "Start a fresh submission and try again.";
  if (name.length < 2 || name.length > 100) errors.name = "Enter your name using 2 to 100 characters.";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (patternTitle.length < 2 || patternTitle.length > 160) {
    errors.patternTitle = "Enter a pattern title using 2 to 160 characters.";
  }
  if (!PREFLIGHT_TERMINOLOGY.includes(terminology)) errors.terminology = "Choose the pattern terminology.";
  if (!PREFLIGHT_SKILL_LEVELS.includes(skillLevel)) errors.skillLevel = "Choose the intended skill level.";
  if (!PREFLIGHT_PATTERN_TYPES.includes(patternType)) errors.patternType = "Choose a pattern type.";
  if (comments.length > 1000) errors.comments = "Keep comments to 1,000 characters or fewer.";
  if (!isAllowedSecureShareUrl(secureShareUrl)) {
    errors.secureShareUrl = "Use an HTTPS Google Drive, Dropbox, or OneDrive share link.";
  }
  if (value.scopeAgreed !== true) errors.scopeAgreed = "Agree to the pilot scope and privacy policy.";
  if (website) errors.form = "This submission could not be accepted.";

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      requestId,
      name,
      email,
      patternTitle,
      terminology,
      skillLevel,
      patternType,
      comments: comments || null,
      secureShareUrl,
      scopeAgreed: true,
    },
  };
}
