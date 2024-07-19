import { useMoniteContext } from '@/core/context/MoniteContext';

export const useApprovalPolicyById = (approvalPolicyId: string | undefined) => {
  const { api } = useMoniteContext();

  return api.approvalPolicies.getApprovalPoliciesId.useQuery(
    {
      path: { approval_policy_id: approvalPolicyId ?? '' },
    },
    {
      enabled: !!approvalPolicyId,
    }
  );
};
