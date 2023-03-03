/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Predicate } from './Predicate';

export type RuleRequest = {
    /**
     * Object type for the rule
     */
    object_type: RuleRequest.object_type;
    /**
     * The returned object, regulatory settings ID
     */
    result_value: string;
    /**
     * Predicates for the rule object
     */
    predicates: Array<Predicate>;
};

export namespace RuleRequest {

    /**
     * Object type for the rule
     */
    export enum object_type {
        RECEIVABLE = 'receivable',
    }


}

