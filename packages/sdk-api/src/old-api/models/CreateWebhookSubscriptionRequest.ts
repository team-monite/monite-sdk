/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { WebhookObjectType } from './WebhookObjectType';

export type CreateWebhookSubscriptionRequest = {
  event_types?: Array<string>;
  object_type: WebhookObjectType;
  url: string;
};
