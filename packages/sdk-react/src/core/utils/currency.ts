/**
 * Convert a monetary amount from major units (e.g., 12.34) to minor units (e.g., 1234)
 * Uses rounding to avoid floating point precision issues.
 *
 * @param amountMajor Amount in major units
 * @param exponent Currency exponent (default 2 for cents)
 * @returns Amount in minor units as integer
 */
export const toMinorUnits = (
  amountMajor: number,
  exponent: number = 2
): number => {
  const factor = Math.pow(10, exponent);

  return Math.round(amountMajor * factor);
};

/**
 * Convert a monetary amount from minor units (e.g., 1234) to major units (e.g., 12.34)
 *
 * @param amountMinor Amount in minor units
 * @param exponent Currency exponent (default 2 for cents)
 * @returns Amount in major units
 */
export const fromMinorUnits = (
  amountMinor: number,
  exponent: number = 2
): number => {
  const factor = Math.pow(10, exponent);

  return amountMinor / factor;
};
