/**
 * Generates a unique ID, using crypto.randomUUID() when available
 * or falling back to a cryptographically secure alternative using crypto.getRandomValues()
 *
 * @returns A string representing a unique identifier
 */

let fallbackCounter = 0;

/**
 * Generates a UUID using the native crypto.randomUUID() if available
 * @returns A native UUID string, or null if not available
 */
function generateNativeUUID(): string | null {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return null;
}

/**
 * Generates a UUID using crypto.getRandomValues()
 * @returns A UUID-like string using cryptographically secure random bytes, or null if not available
 */
function generateCryptoUUID(): string | null {
  if (
    typeof crypto === 'undefined' ||
    typeof crypto.getRandomValues !== 'function'
  ) {
    return null;
  }

  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);

  const hex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16
  )}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Fallback UUID generation using timestamp and counter
 * @returns A unique identifier string for environments without crypto support
 */
function generateFallbackUUID(): string {
  fallbackCounter = (fallbackCounter + 1) % 1000000;

  const timestamp = Date.now().toString(36);
  const counter = fallbackCounter.toString(36).padStart(4, '0');
  return `${timestamp}-${counter}`;
}

export const generateUniqueId = (): string => {
  return generateNativeUUID() ?? generateCryptoUUID() ?? generateFallbackUUID();
};
