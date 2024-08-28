import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export type ApprovalPoliciesTriggerKey =
  | 'amount'
  | 'counterpart_id'
  | 'was_created_by_user_id'
  | 'tags';

interface ApprovalPoliciesTrigger {
  all: Array<{
    operator?: string;
    left_operand?: { name: ApprovalPoliciesTriggerKey };
    right_operand?: string | string[] | number;
  }>;
}

export type AmountTuple = [ApprovalPoliciesOperator, string | number];

export type Triggers = {
  counterpart_id?: string[];
  was_created_by_user_id?: string[];
  tags?: string[];
  amount?: AmountTuple[];
};

export type ApprovalPoliciesOperator = '>' | '<' | '>=' | '<=' | '==' | 'range';

interface UseApprovalPolicyTriggerProps {
  approvalPolicy?: components['schemas']['ApprovalPolicyResource'];
}

const isValidTriggerKey = (key: string): key is ApprovalPoliciesTriggerKey => {
  return [
    'amount',
    'counterpart_id',
    'was_created_by_user_id',
    'tags',
  ].includes(key);
};

const isValidOperator = (
  operator: string
): operator is ApprovalPoliciesOperator =>
  ['>', '<', '>=', '<=', '==', 'range'].includes(operator);

export const useApprovalPolicyTrigger = ({
  approvalPolicy,
}: UseApprovalPolicyTriggerProps) => {
  const { i18n } = useLingui();

  const getTriggerName = (triggerKey: ApprovalPoliciesTriggerKey) => {
    switch (triggerKey) {
      case 'amount':
        return t(i18n)`Amount`;
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

  const getAmountLabel = (amountValue: AmountTuple[]) => {
    if (amountValue.length === 1) {
      switch (amountValue[0][0]) {
        case '>':
          return t(i18n)`Greater than ${amountValue[0][1]}`;
        case '>=':
          return t(i18n)`Greater than or equal to ${amountValue[0][1]}`;
        case '<':
          return t(i18n)`Less than ${amountValue[0][1]}`;
        case '<=':
          return t(i18n)`Less than or equal to ${amountValue[0][1]}`;
        case '==':
          return t(i18n)`Equal to ${amountValue[0][1]}`;
        default:
          return amountValue[0][1];
      }
    }

    if (amountValue.length === 2) {
      const leftRange = amountValue.find((value) => value[0] === '>=');
      const rightRange = amountValue.find((value) => value[0] === '<=');

      if (leftRange && rightRange) {
        return t(i18n)`${leftRange[1]} - ${rightRange[1]}`;
      }
    }

    return amountValue[0][1];
  };

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

  if (!isApprovalPolicyTrigger(approvalPolicy?.trigger)) {
    // TODO: display error message
    return {
      triggerKeys: [],
      triggers: {} as Triggers,
      getTriggerName,
      getTriggerLabel,
      getAmountLabel,
    };
  }

  const triggerKeys: ApprovalPoliciesTriggerKey[] =
    approvalPolicy.trigger?.all?.reduce<ApprovalPoliciesTriggerKey[]>(
      (acc, trigger) => {
        if (
          trigger.left_operand &&
          trigger.hasOwnProperty('operator') &&
          trigger.hasOwnProperty('right_operand')
        ) {
          const rawTriggerKey =
            typeof trigger.left_operand === 'object'
              ? trigger.left_operand.name.replace('invoice.', '')
              : trigger.left_operand;

          if (
            isValidTriggerKey(rawTriggerKey) &&
            !acc.includes(rawTriggerKey)
          ) {
            return [...acc, rawTriggerKey];
          }
        }

        return acc;
      },
      []
    );

  const triggers = approvalPolicy.trigger?.all?.reduce<Triggers>(
    (acc, trigger) => {
      if (
        trigger.left_operand &&
        trigger.hasOwnProperty('operator') &&
        trigger.hasOwnProperty('right_operand') &&
        typeof trigger.left_operand === 'object' &&
        trigger.left_operand.hasOwnProperty('name')
      ) {
        const rawTriggerKey = trigger.left_operand.name.replace('invoice.', '');

        if (
          isValidTriggerKey(rawTriggerKey) &&
          trigger.operator &&
          trigger.right_operand
        ) {
          if (rawTriggerKey === 'amount') {
            if (
              (typeof trigger.right_operand === 'string' ||
                typeof trigger.right_operand === 'number') &&
              isValidOperator(trigger.operator)
            ) {
              acc['amount'] = [
                ...(acc['amount'] ?? []),
                [trigger.operator, trigger.right_operand],
              ];
            }
          } else if (Array.isArray(trigger.right_operand)) {
            acc[rawTriggerKey] = trigger.right_operand;
          }
        }
      }

      return acc;
    },
    {} as Triggers
  );

  return {
    triggerKeys,
    triggers,
    getTriggerName,
    getTriggerLabel,
    getAmountLabel,
  };
};
