/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionEnum } from './ActionEnum';
import type { PermissionEnum } from './PermissionEnum';

export type ActionSchema = {
    /**
     * Action name
     */
    action_name?: ActionEnum;
    /**
     * Permission type
     */
    permission?: PermissionEnum;
};
