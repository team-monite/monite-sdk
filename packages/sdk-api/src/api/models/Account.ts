/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';
import type { BusinessTypes } from './BusinessTypes';
import type { Capabilities } from './Capabilities';
import type { Company } from './Company';

export type Account = {
    email: string;
    country: AllowedCountriesCodes;
    business_type: BusinessTypes;
    capabilities: Capabilities;
    company: Company;
};

