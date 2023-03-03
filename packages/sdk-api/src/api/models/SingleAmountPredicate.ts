/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SingleAmountPredicate = {
    /**
     * Predicate name
     */
    name: SingleAmountPredicate.name;
    /**
     * Predicate operator
     */
    operator: 'LTE';
    /**
     * Predicate comparison value
     */
    value: number;
};

export namespace SingleAmountPredicate {

    /**
     * Predicate name
     */
    export enum name {
        AMOUNT = 'amount',
    }


}

