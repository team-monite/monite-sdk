/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { WebhookObjectType } from './WebhookObjectType';

export type EventResource = {
  id: string;
  /**
   * The timestamp that was generated at the time of making the database transaction that has initially caused the event
   */
  created_at?: string;
  action: string;
  api_version?: string;
  entity_id: string;
  name: string;
  object?: any;
  object_id: string;
  object_type: WebhookObjectType;
  significance?: string;
};
