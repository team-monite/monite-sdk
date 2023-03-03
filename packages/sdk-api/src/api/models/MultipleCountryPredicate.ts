/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllowedCountriesCodes } from './AllowedCountriesCodes';

export type MultipleCountryPredicate = {
    /**
     * Predicate name
     */
    name: MultipleCountryPredicate.name;
    /**
     * Predicate operator
     */
    operator: 'NOT_IN';
    /**
     * Predicate comparison value
     */
    value: Array<AllowedCountriesCodes>;
};

export namespace MultipleCountryPredicate {

    /**
     * Predicate name
     */
    export enum name {
        ENTITY_COUNTRY = 'entity_country',
        COUNTERPART_COUNTRY = 'counterpart_country',
    }


}

