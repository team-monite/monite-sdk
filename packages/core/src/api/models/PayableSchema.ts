/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PayableActionSchema } from './PayableActionSchema';

export type PayableSchema = {
    /**
     * Object type
     */
    object_type?: PayableSchema.object_type;
    /**
     * List of actions
     */
    actions?: Array<PayableActionSchema>;
};

export namespace PayableSchema {

    /**
     * Object type
     */
    export enum object_type {
        PAYABLE = 'payable',
    }


}

