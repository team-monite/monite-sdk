import { fromMinorUnits, toMinorUnits } from '@/core/utils/currency';

/**
 * Converts a rate from minor units (API format) to major units (UI display format)
 * Example: 2000 -> 20
 * @param rateMinor The rate value in minor units (as received from API)
 * @returns The rate value in major units (for UI display)
 */
export const rateMinorToMajor = (rateMinor: number): number => {
  return fromMinorUnits(rateMinor);
};

/**
 * Converts a rate from major units (UI display format) to minor units (API format)
 * Example: 20 -> 2000
 * @param rateMajor The rate value in major units (from UI)
 * @returns The rate value in minor units (for API)
 */
export const rateMajorToMinor = (rateMajor: number): number => {
  return toMinorUnits(rateMajor);
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

/**
 * Format a VAT rate for display as a percentage string
 * Takes a rate in minor units (e.g., 700 for 7%) and returns a formatted string (e.g., "7.00%")
 * toLocaleString with style: 'percent' expects values in range 0-1, where 0.07 represents 7%
 *
 * Uses exponent=4 to convert basis points directly to decimal: 700 / 10^4 = 0.07
 */
export const formatVatRateForDisplay = (rateValue: number): string => {
  const decimal = fromMinorUnits(rateValue, 4);

  return decimal.toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Converts a VAT rate from percentage (UI display format) to basis points (API format)
 * Example: 7.5 -> 750 (7.5% -> 750 basis points)
 * @param ratePercentage The rate value in percentage (from UI)
 * @returns The rate value in basis points (for API)
 */
export const vatRatePercentageToBasisPoints = (ratePercentage: number): number => {
  return rateMajorToMinor(ratePercentage);
};

/**
 * Converts a VAT rate from basis points (API format) to percentage (UI display format)
 * Example: 750 -> 7.5 (750 basis points -> 7.5%)
 * @param rateBasisPoints The rate value in basis points (from API)
 * @returns The rate value in percentage (for UI display)
 */
export const vatRateBasisPointsToPercentage = (rateBasisPoints: number): number => {
  return rateMinorToMajor(rateBasisPoints);
};

/**
 * Converts a tax/VAT rate from percentage (e.g., 20%) to decimal form (e.g., 0.20)
 * for use in calculations like: tax = price * rateDecimal
 *
 * Example: 20 -> 0.20 (20% becomes 0.20 for multiplication)
 * Example: 7.5 -> 0.075 (7.5% becomes 0.075 for multiplication)
 *
 * Uses exponent=2 because: percentage / 10^2 = percentage / 100 = decimal
 *
 * @param ratePercentage The rate value as a percentage (e.g., 20 for 20%)
 * @returns The rate value as a decimal (e.g., 0.20 for 20%)
 */
export const ratePercentageToDecimal = (ratePercentage: number): number => {
  return fromMinorUnits(ratePercentage, 2);
};

/**
 * Converts a VAT rate directly from basis points (API format) to decimal form for calculations
 * This is a convenience function combining vatRateBasisPointsToPercentage + ratePercentageToDecimal
 *
 * Example: 2000 -> 0.20 (2000 basis points = 20% = 0.20 decimal)
 * Example: 750 -> 0.075 (750 basis points = 7.5% = 0.075 decimal)
 *
 * Uses exponent=4 because: basis_points / 10^4 = (basis_points / 100) / 100 = percentage / 100 = decimal
 *
 * @param rateBasisPoints The rate value in basis points (from API)
 * @returns The rate value as a decimal for use in calculations (e.g., 0.20)
 */
export const rateBasisPointsToDecimal = (rateBasisPoints: number): number => {
  return fromMinorUnits(rateBasisPoints, 4);
};
