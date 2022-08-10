/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';
import type { BusinessTypes } from './BusinessTypes';
import type { Capabilities } from './Capabilities';
import type { UpdateCompany } from './UpdateCompany';

export type UpdateAccount = {
    email?: string;
    country?: AllowedCountriesCodes;
    business_type?: BusinessTypes;
    capabilities?: Capabilities;
    company?: UpdateCompany;
};

