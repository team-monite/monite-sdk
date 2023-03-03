/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectType } from './ObjectType';
import type { PayablePendingActionEnum } from './PayablePendingActionEnum';

export type PayablePendingActionSchema = {
    action_type: PayablePendingActionEnum;
    object_id: string;
    object_type: ObjectType;
};

