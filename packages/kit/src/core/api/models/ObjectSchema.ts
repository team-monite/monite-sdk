/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionSchema } from './ActionSchema';
import type { ObjectType } from './ObjectType';

export type ObjectSchema = {
    /**
     * Object type
     */
    object_type?: ObjectType;
    /**
     * List of actions
     */
    actions?: Array<ActionSchema>;
};
