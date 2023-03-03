/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MultipleAmountPredicate = {
    /**
     * Predicate name
     */
    name: MultipleAmountPredicate.name;
    /**
     * Predicate operator
     */
    operator: 'RANGE';
    /**
     * Predicate comparison value
     */
    value: Array<number>;
};

export namespace MultipleAmountPredicate {

    /**
     * Predicate name
     */
    export enum name {
        AMOUNT = 'amount',
    }


}

