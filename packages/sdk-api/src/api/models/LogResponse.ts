/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LogResponse = {
  id: string;
  body?: Record<string, any>;
  content_type: string;
  entity_id: string;
  entity_user_id?: string;
  headers?: Record<string, any>;
  method?: string;
  params?: string;
  parent_log_id?: string;
  partner_id: string;
  path?: string;
  status_code?: number;
  target_service: string;
  timestamp: string;
  type: string;
};
