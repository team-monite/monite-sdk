/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { VatRateCreator } from './VatRateCreator';
import type { VatRateStatusEnum } from './VatRateStatusEnum';

export type VatRateResponse = {
  /**
   * Unique identifier of the vat rate object.
   */
  id: string;
  /**
   * Date/time when this rate was recorded in the table.
   */
  created_at: string;
  /**
   * Date/time when this rate was updated in the table.
   */
  updated_at: string;
  /**
   * Two-letter ISO country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).
   */
  country: AllowedCountries;
  /**
   * By whom this rate was recorded: monite employee | accounting system.
   */
  created_by?: VatRateCreator;
  /**
   * Status for this vat rate: active | inactive.
   */
  status?: VatRateStatusEnum;
  /**
   * Date starting from when this rate can be used.
   */
  valid_from?: string;
  /**
   * Date when this rate was depreciated, after this date rate cannot be used.
   */
  valid_until?: string;
  /**
   * Percent minor units. Example: 12.5% is 1250.
   */
  value: number;
};
