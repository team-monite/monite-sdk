/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type WebhookDeliveryResource = {
  id: string;
  event_id: string;
  requests_made_count: number;
  response?: string;
  url: string;
  was_successful?: boolean;
};
