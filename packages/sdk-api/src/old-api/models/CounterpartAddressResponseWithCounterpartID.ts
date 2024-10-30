/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';

/**
 * Address information.
 */
export type CounterpartAddressResponseWithCounterpartID = {
  /**
   * Two-letter ISO country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).
   */
  country: AllowedCountries;
  /**
   * City name.
   */
  city: string;
  /**
   * ZIP or postal code.
   */
  postal_code: string;
  /**
   * State, region, province, or county.
   */
  state?: string;
  /**
   * Street address.
   */
  line1: string;
  /**
   * Additional address information (if any).
   */
  line2?: string;
  /**
   * Unique ID of the address in the system
   */
  id: string;
  /**
   * True if address is the default address of the counterpart.
   */
  is_default: boolean;
  /**
   * ID of the counterpart that owns the address.
   */
  counterpart_id: string;
};
