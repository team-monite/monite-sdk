/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionEnum } from './ActionEnum';
import type { PermissionEnum } from './PermissionEnum';

/**
 * A schema describing a set of permission for an action
 */
export type ActionPermission = {
    action: ActionEnum;
    permissions: Array<PermissionEnum>;
};
