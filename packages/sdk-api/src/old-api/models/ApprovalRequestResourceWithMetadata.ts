/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ApprovalRequestStatus } from './ApprovalRequestStatus';
import type { ObjectType } from './ObjectType';

export type ApprovalRequestResourceWithMetadata = {
  id: string;
  created_at: string;
  updated_at: string;
  approved_by: Array<string>;
  /**
   * ID of the user who created the approval request
   */
  created_by: string;
  object_id: string;
  object_type: ObjectType;
  rejected_by?: string;
  required_approval_count: number;
  role_ids: Array<string>;
  status: ApprovalRequestStatus;
  user_ids: Array<string>;
};
