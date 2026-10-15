/**
 * Utilities for Amazon product URLs and ASIN validation
 */

export interface AmazonUrlValidationResult {
  isValid: boolean;
  asin: string | null;
  error?: string;
}

/**
 * Extracts a 10-character ASIN from an Amazon product URL.
 */
export function extractAsin(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Match common Amazon path patterns
  const match =
    trimmed.match(
      /(?:dp|gp\/product|d|asin|product|o|gp\/offer-listing|gp\/aw\/d)\/([A-Z0-9]{10})/i
    ) || trimmed.match(/\/([B0-9][A-Z0-9]{9})(?:[/?#]|$)/i);

  if (match && match[1]) {
    return match[1].toUpperCase();
  }

  // Check if direct 10-char ASIN was passed
  if (/^[A-Z0-9]{10}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return null;
}

/**
 * Checks whether an ASIN is a known dummy, placeholder, or invalid test pattern.
 */
export function isDummyOrInvalidAsin(asin: string): boolean {
  if (!asin || asin.length !== 10) return true;
  const upper = asin.toUpperCase();

  // Known invalid patterns (e.g. B000000000, 0000000000, repeating sequences)
  if (/^B0{6,}[0-9A-Z]*$/.test(upper)) return true; // B000000000, B000000001, etc.
  if (/^0{10}$/.test(upper)) return true;
  if (/^(.)\1{9}$/.test(upper)) return true; // 1111111111, XXXXXXXXXX
  if (/^0123456789$/.test(upper) || /^1234567890$/.test(upper)) return true;
  if (/^B0000000/.test(upper)) return true;

  return false;
}

/**
 * Validates that an Amazon product URL is well-formed, points to an Amazon domain,
 * and contains a valid, non-dummy 10-character ASIN.
 */
export function validateAmazonUrl(url: string): AmazonUrlValidationResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return {
      isValid: false,
      asin: null,
      error: "Amazon Product URL is required.",
    };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      asin: null,
      error: "Please enter a valid URL (e.g. https://www.amazon.com/dp/B08N5WRWNW).",
    };
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return {
      isValid: false,
      asin: null,
      error: "URL protocol must be http:// or https://",
    };
  }

  const isAmazonDomain = /(?:^|\.)(?:amazon\.(?:com|co\.uk|ca|de|fr|it|es|co\.jp|in|com\.au|com\.mx|com\.br|nl|se|sg|ae|sa)|amzn\.(?:to|asia))$/i.test(
    parsedUrl.hostname
  );

  if (!isAmazonDomain) {
    return {
      isValid: false,
      asin: null,
      error: "Please provide a valid Amazon URL (e.g. amazon.com or amzn.to).",
    };
  }

  // Allow amzn.to shortlinks where ASIN is resolved server-side
  if (/(?:^|\.)amzn\.(?:to|asia)$/i.test(parsedUrl.hostname)) {
    return { isValid: true, asin: null };
  }

  const asin = extractAsin(trimmed);
  if (!asin) {
    return {
      isValid: false,
      asin: null,
      error: "Could not find a valid 10-character Amazon ASIN in the URL (e.g. /dp/B08N5WRWNW).",
    };
  }

  if (isDummyOrInvalidAsin(asin)) {
    return {
      isValid: false,
      asin,
      error: `Invalid or dead ASIN "${asin}". Please provide a valid, active Amazon product link.`,
    };
  }

  return {
    isValid: true,
    asin,
  };
}
