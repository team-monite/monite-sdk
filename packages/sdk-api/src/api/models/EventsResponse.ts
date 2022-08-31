/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectType } from './ObjectType';
import type { SignificanceEnum } from './SignificanceEnum';

export type EventsResponse = {
    id: string;
    object_id: string;
    object_type: ObjectType;
    action: string;
    name: string;
    significance: SignificanceEnum;
};

