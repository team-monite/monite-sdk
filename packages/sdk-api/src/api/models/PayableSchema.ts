/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PayableActionSchema } from './PayableActionSchema';

export type PayableSchema = {
    /**
     * Object type
     */
    object_type?: 'payable';
    /**
     * List of actions
     */
    actions?: Array<PayableActionSchema>;
};

