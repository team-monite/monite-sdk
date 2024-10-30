/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ApprovalProcessStepStatus } from './ApprovalProcessStepStatus';

export type ApprovalProcessStepResource = {
  approved_by: Array<string>;
  object_id: string;
  rejected_by?: string;
  required_approval_count: number;
  role_ids: Array<string>;
  status: ApprovalProcessStepStatus;
  user_ids: Array<string>;
};
