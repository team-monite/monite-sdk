/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { WebhookObjectType } from './WebhookObjectType';
import type { WebhookSubscriptionStatus } from './WebhookSubscriptionStatus';

export type WebhookSubscriptionResource = {
  id: string;
  event_types: Array<string>;
  object_type: WebhookObjectType;
  status: WebhookSubscriptionStatus;
  url: string;
};
