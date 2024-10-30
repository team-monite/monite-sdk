/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { WebhookObjectType } from './WebhookObjectType';

export type UpdateWebhookSubscriptionRequest = {
  event_types?: Array<string>;
  object_type?: WebhookObjectType;
  url?: string;
};
