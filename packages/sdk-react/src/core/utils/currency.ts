import { components } from '@/api';

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

/**
 * Convert a monetary amount from major units to minor units using currency-specific data
 * Returns null if currency is not found in the currency list or if input is invalid
 *
 * @param amountMajor Amount in major units (string or number)
 * @param currency Currency code
 * @param currencyList Currency metadata from API
 * @returns Amount in minor units as integer, or null if currency not found or input is invalid/non-finite
 */
export const toMinorUnitsWithCurrency = (
  amountMajor: string | number,
  currency: string,
  currencyList: CurrencyList | null | undefined
): number | null => {
  const currencyData = currencyList?.[currency];

  if (!currencyData) {
    return null;
  }

  const isString = typeof amountMajor === 'string';
  const n = isString ? Number(amountMajor) : amountMajor;

  if (!Number.isFinite(n) || (isString && amountMajor.trim() === '')) {
    return null;
  }

  return toMinorUnits(n, currencyData.minor_units);
};

/**
 * Convert a monetary amount from minor units to major units using currency-specific data
 * Uses proper rounding to maintain precision based on currency's minor units
 * Returns null if currency is not found in the currency list or if input is invalid
 *
 * @param amountMinor Amount in minor units
 * @param currency Currency code
 * @param currencyList Currency metadata from API
 * @returns Amount in major units, or null if currency not found or input is invalid/non-finite
 */
export const fromMinorUnitsWithCurrency = (
  amountMinor: number,
  currency: string,
  currencyList: CurrencyList | null | undefined
): number | null => {
  const currencyData = currencyList?.[currency];

  if (!currencyData) {
    return null;
  }

  if (!Number.isFinite(amountMinor)) {
    return null;
  }

  const converted = fromMinorUnits(amountMinor, currencyData.minor_units);

  return Number(converted.toFixed(currencyData.minor_units));
};

type CurrencyList = Record<string, components['schemas']['CurrencyDetails']>;
