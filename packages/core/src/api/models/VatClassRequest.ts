/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';

export type VatClassRequest = {
    /**
     * Percent minor units. Example: 12.5% is 1250
     */
    value: number;
    country: AllowedCountriesCodes;
};

