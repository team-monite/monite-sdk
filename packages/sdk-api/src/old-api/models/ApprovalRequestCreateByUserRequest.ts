/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ObjectType } from './ObjectType';

export type ApprovalRequestCreateByUserRequest = {
  object_id: string;
  object_type: ObjectType;
  required_approval_count: number;
  user_ids: Array<string>;
};
