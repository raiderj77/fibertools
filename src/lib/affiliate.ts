export const AMAZON_ASSOCIATE_TAG = "ytearnings-20";

const AMAZON_ORIGIN = "https://www.amazon.com";

export function amazonSearchUrl(query: string): string {
  const params = new URLSearchParams({
    k: query,
    tag: AMAZON_ASSOCIATE_TAG,
  });

  return `${AMAZON_ORIGIN}/s?${params.toString()}`;
}

export function amazonProductUrl(asin: string): string {
  const safeAsin = asin.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(safeAsin)) {
    throw new Error("Invalid Amazon ASIN");
  }

  return `${AMAZON_ORIGIN}/dp/${safeAsin}?tag=${AMAZON_ASSOCIATE_TAG}`;
}
