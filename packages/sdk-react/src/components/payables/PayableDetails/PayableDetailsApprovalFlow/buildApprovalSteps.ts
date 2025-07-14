import { components } from '@/api';
import { I18n } from '@lingui/core';

import {
  createApprovalStep,
  createConcurrentApprovalSteps,
} from './approvalStepHelpers';
import {
  findUserApprovalCall,
  findRoleApprovalCall,
  ApprovalStructureItem,
  processApprovalStructure,
  extractStructureItemsFromScriptStep,
} from './approvalStepUtils';
import { ApprovalCallParams } from './approvalStepUtils';

export interface ApprovalCall {
  call: string;
  params?: ApprovalCallParams;
}

export interface ScriptStep {
  all?: ApprovalCall[] | ApprovalStructureItem[];
  then?: ApprovalCall[] | ApprovalStructureItem[];
  if?: ApprovalCall | ApprovalStructureItem;
  run_concurrently?: boolean;
}

export interface ApprovalStep {
  stepNumber: number;
  assignees: string[];
  roleIds: string[];
  assignee?: string;
  type: string;
  status: ApprovalRequestStatus;
  payableStatus: PayableStateEnum;
  isRoleBased: boolean;
}

export function buildApprovalSteps(
  policyScript: ScriptStep[],
  requests: ApprovalRequest[],
  i18n: I18n
): ApprovalStep[] {
  const approvalSteps: ApprovalStep[] = [];

  policyScript.forEach((scriptStep, stepIndex) => {
    const structureItems = extractStructureItemsFromScriptStep(scriptStep);
    const approvalCalls = processApprovalStructure(structureItems);
    const userApprovalCall = findUserApprovalCall(approvalCalls);
    const roleApprovalCall = findRoleApprovalCall(approvalCalls);

    let assignees: string[] = [];
    let roleIds: string[] = [];

    if (userApprovalCall?.params?.user_ids) {
      assignees = userApprovalCall.params.user_ids;
    }

    if (roleApprovalCall?.params?.role_ids) {
      roleIds = roleApprovalCall.params.role_ids;
    }

    if (
      scriptStep.run_concurrently &&
      assignees.length > 0 &&
      roleIds.length > 0
    ) {
      const concurrentSteps = createConcurrentApprovalSteps({
        stepNumber: stepIndex + 1,
        assignees,
        roleIds,
        userApprovalCall,
        roleApprovalCall,
        requests,
        i18n,
      });
      approvalSteps.push(...concurrentSteps);
    } else {
      const isRoleBased = roleIds.length > 0 && assignees.length === 0;
      const step = createApprovalStep({
        stepNumber: stepIndex + 1,
        assignees,
        roleIds,
        userApprovalCall,
        roleApprovalCall,
        requests,
        i18n,
        isRoleBased,
      });
      approvalSteps.push(step);
    }
  });

  return approvalSteps;
}

type ApprovalRequest =
  components['schemas']['ApprovalRequestResourceWithMetadata'];
type ApprovalRequestStatus = components['schemas']['ApprovalRequestStatus'];
type PayableStateEnum = components['schemas']['PayableStateEnum'];
