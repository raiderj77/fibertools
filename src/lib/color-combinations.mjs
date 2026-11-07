export const COLOR_COMBINATION_LIMITS = Object.freeze({
  minColors: 3,
  maxColors: 5,
});

export const COLOR_COMBINATION_MODES = Object.freeze({
  standard: {
    label: "Standard",
    bestFor: "Gifts, baby items, and first projects",
    notFor: "A deliberately dramatic statement piece",
    description: "Nearby colors plus one clear contrast. Calm, familiar, and hard to get wrong.",
  },
  mixed: {
    label: "Mixed",
    bestFor: "Blankets, granny squares, and striped projects",
    notFor: "A project where one color must quietly do all the work",
    description: "A balanced spread around the color wheel, with one small accent to keep it lively.",
  },
  wild: {
    label: "Wild",
    bestFor: "Statement blankets, festivals, kids' favorites, and bold stripes",
    notFor: "Subtle garments or low-contrast colorwork",
    description: "Strong opposites and a bright spark. The shares matter: a little wild goes a long way.",
  },
  soft: {
    label: "Soft",
    bestFor: "Baby projects, light garments, and gentle home pieces",
    notFor: "Fine motifs that need strong value contrast",
    description: "Paler, quieter versions of the color family, lifted with a clean neutral.",
  },
  earthy: {
    label: "Earthy",
    bestFor: "Wearable neutrals, rustic blankets, and quilts",
    notFor: "Neon or candy-bright color stories",
    description: "Muted clay, olive, slate, and warm neutral territory anchored by your main color.",
  },
  monochrome: {
    label: "Monochrome",
    bestFor: "Ombre blankets, tonal garments, and texture-first stitches",
    notFor: "Motifs that must pop by hue",
    description: "One hue in several depths. Texture and value do the talking.",
  },
});

export const COLOR_COMBINATION_PROJECTS = Object.freeze({
  blanket: "Blanket or throw",
  garment: "Garment",
  baby: "Baby item",
  "granny-squares": "Granny squares",
  quilt: "Quilt",
  amigurumi: "Amigurumi",
});

export const COLOR_COMBINATION_YARN_FORMS = Object.freeze({
  solids: "Mostly solid colors",
  "one-variegated": "One variegated yarn",
  "several-variegated": "Several variegated yarns",
});

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const ROLE_SHARES = Object.freeze({
  3: Object.freeze([60, 30, 10]),
  4: Object.freeze([50, 22, 10, 18]),
  5: Object.freeze([42, 20, 14, 8, 16]),
});
const ROLE_NAMES = Object.freeze({
  3: Object.freeze(["Main", "Support", "Accent"]),
  4: Object.freeze(["Main", "Support", "Accent", "Neutral"]),
  5: Object.freeze(["Main", "Support", "Partner", "Accent", "Neutral"]),
});

function invalid(error) {
  return { ok: false, error };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHue(hue) {
  return ((hue % 360) + 360) % 360;
}

export function hexToRgb(hex) {
  if (typeof hex !== "string" || !HEX_COLOR.test(hex)) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function rgbToHsl({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) return { h: 0, s: 0, l: lightness };

  const saturation = lightness > 0.5
    ? delta / (2 - max - min)
    : delta / (max + min);
  let hue;
  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;

  return { h: hue * 60, s: saturation, l: lightness };
}

export function hslToHex({ h, s, l }) {
  const hue = normalizeHue(h) / 360;
  const saturation = clamp(s, 0, 1);
  const lightness = clamp(l, 0, 1);
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue * 6) % 2) - 1));
  const match = lightness - chroma / 2;
  let rgb;

  if (hue < 1 / 6) rgb = [chroma, x, 0];
  else if (hue < 2 / 6) rgb = [x, chroma, 0];
  else if (hue < 3 / 6) rgb = [0, chroma, x];
  else if (hue < 4 / 6) rgb = [0, x, chroma];
  else if (hue < 5 / 6) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  const channel = (value) => Math.round((value + match) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
  return `#${rgb.map(channel).join("")}`;
}

function linearChannel(value) {
  const channel = value / 255;
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return (
    0.2126 * linearChannel(rgb.r) +
    0.7152 * linearChannel(rgb.g) +
    0.0722 * linearChannel(rgb.b)
  );
}

export function contrastRatio(firstHex, secondHex) {
  const first = relativeLuminance(firstHex);
  const second = relativeLuminance(secondHex);
  if (first === null || second === null) return null;
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function linearToSrgbChannel(linear) {
  const clamped = clamp(linear, 0, 1);
  const encoded =
    clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(encoded * 255);
}

function grayscaleHex(hex) {
  const luminance = relativeLuminance(hex);
  const gray = linearToSrgbChannel(luminance).toString(16).padStart(2, "0").toUpperCase();
  return `#${gray}${gray}${gray}`;
}

function valueLabel(luminance) {
  if (luminance >= 0.55) return "Light";
  if (luminance >= 0.18) return "Medium";
  return "Dark";
}

export function describeColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "Unknown color";
  const { h, s, l } = rgbToHsl(rgb);

  if (s < 0.16) {
    if (l < 0.08) return "Black";
    if (l > 0.93) return "White";
    if (l > 0.8) return "Cream";
    if (l > 0.55) return "Silver Gray";
    if (l > 0.3) return "Gray";
    return "Charcoal";
  }

  if (h >= 16 && h <= 44 && l <= 0.34) return "Brown";

  let family;
  if (h < 12 || h >= 345) family = "Red";
  else if (h < 34) family = "Orange";
  else if (h < 48) family = "Amber";
  else if (h < 62) family = "Yellow";
  else if (h < 88) family = "Chartreuse";
  else if (h < 158) family = "Green";
  else if (h < 188) family = "Teal";
  else if (h < 218) family = "Blue";
  else if (h < 252) family = "Indigo";
  else if (h < 288) family = "Purple";
  else if (h < 322) family = "Magenta";
  else family = "Pink";

  let prefix = "";
  if (l < 0.24) prefix = "Deep";
  else if (l > 0.82) prefix = "Pale";
  else if (s < 0.28) prefix = "Muted";
  else if (s > 0.78 && l >= 0.42 && l <= 0.68) prefix = "Bright";
  else if (l > 0.66) prefix = "Soft";

  return prefix ? `${prefix} ${family}` : family;
}

function shifted(base, { hue = base.h, hueShift = 0, saturation = base.s, lightness = base.l }) {
  return {
    h: normalizeHue(hue + hueShift),
    s: clamp(saturation, 0.03, 0.96),
    l: clamp(lightness, 0.08, 0.92),
  };
}

function awayLightness(base, amount = 0.16) {
  return base.l < 0.52 ? clamp(base.l + amount, 0.2, 0.88) : clamp(base.l - amount, 0.12, 0.8);
}

function roleHsl(base, mode, role) {
  switch (mode) {
    case "standard":
      if (role === "Support") return shifted(base, { hueShift: 32, saturation: base.s * 0.92, lightness: base.l < 0.5 ? base.l + 0.08 : base.l - 0.08 });
      if (role === "Partner") return shifted(base, { hueShift: -32, saturation: base.s * 0.88, lightness: awayLightness(base, 0.14) });
      if (role === "Accent") return shifted(base, { hueShift: 180, saturation: Math.max(base.s, 0.45), lightness: awayLightness(base, 0.12) });
      break;
    case "mixed":
      if (role === "Support") return shifted(base, { hueShift: 150, saturation: Math.max(base.s * 0.95, 0.35), lightness: awayLightness(base, 0.08) });
      if (role === "Partner") return shifted(base, { hueShift: 32, saturation: base.s * 0.9, lightness: awayLightness(base, 0.16) });
      if (role === "Accent") return shifted(base, { hueShift: 210, saturation: Math.max(base.s, 0.55), lightness: awayLightness(base, 0.2) });
      break;
    case "wild":
      if (role === "Support") return shifted(base, { hueShift: 180, saturation: Math.max(base.s, 0.74), lightness: base.l < 0.52 ? 0.58 : 0.36 });
      if (role === "Partner") return shifted(base, { hueShift: 120, saturation: Math.max(base.s, 0.78), lightness: base.l < 0.52 ? 0.66 : 0.3 });
      if (role === "Accent") return shifted(base, { hueShift: 285, saturation: Math.max(base.s, 0.82), lightness: base.l < 0.52 ? 0.7 : 0.34 });
      break;
    case "soft":
      if (role === "Support") return shifted(base, { hueShift: 28, saturation: Math.min(base.s, 0.46), lightness: clamp(base.l + 0.22, 0.68, 0.84) });
      if (role === "Partner") return shifted(base, { hueShift: -28, saturation: Math.min(base.s, 0.4), lightness: clamp(base.l + 0.3, 0.74, 0.88) });
      if (role === "Accent") return shifted(base, { hueShift: 180, saturation: Math.min(Math.max(base.s, 0.3), 0.56), lightness: clamp(base.l + 0.12, 0.58, 0.76) });
      break;
    case "earthy": {
      const supportHue = base.h >= 70 && base.h <= 150 ? 28 : 82;
      const partnerHue = supportHue === 28 ? 96 : 28;
      if (role === "Support") return shifted(base, { hue: supportHue, saturation: clamp(base.s, 0.24, 0.42), lightness: clamp(base.l, 0.32, 0.44) });
      if (role === "Partner") return shifted(base, { hue: partnerHue, saturation: 0.36, lightness: clamp(awayLightness(base, 0.14), 0.3, 0.52) });
      if (role === "Accent") return shifted(base, { hue: 208, saturation: 0.34, lightness: base.l < 0.5 ? 0.56 : 0.34 });
      break;
    }
    case "monochrome":
      if (role === "Support") return shifted(base, { saturation: clamp(base.s * 1.05, 0.05, 0.96), lightness: base.l < 0.5 ? base.l + 0.18 : base.l - 0.18 });
      if (role === "Partner") return shifted(base, { saturation: base.s * 0.92, lightness: base.l < 0.5 ? base.l + 0.34 : base.l - 0.34 });
      if (role === "Accent") return shifted(base, { saturation: base.s < 0.08 ? base.s : Math.max(base.s, 0.5), lightness: base.l < 0.5 ? clamp(base.l + 0.48, 0.55, 0.9) : clamp(base.l - 0.48, 0.1, 0.45) });
      break;
    default:
      break;
  }
  return { ...base };
}

function neutralHsl(base) {
  const warmHue = base.s < 0.08 ? 36 : base.h;
  if (base.l < 0.42) return { h: warmHue, s: 0.14, l: 0.88 };
  if (base.l > 0.68) return { h: warmHue, s: 0.16, l: 0.2 };
  return { h: warmHue, s: 0.12, l: 0.88 };
}

function ensureDistinct(colors) {
  const seen = new Set();
  return colors.map((color, index) => {
    let candidate = { ...color };
    let attempts = 0;
    while (seen.has(hslToHex(candidate)) && attempts < 6) {
      candidate = {
        ...candidate,
        l: clamp(candidate.l + (attempts % 2 === 0 ? 0.07 : -0.09), 0.06, 0.94),
        s: clamp(candidate.s + (index % 2 === 0 ? 0.03 : -0.02), 0.03, 0.96),
      };
      attempts += 1;
    }
    const hex = hslToHex(candidate);
    seen.add(hex);
    return candidate;
  });
}

function largestRemainderCounts(shares, totalBlocks) {
  const raw = shares.map((share) => (share / 100) * totalBlocks);
  const counts = raw.map((value) => Math.floor(value));
  let remaining = totalBlocks - counts.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (let i = 0; remaining > 0; i = (i + 1) % order.length) {
    counts[order[i].index] += 1;
    remaining -= 1;
  }
  return counts;
}

const PROJECT_GUIDANCE = Object.freeze({
  blanket: "For a blanket, repeat the main color in the border or final rounds so the palette feels gathered rather than scattered.",
  garment: "For a garment, put the neutral or support color in the largest plain areas if the main color feels strong against skin.",
  baby: "For a baby item, soft does not have to mean invisible. Check the grayscale strip before using two colors together in a motif.",
  "granny-squares": "For granny squares, use the neutral as the joining color when you want separate squares to read as one finished piece.",
  quilt: "For a quilt, treat the neutral as the background first, then check whether the main and support colors still separate at a distance.",
  amigurumi: "For amigurumi, check eyes, mouths, and other small details against the main color separately. Small features need stronger contrast than large body sections.",
});

const YARN_FORM_GUIDANCE = Object.freeze({
  solids: "With mostly solids, the shares are easy to control. Work a small striped or motif swatch before committing the full project.",
  "one-variegated": "With one variegated yarn, let it supply the movement and pull its companion solids from colors already visible in that yarn.",
  "several-variegated": "With several variegated yarns, choose one to lead and use solids between the others. Several busy yarns at equal shares usually blur the scheme.",
});

/**
 * Build a deterministic palette from one main color.
 *
 * @param {{ baseColor: string, mode?: string, project?: string, colorCount?: number, yarnForm?: string }} input
 * @returns {{ ok: false, error: string } | { ok: true, mode: string, modeLabel: string, modeDescription: string, bestFor: string, notFor: string, project: string, projectLabel: string, yarnForm: string, yarnFormLabel: string, palette: Array<{ role: string, hex: string, name: string, sharePercent: number, hsl: { h: number, s: number, l: number }, luminance: number, valueLabel: string, grayscaleHex: string, contrastWithMain: number }>, lowContrastPairs: Array<{ firstRole: string, secondRole: string, ratio: number, message: string }>, stripeSequence: Array<{ role: string, hex: string, blocks: number }>, projectGuidance: string, yarnGuidance: string, avoid: string[] }}
 */
export function buildColorCombination({
  baseColor,
  mode = "standard",
  project = "blanket",
  colorCount = 4,
  yarnForm = "solids",
} = {}) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return invalid("Choose a main color using the color field or one of the preset swatches.");
  if (!Object.hasOwn(COLOR_COMBINATION_MODES, mode)) return invalid("Choose Standard, Mixed, Wild, Soft, Earthy, or Monochrome.");
  if (!Object.hasOwn(COLOR_COMBINATION_PROJECTS, project)) return invalid("Choose a supported project type.");
  if (!Object.hasOwn(COLOR_COMBINATION_YARN_FORMS, yarnForm)) return invalid("Choose how many variegated yarns you plan to use.");
  if (
    !Number.isSafeInteger(colorCount) ||
    colorCount < COLOR_COMBINATION_LIMITS.minColors ||
    colorCount > COLOR_COMBINATION_LIMITS.maxColors
  ) {
    return invalid(`Choose ${COLOR_COMBINATION_LIMITS.minColors} to ${COLOR_COMBINATION_LIMITS.maxColors} colors.`);
  }

  const base = rgbToHsl(rgb);
  const roles = ROLE_NAMES[colorCount];
  const shares = ROLE_SHARES[colorCount];
  const hslColors = roles.map((role) => {
    if (role === "Main") return { ...base };
    if (role === "Neutral") return neutralHsl(base);
    return roleHsl(base, mode, role);
  });
  const distinctHsl = ensureDistinct(hslColors);
  const mainHex = hslToHex(distinctHsl[0]);

  const palette = distinctHsl.map((hsl, index) => {
    const hex = hslToHex(hsl);
    const luminance = relativeLuminance(hex);
    return {
      role: roles[index],
      hex,
      name: describeColor(hex),
      sharePercent: shares[index],
      hsl: {
        h: Math.round(normalizeHue(hsl.h)),
        s: Math.round(clamp(hsl.s, 0, 1) * 100),
        l: Math.round(clamp(hsl.l, 0, 1) * 100),
      },
      luminance: Number(luminance.toFixed(4)),
      valueLabel: valueLabel(luminance),
      grayscaleHex: grayscaleHex(hex),
      contrastWithMain: Number(contrastRatio(hex, mainHex).toFixed(2)),
    };
  });

  const lowContrastPairs = [];
  for (let i = 0; i < palette.length; i += 1) {
    for (let j = i + 1; j < palette.length; j += 1) {
      const ratio = contrastRatio(palette[i].hex, palette[j].hex);
      if (ratio < 1.3) {
        lowContrastPairs.push({
          firstRole: palette[i].role,
          secondRole: palette[j].role,
          ratio: Number(ratio.toFixed(2)),
          message: `${palette[i].role} and ${palette[j].role} have low value contrast (${ratio.toFixed(2)}:1). They may blend in fine stripes or motifs.`,
        });
      }
    }
  }

  const stripeCounts = largestRemainderCounts(shares, 20);
  const stripeSequence = palette.map((color, index) => ({
    role: color.role,
    hex: color.hex,
    blocks: stripeCounts[index],
  }));

  const avoid = [
    "Avoid giving the accent the same visual weight as the main color. Its smaller share is what makes it read as an accent.",
  ];
  if (lowContrastPairs.length > 0) {
    avoid.push("Avoid placing a low-contrast pair side by side in small motifs until a swatch proves they stay separate.");
  }
  if (mode === "wild") {
    avoid.push("Avoid adding another saturated color at full strength. Wild palettes need one or two quieter places for the eye to rest.");
  }
  if (mode === "soft") {
    avoid.push("Avoid judging soft colors by hue alone. Their values can be close even when the colors look different on the skein.");
  }
  if (yarnForm === "several-variegated") {
    avoid.push("Avoid using several variegated yarns in equal shares. Pick one lead yarn and separate the rest with solids.");
  }

  return {
    ok: true,
    mode,
    modeLabel: COLOR_COMBINATION_MODES[mode].label,
    modeDescription: COLOR_COMBINATION_MODES[mode].description,
    bestFor: COLOR_COMBINATION_MODES[mode].bestFor,
    notFor: COLOR_COMBINATION_MODES[mode].notFor,
    project,
    projectLabel: COLOR_COMBINATION_PROJECTS[project],
    yarnForm,
    yarnFormLabel: COLOR_COMBINATION_YARN_FORMS[yarnForm],
    palette,
    lowContrastPairs,
    stripeSequence,
    projectGuidance: PROJECT_GUIDANCE[project],
    yarnGuidance: YARN_FORM_GUIDANCE[yarnForm],
    avoid,
  };
}

/**
 * @param {{ baseColor: string, mode?: string, project?: string, colorCount?: number, yarnForm?: string }} state
 * @returns {string} query string without a leading question mark, or "" when any value is unsupported
 */
export function buildPaletteShareQuery({
  baseColor,
  mode = "standard",
  project = "blanket",
  colorCount = 4,
  yarnForm = "solids",
} = {}) {
  if (!hexToRgb(baseColor)) return "";
  if (!Object.hasOwn(COLOR_COMBINATION_MODES, mode)) return "";
  if (!Object.hasOwn(COLOR_COMBINATION_PROJECTS, project)) return "";
  if (!Object.hasOwn(COLOR_COMBINATION_YARN_FORMS, yarnForm)) return "";
  if (
    !Number.isSafeInteger(colorCount) ||
    colorCount < COLOR_COMBINATION_LIMITS.minColors ||
    colorCount > COLOR_COMBINATION_LIMITS.maxColors
  ) {
    return "";
  }
  return new URLSearchParams({
    c: baseColor.slice(1).toUpperCase(),
    m: mode,
    p: project,
    n: String(colorCount),
    y: yarnForm,
  }).toString();
}

/**
 * @param {string} search a query string, with or without the leading "?"
 * @returns {{ baseColor?: string, mode?: string, project?: string, colorCount?: number, yarnForm?: string }} only the fields that hold supported values
 */
export function parsePaletteShareQuery(search) {
  const state = {};
  if (typeof search !== "string" || search.length === 0) return state;
  let params;
  try {
    params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  } catch {
    return state;
  }
  const color = params.get("c");
  if (color) {
    const candidate = (color.startsWith("#") ? color : `#${color}`).toUpperCase();
    if (hexToRgb(candidate)) state.baseColor = candidate;
  }
  const mode = params.get("m");
  if (mode && Object.hasOwn(COLOR_COMBINATION_MODES, mode)) state.mode = mode;
  const project = params.get("p");
  if (project && Object.hasOwn(COLOR_COMBINATION_PROJECTS, project)) state.project = project;
  const yarnForm = params.get("y");
  if (yarnForm && Object.hasOwn(COLOR_COMBINATION_YARN_FORMS, yarnForm)) state.yarnForm = yarnForm;
  const count = Number(params.get("n"));
  if (
    Number.isSafeInteger(count) &&
    count >= COLOR_COMBINATION_LIMITS.minColors &&
    count <= COLOR_COMBINATION_LIMITS.maxColors
  ) {
    state.colorCount = count;
  }
  return state;
}
