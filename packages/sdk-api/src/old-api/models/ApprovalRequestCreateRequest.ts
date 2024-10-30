/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ApprovalRequestCreateByRoleRequest } from './ApprovalRequestCreateByRoleRequest';
import type { ApprovalRequestCreateByUserRequest } from './ApprovalRequestCreateByUserRequest';

export type ApprovalRequestCreateRequest =
  | ApprovalRequestCreateByRoleRequest
  | ApprovalRequestCreateByUserRequest;
