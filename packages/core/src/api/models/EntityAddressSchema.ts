/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';

/**
 * A schema represents address info of the entity
 */
export type EntityAddressSchema = {
    /**
     * A country name (as ISO code) where the entity is registered
     */
    country?: AllowedCountriesCodes;
    /**
     * A city (a full name) where the entity is registered
     */
    city: string;
    /**
     * A postal code of the address where the entity is registered
     */
    postal_code: string;
    /**
     * A state in a country where the entity is registered
     */
    state?: string;
    /**
     * A street where the entity is registered
     */
    line1: string;
    /**
     * An alternative street used by the entity
     */
    line2?: string;
};
