/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ObjectType } from './ObjectType';

export type ApprovalRequestCreateByRoleRequest = {
  object_id: string;
  object_type: ObjectType;
  required_approval_count: number;
  role_ids: Array<string>;
};
