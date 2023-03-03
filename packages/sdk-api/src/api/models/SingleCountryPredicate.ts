/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';

export type SingleCountryPredicate = {
    /**
     * Predicate name
     */
    name: SingleCountryPredicate.name;
    /**
     * Predicate operator
     */
    operator: 'NEQ';
    /**
     * Predicate comparison value
     */
    value: AllowedCountriesCodes;
};

export namespace SingleCountryPredicate {

    /**
     * Predicate name
     */
    export enum name {
        ENTITY_COUNTRY = 'entity_country',
        COUNTERPART_COUNTRY = 'counterpart_country',
    }


}

