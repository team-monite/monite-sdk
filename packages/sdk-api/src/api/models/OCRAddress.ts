/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * In general it's compatible with CounterpartAddress model but
 * * All fields are optional
 * * There is an additional field original_country_name
 */
export type OCRAddress = {
    /**
     * Two-letter ISO country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).
     */
    country?: string;
    /**
     * Country name as it is stated in the document.
     */
    original_country_name?: string;
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

