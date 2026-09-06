/** @type {ReadonlyArray<"dmc" | "anchor" | "cosmo">} */
export const THREAD_BRANDS = Object.freeze(["dmc", "anchor", "cosmo"]);
export const THREAD_BATCH_LIMITS = Object.freeze({
  maximumCharacters: 1000,
  maximumCodes: 100,
  maximumCodeLength: 20,
  maximumSearchLength: 100,
});
export const THREAD_REFERENCE_METADATA = Object.freeze({
  version: "anchor-archived-chart-reviewed-2026-09-05",
  provenance: "Anchor Stranded Cotton Art. 4635000 conversion chart, archived manufacturer publication mirrored by Quilters Store; current shade availability is not verified",
  sourceUrl: "https://www.quiltersstore.com.au/userfiles/files/ConversionChart_Stranded_Cotton_finalversion.pdf",
  sourceVerified: true,
  manufacturerVerified: false,
});

/** @typedef {{ dmc: string, anchor: string, cosmo: string, hex: string, name: string }} ThreadEntry */
/**
 * @typedef {
 *   | { status: "invalid", message: string }
 *   | { status: "unknown", code: string }
 *   | { status: "found", code: string, entry: ThreadEntry }
 *   | { status: "ambiguous", code: string, matches: ThreadEntry[] }
 * } ThreadLookup
 */
/** @typedef {{ input: string, lookup: ThreadLookup }} ThreadBatchItem */
/**
 * @typedef {
 *   | { status: "invalid", message: string }
 *   | { status: "empty", results: [] }
 *   | { status: "ready", sourceBrand: "dmc" | "anchor" | "cosmo", results: ThreadBatchItem[] }
 * } ThreadBatchResult
 */

/** @type {ReadonlyArray<ThreadEntry>} */
// The legacy cross-brand rows had no traceable source. Do not expose them as conversions.
// Add rows only with reviewed primary-source provenance for each brand mapping.
export const THREAD_CONVERSION_TABLE = Object.freeze([
  {"dmc":"310","anchor":"403","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"317","anchor":"400","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"413","anchor":"400","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"318","anchor":"399","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"319","anchor":"218","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"320","anchor":"215","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"321","anchor":"47","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"327","anchor":"100","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"333","anchor":"110","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"336","anchor":"149","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"347","anchor":"1025","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"353","anchor":"1012","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"355","anchor":"1014","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"372","anchor":"853","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"378","anchor":"366","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"400","anchor":"351","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"407","anchor":"1008","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"414","anchor":"235","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"415","anchor":"398","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
  {"dmc":"435","anchor":"365","cosmo":"","hex":"","name":"Archived Anchor chart pairing"},
].map(Object.freeze));

/** @param {unknown} value @returns {value is "dmc" | "anchor" | "cosmo"} */
function isThreadBrand(value) {
  return value === "dmc" || value === "anchor" || value === "cosmo";
}

function normalizeCode(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const code = String(value).trim().toLowerCase();
  if (!code || code.length > THREAD_BATCH_LIMITS.maximumCodeLength) return null;
  return code;
}

/**
 * Exact code lookup only. Multiple rows are returned as ambiguous rather than
 * selecting an inferred or nearest-color conversion.
 *
 * @param {unknown} brand
 * @param {unknown} code
 * @returns {ThreadLookup}
 */
export function lookupThreadCode(brand, code) {
  if (!isThreadBrand(brand)) {
    return { status: "invalid", message: "Choose DMC, Anchor, or Cosmo as the source brand." };
  }
  const normalizedCode = normalizeCode(code);
  if (!normalizedCode) {
    return { status: "invalid", message: "Enter a thread code up to 20 characters." };
  }

  const matches = THREAD_CONVERSION_TABLE.filter((entry) => entry[brand].toLowerCase() === normalizedCode);
  if (matches.length === 0) return { status: "unknown", code: normalizedCode };
  if (matches.length === 1) return { status: "found", code: normalizedCode, entry: matches[0] };
  return { status: "ambiguous", code: normalizedCode, matches };
}

/**
 * Partial browse search across only the rows included in this table. Returned
 * rows are table entries, never computed nearest colors.
 *
 * @param {unknown} query
 * @param {unknown} brand
 * @param {number} [limit]
 * @returns {ThreadEntry[]}
 */
export function searchThreadTable(query, brand = "any", limit = 30) {
  if (typeof query !== "string" || query.trim() === "") return [];
  if (brand !== "any" && !isThreadBrand(brand)) return [];
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) return [];

  const normalizedQuery = query.trim().toLowerCase().slice(0, THREAD_BATCH_LIMITS.maximumSearchLength);
  const results = [];
  for (const entry of THREAD_CONVERSION_TABLE) {
    const matches = brand === "any"
      ? entry.dmc.toLowerCase().includes(normalizedQuery)
        || entry.anchor.toLowerCase().includes(normalizedQuery)
        || entry.cosmo.toLowerCase().includes(normalizedQuery)
        || entry.name.toLowerCase().includes(normalizedQuery)
      : entry[brand].toLowerCase().includes(normalizedQuery);
    if (matches) results.push(entry);
    if (results.length === limit) break;
  }
  return results;
}

/**
 * Convert a bounded list of exact source-brand codes. Unknown and ambiguous
 * inputs remain explicit results.
 *
 * @param {{ input: unknown, sourceBrand: unknown }} inputs
 * @returns {ThreadBatchResult}
 */
export function convertThreadBatch({ input, sourceBrand }) {
  if (!isThreadBrand(sourceBrand)) {
    return { status: "invalid", message: "Choose DMC, Anchor, or Cosmo as the source brand." };
  }
  if (typeof input !== "string") {
    return { status: "invalid", message: "Enter thread codes as text." };
  }
  if (input.trim() === "") return { status: "empty", results: [] };
  if (input.length > THREAD_BATCH_LIMITS.maximumCharacters) {
    return {
      status: "invalid",
      message: `Batch input is limited to ${THREAD_BATCH_LIMITS.maximumCharacters} characters.`,
    };
  }

  const codes = input.split(/[\s,;]+/).filter(Boolean);
  if (codes.length > THREAD_BATCH_LIMITS.maximumCodes) {
    return {
      status: "invalid",
      message: `Batch conversion is limited to ${THREAD_BATCH_LIMITS.maximumCodes} codes at a time.`,
    };
  }

  const results = codes.map((original) => ({
    input: original,
    lookup: lookupThreadCode(sourceBrand, original),
  }));
  return { status: "ready", sourceBrand, results };
}
