import { useMemo } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useLingui } from '@lingui/react';

import {
  type EnhancedApprovalStep,
  ApprovalStepResolver,
} from './ApprovalStepResolver';
import {
  findUserApprovalCall,
  processApprovalStructure,
  extractStructureItemsFromScriptStep,
} from './approvalStepUtils';
import { type ScriptStep } from './buildApprovalSteps';

export interface ResolvedApprovalStep extends EnhancedApprovalStep {
  resolvedUsers: (EntityUser | undefined)[];
  resolvedRoles: (RoleResponse | undefined)[];
  roleNames: string[];
  userNames: string[];
}

/**
 * Base hook that handles the core logic for resolving approval steps
 * @param payableId - The payable ID for fetching approval requests
 * @param policyId - The approval policy ID for fetching policy details
 * @param order - The order for fetching approval requests (default: 'desc')
 * @returns Resolved approval steps with user and role information
 */
function useResolvedApprovalStepsBase(
  payableId: string,
  policyId: string,
  order: 'asc' | 'desc' = 'desc'
) {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const { data: approvalRequests, isLoading: isLoadingRequests } =
    api.approvalRequests.getApprovalRequests.useQuery({
      query: {
        object_id: payableId,
        object_type: 'payable',
        limit: 50,
        order,
      },
    });

  const { data: approvalPolicyDetails, isLoading: isLoadingPolicy } =
    api.approvalPolicies.getApprovalPoliciesId.useQuery({
      path: { approval_policy_id: policyId },
    });

  const requests = useMemo(
    () => approvalRequests?.data || [],
    [approvalRequests]
  );
  const policyScript = useMemo(
    () => (approvalPolicyDetails?.script || []) as ScriptStep[],
    [approvalPolicyDetails]
  );

  const enhancedSteps = useMemo(() => {
    if (!policyScript.length || !requests) return [];

    const resolver = new ApprovalStepResolver(policyScript, requests, i18n);

    return resolver.buildCompleteSteps();
  }, [policyScript, requests, i18n]);

  const allUserIds = useMemo(() => {
    const userIds = new Set<string>();

    policyScript.forEach((scriptStep) => {
      const structureItems = extractStructureItemsFromScriptStep(scriptStep);
      const approvalCalls = processApprovalStructure(structureItems);
      const userApprovalCall = findUserApprovalCall(approvalCalls);

      if (userApprovalCall?.params?.user_ids) {
        userApprovalCall.params.user_ids.forEach((userId: string) =>
          userIds.add(userId)
        );
      }
    });

    enhancedSteps.forEach((step) => {
      step.actualAssignees.forEach((userId) => userIds.add(userId));
    });

    return Array.from(userIds);
  }, [policyScript, enhancedSteps]);

  const allRoleIds = useMemo(() => {
    const ids = new Set<string>();

    enhancedSteps.forEach((step) => {
      if (step.isRoleBased) {
        step.roleIds.forEach((id) => ids.add(id));
      }
    });

    return Array.from(ids);
  }, [enhancedSteps]);

  const { data: entityUsers, isLoading: isLoadingUsers } =
    api.entityUsers.getEntityUsers.useQuery(
      {
        query: {
          id__in: allUserIds.length > 0 ? allUserIds : undefined,
          limit: 100,
        },
      },
      {
        enabled: allUserIds.length > 0,
      }
    );

  const { data: rolesData, isLoading: isLoadingRoles } =
    api.roles.getRoles.useQuery(
      {
        query: {
          id__in: allRoleIds.length > 0 ? allRoleIds : undefined,
        },
      },
      {
        enabled: allRoleIds.length > 0,
      }
    );

  const userDataMap = useMemo(() => {
    const map = new Map<string, EntityUser>();

    if (entityUsers?.data) {
      entityUsers.data.forEach((user) => {
        map.set(user.id, user);
      });
    }

    return map;
  }, [entityUsers]);

  const roleDataMap = useMemo(() => {
    const map = new Map<string, RoleResponse>();

    rolesData?.data?.forEach((role) => {
      map.set(role.id, role);
    });

    return map;
  }, [rolesData]);

  const resolvedSteps: ResolvedApprovalStep[] = useMemo(
    () =>
      enhancedSteps.map((step) => ({
        ...step,
        resolvedUsers: step.actualAssignees.map((id) => userDataMap.get(id)),
        resolvedRoles: step.roleIds.map((id) => roleDataMap.get(id)),
        roleNames: step.roleIds.map((id) => {
          const role = roleDataMap.get(id);
          return role?.name || id;
        }),
        userNames: step.actualAssignees.map((id) => {
          const user = userDataMap.get(id);
          if (!user) return id;

          const fullName = `${user.first_name || ''} ${
            user.last_name || ''
          }`.trim();
          return fullName || user.email || user.login || id;
        }),
      })),
    [enhancedSteps, userDataMap, roleDataMap]
  );

  const isLoading =
    isLoadingRequests || isLoadingPolicy || isLoadingUsers || isLoadingRoles;

  return {
    steps: resolvedSteps,
    isLoading,
    error: null,
  };
}

/**
 * Hook for resolving approval steps using payableId as the policy ID
 * @param payableId - The payable ID (also used as policy ID)
 * @returns Resolved approval steps with user and role information
 */
export function useResolvedApprovalSteps(payableId: string) {
  return useResolvedApprovalStepsBase(payableId, payableId, 'desc');
}

/**
 * Hook for resolving approval steps with a specific approval policy
 * @param payableId - The payable ID for fetching approval requests
 * @param approvalPolicy - The approval policy resource containing the policy ID
 * @returns Resolved approval steps with user and role information
 */
export function useResolvedApprovalStepsWithPolicy(
  payableId: string,
  approvalPolicy: ApprovalPolicyResource
) {
  return useResolvedApprovalStepsBase(payableId, approvalPolicy.id, 'desc');
}

type EntityUser = components['schemas']['EntityUserResponse'];
type RoleResponse = components['schemas']['RoleResponse'];
type ApprovalPolicyResource = components['schemas']['ApprovalPolicyResource'];
