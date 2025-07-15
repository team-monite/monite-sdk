import { components } from '@/api';
import {
  getSharedApprovalRuleLabel,
  getUsersFromListLabel,
} from '@/components/approvalPolicies/shared/approvalRuleLabels';
import type { I18n } from '@lingui/core';

import { type ApprovalCall } from './buildApprovalSteps';

export const APPROVAL_CALL_TYPES = {
  REQUEST_APPROVAL_BY_USERS: 'ApprovalRequests.request_approval_by_users',
  REQUEST_APPROVAL_BY_ROLES: 'ApprovalRequests.request_approval_by_roles',
} as const;

export interface ApprovalCallParams {
  user_ids?: string[];
  role_ids?: string[];
  required_approval_count?: number;
  object_id?: string;
  object_type?: ObjectType;
}

export interface ApprovalCallWithNesting {
  call?: string;
  params?: ApprovalCallParams;
  all?: ApprovalStructureItem[];
  if?: ApprovalStructureItem;
  then?: ApprovalStructureItem[];
  run_concurrently?: boolean;
}

export interface ApprovalStructureItem {
  call?: string;
  params?: ApprovalCallParams;
  all?: ApprovalStructureItem[];
  if?: ApprovalStructureItem;
  then?: ApprovalStructureItem[];
  run_concurrently?: boolean;
}

export interface ProcessedApprovalStep {
  assignees: string[];
  roleIds: string[];
  actualAssignees: string[];
  relatedRequests: ApprovalRequest[];
  isRoleBased: boolean;
  stepStatus: ApprovalRequestStatus;
  approvalRequestId?: string;
  approvedBy?: string[];
  objectId?: string;
  rejectedBy?: string;
  requiredApprovalCount?: number;
}

export const mapApprovalStatusToPayableStatus = (
  status: ApprovalRequestStatus
): PayableStateEnum => {
  switch (status) {
    case 'approved':
      return 'waiting_to_be_paid';
    case 'rejected':
      return 'rejected';
    case 'canceled':
      return 'canceled';
    case 'waiting':
    default:
      return 'approve_in_progress';
  }
};

export const findUserApprovalCall = (
  approvalCalls: ApprovalCall[]
): ApprovalCall | undefined =>
  approvalCalls.find(
    (call) => call.call === APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_USERS
  );

export const findRoleApprovalCall = (
  approvalCalls: ApprovalCall[]
): ApprovalCall | undefined =>
  approvalCalls.find(
    (call) => call.call === APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_ROLES
  );

export const filterRequestsByRoles = (
  requests: ApprovalRequest[],
  roleIds: string[]
): ApprovalRequest[] => {
  return requests.filter(
    (request) =>
      request.role_ids?.length > 0 &&
      roleIds.some((roleId) => request.role_ids!.includes(roleId))
  );
};

export const filterRequestsByUsers = (
  requests: ApprovalRequest[],
  userIds: string[],
  includeAnyUser = false
): ApprovalRequest[] => {
  return requests.filter((request) => {
    if (!request.user_ids?.length) return false;

    if (includeAnyUser) {
      return request.user_ids.some((userId) => userIds.includes(userId));
    }

    return userIds.every((userId) => request.user_ids!.includes(userId));
  });
};

export const getApprovalRuleLabel = (
  userApprovalCall: ApprovalCall | undefined,
  roleApprovalCall: ApprovalCall | undefined,
  i18n: I18n
): string => {
  if (userApprovalCall?.params) {
    const { user_ids, required_approval_count } = userApprovalCall.params;

    if (user_ids?.length === 1) {
      return getSharedApprovalRuleLabel.singleUser(i18n);
    }

    return getUsersFromListLabel(i18n, required_approval_count);
  }

  if (roleApprovalCall?.params) {
    return getSharedApprovalRuleLabel.anyUserWithRole(i18n);
  }

  return '';
};

/**
 * Recursively extracts approval calls from nested structures
 * @param item - The nested approval structure item
 * @returns Array of approval calls
 */
export const extractApprovalCalls = (
  item: ApprovalStructureItem
): ApprovalCall[] => {
  if (!item) return [];

  if (item.call && item.params) {
    return [item as ApprovalCall];
  }

  if (Array.isArray(item.all)) {
    return item.all.flatMap(extractApprovalCalls);
  }

  if (item.if) {
    return extractApprovalCalls(item.if);
  }

  return [];
};

/**
 * Processes a nested approval structure to extract approval calls
 * @param items - Array of approval structure items
 * @returns Array of approval calls
 */
export const processApprovalStructure = (
  items: ApprovalStructureItem[]
): ApprovalCall[] => {
  return items.flatMap(extractApprovalCalls);
};

/**
 * Extracts approval structure items from a script step
 * This utility consolidates the duplicated logic for processing script steps
 * @param scriptStep - The script step to process
 * @returns Array of approval structure items
 */
export const extractStructureItemsFromScriptStep = (
  scriptStep: ApprovalStructureItem
): ApprovalStructureItem[] => {
  const structureItems: ApprovalStructureItem[] = [];

  if (scriptStep.all) {
    structureItems.push(...(scriptStep.all as ApprovalStructureItem[]));
  } else if (scriptStep.if) {
    const ifItem = scriptStep.if as ApprovalStructureItem;

    if (ifItem.all) {
      structureItems.push(...ifItem.all);
    } else {
      structureItems.push(ifItem);
    }
  }

  return structureItems;
};

/**
 * Recursively extracts approval calls from nested structures for approval policies table
 * This utility handles the more generic case where items can be arrays or have different nesting patterns
 * @param item - The nested approval structure item (can be array or object)
 * @returns Array of approval calls
 */
export const extractApprovalCallsForTable = (item: any): any[] => {
  if (!item) return [];

  if (item.call && item.params) {
    return [item];
  }

  if (Array.isArray(item.all)) {
    return item.all.flatMap(extractApprovalCallsForTable);
  }

  if (Array.isArray(item)) {
    return item.flatMap(extractApprovalCallsForTable);
  }

  return [];
};

/**
 * Converts ProcessedApprovalStep to ApprovalProcessStepResource format
 * @param step - The processed approval step
 * @returns ApprovalProcessStepResource compatible object
 */
export function toApprovalProcessStepResource(
  step: ProcessedApprovalStep
): Omit<ApprovalProcessStepResource, 'approval_request_id'> & {
  approval_request_id?: string;
} {
  return {
    approved_by: step.approvedBy || [],
    object_id: step.objectId || '',
    rejected_by: step.rejectedBy,
    required_approval_count: step.requiredApprovalCount || 0,
    role_ids: step.roleIds,
    status: step.stepStatus,
    user_ids: step.assignees,
  };
}

/**
 * Converts ApprovalCall to ApprovalRequestCreateByUserRequest format
 * @param call - The approval call
 * @returns ApprovalRequestCreateByUserRequest compatible object
 */
export const toApprovalRequestCreateByUserRequest = (
  call: ApprovalCall
): Partial<ApprovalRequestCreateByUserRequest> => {
  if (call.call !== APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_USERS) {
    throw new Error('Call is not a user-based approval request');
  }

  return {
    object_id: call.params?.object_id || '',
    object_type: call.params?.object_type || 'payable',
    required_approval_count: call.params?.required_approval_count || 1,
    user_ids: call.params?.user_ids || [],
  };
};

/**
 * Converts ApprovalCall to ApprovalRequestCreateByRoleRequest format
 * @param call - The approval call
 * @returns ApprovalRequestCreateByRoleRequest compatible object
 */
export const toApprovalRequestCreateByRoleRequest = (
  call: ApprovalCall
): Partial<ApprovalRequestCreateByRoleRequest> => {
  if (call.call !== APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_ROLES) {
    throw new Error('Call is not a role-based approval request');
  }

  return {
    object_id: call.params?.object_id || '',
    object_type: call.params?.object_type || 'payable',
    required_approval_count: call.params?.required_approval_count || 1,
    role_ids: call.params?.role_ids || [],
  };
};

/**
 * Calculates integral status for a collection of approval requests
 */
export const calculateIntegralStatus = (
  requests: ApprovalRequest[]
): components['schemas']['ApprovalRequestStatus'] => {
  if (requests.length === 0) return 'waiting';

  const hasWaiting = requests.some((req) => req.status === 'waiting');
  if (hasWaiting) return 'waiting';

  const allApproved = requests.every((req) => req.status === 'approved');
  if (allApproved) return 'approved';

  const hasRejected = requests.some((req) => req.status === 'rejected');
  if (hasRejected) return 'rejected';

  return 'waiting';
};

/**
 * Creates base EnhancedApprovalStep properties from ProcessedApprovalStep
 */
export const createBaseApprovalStep = (
  processedStep: ProcessedApprovalStep,
  stepNumber: number,
  type: string
) => ({
  stepNumber,
  type,
  assignee: undefined,
  assignees: processedStep.assignees,
  roleIds: processedStep.roleIds,
  status: processedStep.stepStatus,
  payableStatus: mapApprovalStatusToPayableStatus(processedStep.stepStatus),
  isRoleBased: processedStep.isRoleBased,
  actualAssignees: processedStep.actualAssignees,
  hasActiveRequests: processedStep.relatedRequests.length > 0,
  requestIds: processedStep.relatedRequests.map((req) => req.id),
  approvalRequestId: processedStep.approvalRequestId,
  approvedBy: processedStep.approvedBy,
  objectId: processedStep.objectId,
  rejectedBy: processedStep.rejectedBy,
  requiredApprovalCount: processedStep.requiredApprovalCount,
});

/**
 * Creates EnhancedApprovalStep for chain approval scenario
 */
export const createChainApprovalStep = (
  allChainUserIds: string[],
  allChainRequests: ApprovalRequest[],
  stepNumber: number,
  typeLabel: string
) => {
  const integralStatus = calculateIntegralStatus(allChainRequests);

  return {
    stepNumber,
    type: typeLabel,
    assignee: undefined,
    assignees: allChainUserIds,
    roleIds: [],
    status: integralStatus,
    payableStatus: mapApprovalStatusToPayableStatus(integralStatus),
    isRoleBased: false,
    actualAssignees: allChainUserIds,
    hasActiveRequests: allChainRequests.length > 0,
    requestIds: allChainRequests.map((req) => req.id),
    approvalRequestId: allChainRequests[0]?.id,
    approvedBy: allChainRequests.flatMap((req) => req.approved_by || []),
    objectId: allChainRequests[0]?.object_id,
    rejectedBy: allChainRequests.find((req) => req.rejected_by)?.rejected_by,
    requiredApprovalCount: allChainRequests.reduce(
      (sum, req) => sum + req.required_approval_count,
      0
    ),
  };
};

/**
 * Processes chain approval calls (sequential user approvals)
 */
export const processChainApprovalCalls = (
  userApprovalCalls: ApprovalStructureItem[],
  requests: ApprovalRequest[]
) => {
  const allChainUserIds = userApprovalCalls.flatMap(
    (call: ApprovalStructureItem) => call.params?.user_ids || []
  );

  const allChainRequests = requests.filter(
    (req) =>
      req.user_ids?.length &&
      allChainUserIds.some((userId) => req.user_ids!.includes(userId))
  );

  return { allChainUserIds, allChainRequests };
};

/**
 * Extracts items to process from a script step
 */
export const extractItemsFromScriptStep = (
  scriptStep: any
): ApprovalStructureItem[] => {
  const itemsToProcess: ApprovalStructureItem[] = [];

  if (scriptStep.all) {
    itemsToProcess.push(...(scriptStep.all as ApprovalStructureItem[]));
  } else if (scriptStep.if) {
    const ifItem = scriptStep.if as ApprovalStructureItem;
    if (ifItem.all) {
      itemsToProcess.push(...ifItem.all);
    } else {
      itemsToProcess.push(ifItem);
    }
  }

  return itemsToProcess;
};

export const resolveStepForCall = (
  call: ApprovalCall,
  requests: ApprovalRequest[]
): ProcessedApprovalStep => {
  const userApprovalCall =
    call.call === APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_USERS
      ? call
      : undefined;
  const roleApprovalCall =
    call.call === APPROVAL_CALL_TYPES.REQUEST_APPROVAL_BY_ROLES
      ? call
      : undefined;

  let assignees: string[] = [];
  let roleIds: string[] = [];
  let actualAssignees: string[] = [];
  let relatedRequests: ApprovalRequest[] = [];

  if (userApprovalCall?.params?.user_ids) {
    assignees = userApprovalCall.params.user_ids;
  }

  if (roleApprovalCall?.params?.role_ids) {
    roleIds = roleApprovalCall.params.role_ids;
  }

  const isRoleBased = roleIds.length > 0 && assignees.length === 0;

  if (isRoleBased) {
    relatedRequests = filterRequestsByRoles(requests, roleIds);
  } else {
    relatedRequests = filterRequestsByUsers(requests, assignees, true);
  }

  if (assignees.length === 0 && !isRoleBased) {
    const userIds = relatedRequests.flatMap((req) => req.user_ids || []);
    actualAssignees = [...new Set(userIds)];
  } else {
    actualAssignees = assignees;
  }

  const stepStatus: ApprovalRequestStatus = relatedRequests.length
    ? relatedRequests[0].status
    : 'waiting';

  const firstRequest = relatedRequests.find((req) => req.status !== 'waiting');
  const approvedBy = relatedRequests.flatMap((req) => req.approved_by || []);
  const uniqueApprovedBy = [...new Set(approvedBy)];

  return {
    assignees,
    roleIds,
    actualAssignees,
    relatedRequests,
    isRoleBased,
    stepStatus,
    approvalRequestId: firstRequest?.id,
    approvedBy: uniqueApprovedBy.length > 0 ? uniqueApprovedBy : undefined,
    objectId: firstRequest?.object_id || call.params?.object_id,
    rejectedBy: firstRequest?.rejected_by,
    requiredApprovalCount:
      call.params?.required_approval_count ||
      firstRequest?.required_approval_count ||
      1,
  };
};

export type ApprovalRequest =
  components['schemas']['ApprovalRequestResourceWithMetadata'];
export type ApprovalRequestCreateByRoleRequest =
  components['schemas']['ApprovalRequestCreateByRoleRequest'];
export type ApprovalRequestCreateByUserRequest =
  components['schemas']['ApprovalRequestCreateByUserRequest'];
export type ObjectType = components['schemas']['ObjectType'];
export type ApprovalRequestStatus =
  components['schemas']['ApprovalRequestStatus'];
export type PayableStateEnum = components['schemas']['PayableStateEnum'];
export type ApprovalProcessStepResource =
  components['schemas']['ApprovalProcessStepResource'];
