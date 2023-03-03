/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VatValidityEnum } from './VatValidityEnum';

export type VatPredicate = {
    /**
     * Predicate name
     */
    name: 'counterpart_vat';
    /**
     * Predicate operator
     */
    operator: VatPredicate.operator;
    /**
     * Predicate comparison value
     */
    value: VatValidityEnum;
};

export namespace VatPredicate {

    /**
     * Predicate operator
     */
    export enum operator {
        EQ = 'EQ',
        NEQ = 'NEQ',
    }


}

