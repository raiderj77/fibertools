// Extract the dominant colors from raw RGBA pixel data, for example the
// ImageData of a photo drawn to a canvas. Pure and deterministic so it can
// be unit tested outside the browser. The photo itself never leaves the
// visitor's device; this function only receives sampled pixels.

function channelToHex(value) {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

function rgbToHex({ r, g, b }) {
  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
}

function rgbDistance(first, second) {
  const dr = first.r - second.r;
  const dg = first.g - second.g;
  const db = first.b - second.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * @param {ArrayLike<number>} pixels RGBA pixel values, four numbers per pixel
 * @param {{ maxColors?: number, minDistance?: number }} [options]
 * @returns {{ ok: false, error: string } | { ok: true, colors: Array<{ hex: string, sharePercent: number }> }}
 */
export function extractPhotoPalette(pixels, { maxColors = 5, minDistance = 48 } = {}) {
  if (!pixels || typeof pixels.length !== "number" || pixels.length === 0 || pixels.length % 4 !== 0) {
    return { ok: false, error: "That photo could not be read. Try a JPG or PNG photo." };
  }
  if (!Number.isInteger(maxColors) || maxColors < 1 || maxColors > 8) {
    return { ok: false, error: "Choose between 1 and 8 photo colors." };
  }

  // Quantize to 5 bits per channel so near-identical pixels share a bucket,
  // then average the real pixel values inside each bucket for the result.
  const buckets = new Map();
  let sampled = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 125) continue;
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { count: 0, r: 0, g: 0, b: 0 };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    sampled += 1;
  }

  if (sampled === 0) {
    return { ok: false, error: "No visible colors were found in that photo." };
  }

  const ranked = [...buckets.values()]
    .map((bucket) => ({
      r: Math.round(bucket.r / bucket.count),
      g: Math.round(bucket.g / bucket.count),
      b: Math.round(bucket.b / bucket.count),
      count: bucket.count,
    }))
    .sort((first, second) => second.count - first.count);

  // Walk the buckets from most to least common. A bucket that is close to an
  // already-picked color merges into it: its pixels join the representative's
  // count (and pull its shade toward the family average), so the share shown
  // for that color covers the whole color family in the photo.
  const picked = [];
  const unassigned = [];
  for (const candidate of ranked) {
    const nearIndex = picked.findIndex((chosen) => rgbDistance(chosen, candidate) < minDistance);
    if (nearIndex >= 0) {
      const chosen = picked[nearIndex];
      const total = chosen.count + candidate.count;
      chosen.r = Math.round((chosen.r * chosen.count + candidate.r * candidate.count) / total);
      chosen.g = Math.round((chosen.g * chosen.count + candidate.g * candidate.count) / total);
      chosen.b = Math.round((chosen.b * chosen.count + candidate.b * candidate.count) / total);
      chosen.count = total;
    } else if (picked.length < maxColors) {
      picked.push({ ...candidate });
    } else {
      unassigned.push(candidate);
    }
  }
  // A photo with almost no distinct colors should still return what it has.
  if (picked.length < Math.min(2, ranked.length, maxColors)) {
    for (const candidate of unassigned) {
      if (picked.length >= Math.min(2, ranked.length, maxColors)) break;
      picked.push(candidate);
    }
  }

  return {
    ok: true,
    colors: picked.map((color) => ({
      hex: rgbToHex(color),
      sharePercent: Math.max(1, Math.round((color.count / sampled) * 100)),
    })),
  };
}
