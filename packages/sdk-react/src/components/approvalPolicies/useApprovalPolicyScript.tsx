import { components } from '@/api';

export type ApprovalPoliciesScriptTypes =
  'ApprovalRequests.request_approval_by_users';

export interface ApprovalPolicyScript {
  call: ApprovalPoliciesScriptTypes;
  params: {
    user_ids: string[];
    required_approval_count: number | string;
  };
}

interface UseApprovalPolicyScriptProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
}

export const useApprovalPolicyScript = ({
  approvalPolicy,
}: UseApprovalPolicyScriptProps) => {
  const isApprovalPolicyScript = (
    policyScript: unknown
  ): policyScript is ApprovalPolicyScript => {
    if (
      typeof policyScript !== 'object' ||
      policyScript === null ||
      !('call' in policyScript) ||
      !('params' in policyScript)
    ) {
      return false;
    }

    const script = policyScript as { call: unknown; params: unknown };

    if (script.call !== 'ApprovalRequests.request_approval_by_users') {
      return false;
    }

    if (
      typeof script.params !== 'object' ||
      script.params === null ||
      !('user_ids' in script.params) ||
      !('required_approval_count' in script.params)
    ) {
      return false;
    }

    const params = script.params as {
      user_ids: unknown;
      required_approval_count: unknown;
    };

    return (
      Array.isArray(params.user_ids) &&
      (typeof params.required_approval_count === 'number' ||
        typeof params.required_approval_count === 'string')
    );
  };

  if (!isApprovalPolicyScript(approvalPolicy.script[0])) {
    // TODO: display error message
    throw new Error('Approval policy script is not valid');
  }

  const script = {
    type: approvalPolicy.script[0].call,
    params: approvalPolicy.script[0].params,
  };

  return {
    script,
  };
};
