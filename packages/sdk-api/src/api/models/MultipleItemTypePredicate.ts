/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProductServiceTypeEnum } from './ProductServiceTypeEnum';

export type MultipleItemTypePredicate = {
    /**
     * Predicate name
     */
    name: MultipleItemTypePredicate.name;
    /**
     * Predicate operator
     */
    operator: 'ALL';
    /**
     * Predicate comparison value
     */
    value: Array<ProductServiceTypeEnum>;
};

export namespace MultipleItemTypePredicate {

    /**
     * Predicate name
     */
    export enum name {
        ITEM_TYPE = 'item_type',
    }


}

