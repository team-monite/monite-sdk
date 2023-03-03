/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PredicateNameEnum } from './PredicateNameEnum';
import type { PredicateOperatorEnum } from './PredicateOperatorEnum';

export type PredicateResponse = {
    /**
     * Predicate name
     */
    name: PredicateNameEnum;
    /**
     * Predicate operator
     */
    operator: PredicateOperatorEnum;
    /**
     * Predicate comparison value
     */
    value: string;
};

