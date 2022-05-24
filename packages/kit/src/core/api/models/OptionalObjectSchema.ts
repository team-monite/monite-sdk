/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectType } from './ObjectType';
import type { OptionalActionSchema } from './OptionalActionSchema';

export type OptionalObjectSchema = {
    /**
     * Object type
     */
    object_type?: ObjectType;
    /**
     * List of actions
     */
    actions?: Array<OptionalActionSchema>;
};
