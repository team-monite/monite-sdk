import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

interface UseApprovalPolicyTriggerProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
}

type ApprovalPoliciesTriggerKey =
  | 'amount'
  | 'counterpart_id'
  | 'currency'
  | 'was_created_by_user_id'
  | 'tags'
  | string;

interface ApprovalPoliciesTrigger {
  all: Array<{
    operator?: string;
    left_operand?: { name: ApprovalPoliciesTriggerKey };
    right_operand?: string | string[];
  }>;
}

interface Triggers {
  [key: ApprovalPoliciesTriggerKey]: string | string[];
}

export const useApprovalPolicyTrigger = ({
  approvalPolicy,
}: UseApprovalPolicyTriggerProps) => {
  const { i18n } = useLingui();

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
    // TODO: display error message
    throw new Error('Approval policy trigger is not valid');
  }

  const triggerKeys: ApprovalPoliciesTriggerKey[] =
    approvalPolicy.trigger?.all?.reduce<string[]>((acc, trigger) => {
      if (
        trigger.left_operand &&
        trigger.hasOwnProperty('operator') &&
        trigger.hasOwnProperty('right_operand')
      ) {
        const triggerKey: ApprovalPoliciesTriggerKey =
          typeof trigger.left_operand === 'object'
            ? trigger.left_operand.name.replace('invoice.', '')
            : trigger.left_operand;

        return acc.includes(triggerKey) ? acc : [...acc, triggerKey];
      }

      return acc;
    }, []);

  const triggers = approvalPolicy.trigger?.all?.reduce<Triggers>(
    (acc, trigger) => {
      if (
        trigger.left_operand &&
        trigger.hasOwnProperty('operator') &&
        trigger.hasOwnProperty('right_operand') &&
        typeof trigger.left_operand === 'object' &&
        trigger.left_operand.hasOwnProperty('name')
      ) {
        const triggerKey: ApprovalPoliciesTriggerKey =
          trigger.left_operand.name.replace('invoice.', '');

        if (triggerKey && trigger.right_operand) {
          acc[triggerKey] = trigger.right_operand;
        }
      }

      return acc;
    },
    {}
  );

  const getTriggerName = (triggerKey: ApprovalPoliciesTriggerKey) => {
    switch (triggerKey) {
      case 'amount':
        return t(i18n)`Amount`;
      case 'currency':
        return t(i18n)`Currency`;
      case 'was_created_by_user_id':
        return t(i18n)`Created by user`;
      case 'counterpart_id':
        return t(i18n)`Counterpart`;
      case 'tags':
        return t(i18n)`Tags`;
      default:
        return triggerKey;
    }
  };

  const getTriggerLabel = (triggerKey: ApprovalPoliciesTriggerKey) => {
    switch (triggerKey) {
      case 'amount':
        return t(i18n)`Amount`;
      case 'currency':
        return t(i18n)`Currency`;
      case 'was_created_by_user_id':
        return t(i18n)`Created by`;
      case 'counterpart_id':
        return t(i18n)`Counterparts`;
      case 'tags':
        return t(i18n)`Has tags`;
      default:
        return triggerKey;
    }
  };

  return {
    triggerKeys,
    triggers,
    getTriggerName,
    getTriggerLabel,
  };
};
