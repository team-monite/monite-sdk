/**
 * Converts a rate from minor units (API format) to major units (UI display format)
 * Example: 2000 -> 20
 * @param rateMinor The rate value in minor units (as received from API)
 * @returns The rate value in major units (for UI display)
 */
export const rateMinorToMajor = (rateMinor: number): number => {
  return rateMinor / 100;
};

/**
 * Converts a rate from major units (UI display format) to minor units (API format)
 * Example: 20 -> 2000
 * @param rateMajor The rate value in major units (from UI)
 * @returns The rate value in minor units (for API)
 */
export const rateMajorToMinor = (rateMajor: number): number => {
  return rateMajor * 100;
};

/**
 * Gets the appropriate rate value based on whether VAT is supported,
 * converting to major units for display
 * @param isNonVatSupported Whether VAT is not supported
 * @param vatRateMinor The VAT rate value in minor units (from API)
 * @param taxRateMajor The tax rate value in major units (from UI)
 * @returns The appropriate rate value in major units (for display)
 */
export const getRateValueForDisplay = (
  isNonVatSupported: boolean,
  vatRateMinor: number,
  taxRateMajor: number
): number => {
  if (isNonVatSupported) {
    return taxRateMajor;
  }
  return rateMinorToMajor(vatRateMinor);
};
