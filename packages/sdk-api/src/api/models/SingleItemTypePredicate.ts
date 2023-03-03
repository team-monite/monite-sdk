/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProductServiceTypeEnum } from './ProductServiceTypeEnum';

export type SingleItemTypePredicate = {
    /**
     * Predicate name
     */
    name: SingleItemTypePredicate.name;
    /**
     * Predicate operator
     */
    operator: 'NEQ';
    /**
     * Predicate comparison value
     */
    value: ProductServiceTypeEnum;
};

export namespace SingleItemTypePredicate {

    /**
     * Predicate name
     */
    export enum name {
        ITEM_TYPE = 'item_type',
    }


}

