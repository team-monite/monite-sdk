/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';

export type CounterpartUpdateAddress = {
    /**
     * Two-letter ISO country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).
     */
    country?: AllowedCountriesCodes;
    /**
     * City name.
     */
    city?: string;
    /**
     * ZIP or postal code.
     */
    postal_code?: string;
    /**
     * State, region, province, or county.
     */
    state?: string;
    /**
     * Street address.
     */
    line1?: string;
    /**
     * Additional address information (if any).
     */
    line2?: string;
};

