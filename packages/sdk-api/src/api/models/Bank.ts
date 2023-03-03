/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';
import type { Media } from './Media';

export type Bank = {
    id: string;
    code: string;
    name: string;
    full_name: string;
    country: AllowedCountriesCodes;
    media: Array<Media>;
    payer_required: boolean;
};

