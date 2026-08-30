/** @type {ReadonlyArray<"dmc" | "anchor" | "cosmo">} */
export const THREAD_BRANDS = Object.freeze(["dmc", "anchor", "cosmo"]);
export const THREAD_BATCH_LIMITS = Object.freeze({
  maximumCharacters: 1000,
  maximumCodes: 100,
  maximumCodeLength: 20,
  maximumSearchLength: 100,
});
export const THREAD_REFERENCE_METADATA = Object.freeze({
  version: "fibertools-bundled-2026-08-29",
  provenance: "Legacy bundled table; original source not recorded",
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
export const THREAD_CONVERSION_TABLE = Object.freeze([
  { dmc: "blanc", anchor: "2", cosmo: "100", hex: "#FFFFFF", name: "White" },
  { dmc: "ecru", anchor: "387", cosmo: "371", hex: "#F0E6D0", name: "Ecru" },
  { dmc: "310", anchor: "403", cosmo: "600", hex: "#000000", name: "Black" },
  { dmc: "b5200", anchor: "1", cosmo: "100", hex: "#FFFFFF", name: "Snow White" },
  { dmc: "321", anchor: "9046", cosmo: "346", hex: "#C91737", name: "Red" },
  { dmc: "304", anchor: "47", cosmo: "345", hex: "#AA1831", name: "Med Red" },
  { dmc: "498", anchor: "20", cosmo: "241", hex: "#871624", name: "Dk Red" },
  { dmc: "816", anchor: "44", cosmo: "243", hex: "#97132B", name: "Garnet" },
  { dmc: "666", anchor: "46", cosmo: "346A", hex: "#E31D42", name: "Bright Red" },
  { dmc: "815", anchor: "43", cosmo: "244", hex: "#7B1026", name: "Dk Garnet" },
  { dmc: "349", anchor: "13", cosmo: "346B", hex: "#D21035", name: "Dk Coral" },
  { dmc: "350", anchor: "11", cosmo: "347", hex: "#E04848", name: "Med Coral" },
  { dmc: "351", anchor: "10", cosmo: "348", hex: "#E96A67", name: "Coral" },
  { dmc: "352", anchor: "9", cosmo: "349", hex: "#F08E7F", name: "Lt Coral" },
  { dmc: "353", anchor: "8", cosmo: "350", hex: "#F8B0A0", name: "Peach" },
  { dmc: "817", anchor: "19", cosmo: "340", hex: "#BB0B25", name: "V Dk Coral Red" },
  { dmc: "3685", anchor: "69", cosmo: "234", hex: "#881533", name: "V Dk Mauve" },
  { dmc: "3687", anchor: "68", cosmo: "232", hex: "#C9546C", name: "Mauve" },
  { dmc: "3688", anchor: "66", cosmo: "231", hex: "#E18DA5", name: "Med Mauve" },
  { dmc: "3689", anchor: "49", cosmo: "230", hex: "#F0B8CA", name: "Lt Mauve" },
  { dmc: "718", anchor: "88", cosmo: "2284", hex: "#C62A72", name: "Plum" },
  { dmc: "553", anchor: "98", cosmo: "285", hex: "#9E5EB3", name: "Violet" },
  { dmc: "554", anchor: "96", cosmo: "284", hex: "#BE94D0", name: "Lt Violet" },
  { dmc: "550", anchor: "102", cosmo: "287", hex: "#5C2469", name: "V Dk Violet" },
  { dmc: "333", anchor: "119", cosmo: "286", hex: "#7A3B8F", name: "V Dk Blue Violet" },
  { dmc: "791", anchor: "178", cosmo: "665", hex: "#354788", name: "V Dk Cornflower Blue" },
  { dmc: "792", anchor: "177", cosmo: "664", hex: "#4E6BA7", name: "Dk Cornflower Blue" },
  { dmc: "793", anchor: "176", cosmo: "663", hex: "#7A96C4", name: "Med Cornflower Blue" },
  { dmc: "794", anchor: "175", cosmo: "662", hex: "#A8BFE0", name: "Lt Cornflower Blue" },
  { dmc: "796", anchor: "133", cosmo: "654", hex: "#0A2E7A", name: "Dk Royal Blue" },
  { dmc: "797", anchor: "132", cosmo: "653", hex: "#1D3D8F", name: "Royal Blue" },
  { dmc: "798", anchor: "131", cosmo: "652", hex: "#3B5EAB", name: "Dk Delft Blue" },
  { dmc: "799", anchor: "130", cosmo: "651", hex: "#6F8BC8", name: "Med Delft Blue" },
  { dmc: "800", anchor: "128", cosmo: "650", hex: "#C0D4EF", name: "Pale Delft Blue" },
  { dmc: "995", anchor: "410", cosmo: "730", hex: "#00A3D9", name: "Dk Electric Blue" },
  { dmc: "996", anchor: "433", cosmo: "731", hex: "#36C3E8", name: "Med Electric Blue" },
  { dmc: "699", anchor: "923", cosmo: "920", hex: "#0A6B2E", name: "Green" },
  { dmc: "700", anchor: "228", cosmo: "921", hex: "#0C7A34", name: "Bright Green" },
  { dmc: "701", anchor: "227", cosmo: "922", hex: "#3A9B57", name: "Lt Green" },
  { dmc: "702", anchor: "226", cosmo: "923", hex: "#56AD6A", name: "Kelly Green" },
  { dmc: "703", anchor: "238", cosmo: "924", hex: "#72BE7E", name: "Chartreuse" },
  { dmc: "704", anchor: "237", cosmo: "925", hex: "#92D18B", name: "Bright Chartreuse" },
  { dmc: "986", anchor: "246", cosmo: "840", hex: "#365D2B", name: "V Dk Forest Green" },
  { dmc: "987", anchor: "244", cosmo: "841", hex: "#4D7B39", name: "Dk Forest Green" },
  { dmc: "988", anchor: "243", cosmo: "842", hex: "#669B4A", name: "Med Forest Green" },
  { dmc: "989", anchor: "242", cosmo: "843", hex: "#7FB85C", name: "Forest Green" },
  { dmc: "720", anchor: "326", cosmo: "444", hex: "#C95017", name: "Dk Orange Spice" },
  { dmc: "721", anchor: "324", cosmo: "443", hex: "#E06E2C", name: "Med Orange Spice" },
  { dmc: "722", anchor: "323", cosmo: "442", hex: "#F09848", name: "Lt Orange Spice" },
  { dmc: "740", anchor: "316", cosmo: "450", hex: "#FF8400", name: "Tangerine" },
  { dmc: "741", anchor: "304", cosmo: "451", hex: "#FFA016", name: "Med Tangerine" },
  { dmc: "742", anchor: "303", cosmo: "452", hex: "#FFC14E", name: "Lt Tangerine" },
  { dmc: "743", anchor: "302", cosmo: "700", hex: "#FFD56C", name: "Med Yellow" },
  { dmc: "744", anchor: "301", cosmo: "701", hex: "#FFE38A", name: "Pale Yellow" },
  { dmc: "745", anchor: "300", cosmo: "702", hex: "#FFF0AA", name: "Lt Pale Yellow" },
  { dmc: "307", anchor: "289", cosmo: "703", hex: "#FFE521", name: "Lemon" },
  { dmc: "444", anchor: "290", cosmo: "704", hex: "#FFD300", name: "Dk Lemon" },
  { dmc: "729", anchor: "890", cosmo: "576", hex: "#C5A243", name: "Med Old Gold" },
  { dmc: "680", anchor: "901", cosmo: "575", hex: "#9A7B24", name: "Dk Old Gold" },
  { dmc: "676", anchor: "891", cosmo: "577", hex: "#DEC065", name: "Lt Old Gold" },
  { dmc: "677", anchor: "886", cosmo: "578", hex: "#F0DCA0", name: "V Lt Old Gold" },
  { dmc: "780", anchor: "309", cosmo: "570", hex: "#8B6914", name: "V Dk Topaz" },
  { dmc: "781", anchor: "308", cosmo: "571", hex: "#A37D1B", name: "Dk Topaz" },
  { dmc: "782", anchor: "307", cosmo: "572", hex: "#BB9329", name: "Med Topaz" },
  { dmc: "783", anchor: "306", cosmo: "573", hex: "#CCA93E", name: "Med Topaz" },
  { dmc: "434", anchor: "310", cosmo: "465", hex: "#8B5E2F", name: "Lt Brown" },
  { dmc: "435", anchor: "365", cosmo: "464", hex: "#9D6B37", name: "V Lt Brown" },
  { dmc: "436", anchor: "363", cosmo: "463", hex: "#BA8A4E", name: "Tan" },
  { dmc: "437", anchor: "362", cosmo: "462", hex: "#D0A76B", name: "Lt Tan" },
  { dmc: "838", anchor: "380", cosmo: "480", hex: "#3B2414", name: "V Dk Beige Brown" },
  { dmc: "839", anchor: "360", cosmo: "479", hex: "#4E3520", name: "Dk Beige Brown" },
  { dmc: "840", anchor: "379", cosmo: "478", hex: "#72563A", name: "Med Beige Brown" },
  { dmc: "841", anchor: "378", cosmo: "477", hex: "#9A8268", name: "Lt Beige Brown" },
  { dmc: "842", anchor: "376", cosmo: "476", hex: "#BCA88E", name: "V Lt Beige Brown" },
  { dmc: "318", anchor: "399", cosmo: "894", hex: "#8C8C8C", name: "Lt Steel Gray" },
  { dmc: "414", anchor: "400", cosmo: "895", hex: "#6E6E6E", name: "Dk Steel Gray" },
  { dmc: "317", anchor: "400", cosmo: "896", hex: "#575757", name: "Pewter Gray" },
  { dmc: "413", anchor: "401", cosmo: "897", hex: "#3C3C3C", name: "Dk Pewter Gray" },
  { dmc: "762", anchor: "397", cosmo: "893", hex: "#D5D5D5", name: "V Lt Pearl Gray" },
  { dmc: "415", anchor: "398", cosmo: "892", hex: "#B5B5B5", name: "Pearl Gray" },
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
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > THREAD_CONVERSION_TABLE.length) return [];

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
