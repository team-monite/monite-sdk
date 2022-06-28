/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountries } from './AllowedCountries';

export type CreatePartnerRequest = {
    /**
     * Company name. Should not be unique
     */
    company_name: string;
    /**
     * Country of Jurisdiction
     */
    country: AllowedCountries;
    /**
     * Website url
     */
    website: string;
    /**
     * Contact person email
     */
    email?: string;
    /**
     * Company ID
     */
    legal_id?: string;
    /**
     * Tax ID
     */
    tax_id?: string;
};
