/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { StatusEnum } from './StatusEnum';

export type CommentResource = {
  id: string;
  created_at?: string;
  updated_at?: string;
  created_by_entity_user_id: string;
  entity_id: string;
  object_id: string;
  object_type: string;
  reply_to_entity_user_id?: string;
  status: StatusEnum;
  text: string;
};
