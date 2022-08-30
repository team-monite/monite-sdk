/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';

export type CompanyAddress = {
    city?: string;
    country?: AllowedCountriesCodes;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
};

