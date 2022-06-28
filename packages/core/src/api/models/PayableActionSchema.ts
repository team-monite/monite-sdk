/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PayableActionEnum } from './PayableActionEnum';
import type { PermissionEnum } from './PermissionEnum';

export type PayableActionSchema = {
    /**
     * Action name
     */
    action_name?: PayableActionEnum;
    /**
     * Permission type
     */
    permission?: PermissionEnum;
};
