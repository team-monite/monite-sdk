/**
 * Converts a rate from minor units (API format) to major units (UI display format)
 * Example: 2000 -> 20
 * @param rateMinor The rate value in minor units (as received from API)
 * @returns The rate value in major units (for UI display)
 */
import { fromMinorUnits, toMinorUnits } from '@/core/utils/currency';

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
 */
export const formatVatRateForDisplay = (rateValue: number): string => {
  return (rateMinorToMajor(rateValue) / 100).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
