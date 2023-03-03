/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WebhookObjectType } from './WebhookObjectType';

export type WebhookSettingsResponse = {
    id: string;
    object_type: WebhookObjectType;
    url: string;
};

