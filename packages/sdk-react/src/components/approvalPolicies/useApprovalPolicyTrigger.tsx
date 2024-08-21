import { components } from '@/api';

interface UseApprovalPolicyTriggerProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
}

type ApprovalPoliciesTriggerName =
  | 'invoice.amount'
  | 'invoice.counterpart_id'
  | 'invoice.currency'
  | 'invoice.was_created_by_user_id'
  | 'invoice.tags'
  | string;

interface ApprovalPoliciesTrigger {
  all: Array<{
    operator?: string;
    left_operand?: { name: ApprovalPoliciesTriggerName };
    right_operand?: { name: string };
  }>;
}

export const useApprovalPolicyTrigger = ({
  approvalPolicy,
}: UseApprovalPolicyTriggerProps) => {
  const isApprovalPolicyTrigger = (
    policyTrigger: unknown
  ): policyTrigger is ApprovalPoliciesTrigger => {
    return Boolean(
      policyTrigger &&
        typeof policyTrigger === 'object' &&
        'all' in policyTrigger &&
        Array.isArray(policyTrigger['all'])
    );
  };

  if (!isApprovalPolicyTrigger(approvalPolicy.trigger)) {
    throw new Error('Approval policy trigger is not valid');
  }

  const triggerNames: ApprovalPoliciesTriggerName[] = approvalPolicy.trigger?.[
    'all'
  ]?.reduce<string[]>((acc, trigger) => {
    if (
      trigger.left_operand &&
      trigger.hasOwnProperty('operator') &&
      trigger.hasOwnProperty('right_operand')
    ) {
      const triggerName: ApprovalPoliciesTriggerName =
        typeof trigger.left_operand === 'object'
          ? trigger.left_operand.name
          : trigger.left_operand;

      return acc.includes(triggerName) ? acc : [...acc, triggerName];
    }

    return acc;
  }, []);

  return {
    triggerNames,
  };
};
