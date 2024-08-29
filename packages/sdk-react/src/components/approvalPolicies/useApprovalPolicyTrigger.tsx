import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export type ApprovalPoliciesTriggerKey =
  | 'amount'
  | 'currency'
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
  amount?: {
    currency: CurrencyEnum;
    value: AmountTuple[];
  };
  counterpart_id?: string[];
  was_created_by_user_id?: string[];
  tags?: string[];
};

export type ApprovalPoliciesOperator = '>' | '<' | '>=' | '<=' | '==' | 'range';

interface UseApprovalPolicyTriggerProps {
  approvalPolicy?: components['schemas']['ApprovalPolicyResource'];
}

const isValidTriggerKey = (key: string): key is ApprovalPoliciesTriggerKey => {
  return [
    'amount',
    'currency',
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
  const { formatCurrencyToDisplay } = useCurrencies();

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

  const getAmountLabel = (
    amountValue: AmountTuple[],
    currency: CurrencyEnum
  ) => {
    const formattedValue = formatCurrencyToDisplay(amountValue[0][1], currency);

    if (amountValue.length === 1) {
      switch (amountValue[0][0]) {
        case '>':
          return t(i18n)`Greater than ${formattedValue}`;
        case '>=':
          return t(i18n)`Greater than or equal to ${formattedValue}`;
        case '<':
          return t(i18n)`Less than ${formattedValue}`;
        case '<=':
          return t(i18n)`Less than or equal to ${formattedValue}`;
        case '==':
          return t(i18n)`Equal to ${formattedValue}`;
        default:
          return formattedValue;
      }
    }

    if (amountValue.length === 2) {
      const leftRange = amountValue.find((value) => value[0] === '>=');
      const rightRange = amountValue.find((value) => value[0] === '<=');

      if (leftRange && rightRange) {
        return t(i18n)`${formatCurrencyToDisplay(
          leftRange[1],
          currency
        )} - ${formatCurrencyToDisplay(rightRange[1], currency)}`;
      }
    }

    return formattedValue;
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
          let rawTriggerKey =
            typeof trigger.left_operand === 'object'
              ? trigger.left_operand.name.replace('invoice.', '')
              : trigger.left_operand;

          if (rawTriggerKey === 'tags.id') {
            rawTriggerKey = 'tags';
          }

          // skip `currency` trigger because it is a part of `amount` trigger
          if (rawTriggerKey === 'currency') {
            return acc;
          }

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
        let rawTriggerKey = trigger.left_operand.name.replace('invoice.', '');

        if (rawTriggerKey === 'tags.id') {
          rawTriggerKey = 'tags';
        }

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
              acc['amount'] = {
                currency: 'EUR',
                value: [
                  ...(acc['amount']?.value ?? []),
                  [trigger.operator, trigger.right_operand],
                ],
              };
            }
          } else if (rawTriggerKey === 'currency') {
            acc['amount'] = {
              value: [...(acc['amount']?.value || [])],
              currency: trigger.right_operand as CurrencyEnum,
            };
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

type CurrencyEnum = components['schemas']['CurrencyEnum'];
