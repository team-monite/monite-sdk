/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WebhookObjectType } from './WebhookObjectType';

export type CreateWebhookRequest = {
    object_type: WebhookObjectType;
    url: string;
};

