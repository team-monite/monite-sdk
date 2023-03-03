/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionSchema } from './ActionSchema';

export type CommonSchema = {
    /**
     * Object type
     */
    object_type?: 'workflow';
    /**
     * List of actions
     */
    actions?: Array<ActionSchema>;
};

