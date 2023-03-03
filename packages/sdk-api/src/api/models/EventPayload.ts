/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SignificanceEnum } from './SignificanceEnum';
import type { WebhookObjectType } from './WebhookObjectType';

export type EventPayload = {
    object_id: string;
    object_type: WebhookObjectType;
    action: string;
    name: string;
    significance: SignificanceEnum;
    attempts_before_disabling: number;
};

