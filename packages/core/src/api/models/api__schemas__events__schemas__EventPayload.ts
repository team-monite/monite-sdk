/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectType } from './ObjectType';
import type { SignificanceEnum } from './SignificanceEnum';

export type api__schemas__events__schemas__EventPayload = {
    object_id: string;
    object_type: ObjectType;
    action: string;
    name: string;
    significance: SignificanceEnum;
    attempts_before_disabling: number;
};

