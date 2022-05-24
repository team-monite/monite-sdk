/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionPermission } from './ActionPermission';
import type { ObjectType } from './ObjectType';

/**
 * A schema contains a set of action permissions for an object
 */
export type ObjectActionPermissionResponse = {
    object: ObjectType;
    actions: Array<ActionPermission>;
};
