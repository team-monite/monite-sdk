/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PredicateResponse } from './PredicateResponse';
import type { StatusEnum } from './StatusEnum';

export type RuleResponse = {
    /**
     * Object type for the rule
     */
    object_type: RuleResponse.object_type;
    /**
     * The returned object, regulatory settings ID
     */
    result_value: string;
    /**
     * Predicates for the rule object
     */
    predicates: Array<PredicateResponse>;
    /**
     * Unique identifier of the rule object
     */
    id: string;
    /**
     * The status of the rule object
     */
    status: StatusEnum;
    /**
     * Time at which the rule was created. Timestamps follow the ISO 8601 standard.
     */
    created_at: string;
    /**
     * Time at which the rule was last updated. Timestamps follow the ISO 8601 standard.
     */
    updated_at: string;
};

export namespace RuleResponse {

    /**
     * Object type for the rule
     */
    export enum object_type {
        RECEIVABLE = 'receivable',
    }


}

