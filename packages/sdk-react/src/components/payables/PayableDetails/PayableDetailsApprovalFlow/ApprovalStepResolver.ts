import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import {
  ApprovalStructureItem,
  getApprovalRuleLabel,
  findUserApprovalCall,
  findRoleApprovalCall,
  extractApprovalCalls,
  resolveStepForCall,
  createBaseApprovalStep,
  createChainApprovalStep,
  processChainApprovalCalls,
  extractItemsFromScriptStep,
  type ProcessedApprovalStep,
} from './approvalStepUtils';
import { ScriptStep } from './buildApprovalSteps';

export interface EnhancedApprovalStep {
  stepNumber: number;
  type: string;
  assignee?: string;
  assignees: string[];
  roleIds: string[];
  status: ApprovalRequestStatus;
  payableStatus: PayableStateEnum;
  isRoleBased: boolean;
  actualAssignees: string[];
  hasActiveRequests: boolean;
  requestIds: string[];
  approvalRequestId?: string;
  approvedBy?: string[];
  objectId?: string;
  rejectedBy?: string;
  requiredApprovalCount?: number;
}

export class ApprovalStepResolver {
  constructor(
    private policyScript: ScriptStep[],
    private requests: ApprovalRequest[],
    private i18n: I18n
  ) {}

  private processApprovalItem(
    item: ApprovalStructureItem,
    stepNumber: number
  ): EnhancedApprovalStep {
    const approvalCalls = extractApprovalCalls(item);
    const userApprovalCall = findUserApprovalCall(approvalCalls);
    const roleApprovalCall = findRoleApprovalCall(approvalCalls);
    const stepType = getApprovalRuleLabel(
      userApprovalCall,
      roleApprovalCall,
      this.i18n
    );

    if (approvalCalls.length > 1 && userApprovalCall) {
      const { allChainUserIds, allChainRequests } = processChainApprovalCalls(
        approvalCalls,
        this.requests
      );
      const chainTypeLabel = t(this.i18n)`All users from the list`;

      return createChainApprovalStep(
        allChainUserIds,
        allChainRequests,
        stepNumber,
        chainTypeLabel
      );
    } else {
      const firstCall = approvalCalls[0];

      if (firstCall) {
        const processedStep = resolveStepForCall(firstCall, this.requests);

        return createBaseApprovalStep(processedStep, stepNumber, stepType);
      }

      const emptyProcessedStep: ProcessedApprovalStep = {
        assignees: [],
        roleIds: [],
        actualAssignees: [],
        relatedRequests: [],
        isRoleBased: false,
        stepStatus: 'waiting',
        approvalRequestId: undefined,
        approvedBy: undefined,
        objectId: undefined,
        rejectedBy: undefined,
        requiredApprovalCount: 1,
      };

      return createBaseApprovalStep(emptyProcessedStep, stepNumber, stepType);
    }
  }

  buildCompleteSteps(): EnhancedApprovalStep[] {
    const steps: EnhancedApprovalStep[] = [];
    let stepNumber = 1;

    this.policyScript.forEach((scriptStep) => {
      const itemsToProcess = extractItemsFromScriptStep(scriptStep);

      if (itemsToProcess.length > 0) {
        itemsToProcess.forEach((item) => {
          const step = this.processApprovalItem(item, stepNumber);
          steps.push(step);
        });
        stepNumber++;
      }
    });

    return steps;
  }
}

type ApprovalRequest =
  components['schemas']['ApprovalRequestResourceWithMetadata'];
type ApprovalRequestStatus = components['schemas']['ApprovalRequestStatus'];
type PayableStateEnum = components['schemas']['PayableStateEnum'];
