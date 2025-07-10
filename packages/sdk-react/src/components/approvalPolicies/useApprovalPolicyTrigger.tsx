import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import {
  OPERATOR_OPERATIONS,
  ApprovalPolicyTriggers,
  OperatorOperation,
  isValidOperation,
  getTriggerKeyAndValue,
  isValidTriggerKey,
} from './triggerUtils';

export type AmountTuple = [OperatorOperation, string | number];

export type ParsedTriggers = {
  amount?: {
    currency: CurrencyEnum;
    value: AmountTuple[];
  };
  counterpart_id?: string[];
  was_created_by_user_id?: string[];
  tags?: string[];
};

type ParsedTriggerKeys = keyof ParsedTriggers;

interface UseApprovalPolicyTriggerProps {
  approvalPolicy?: components['schemas']['ApprovalPolicyResource'];
}

export const useApprovalPolicyTrigger = ({
  approvalPolicy,
}: UseApprovalPolicyTriggerProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  const getTriggerName = (triggerKey: ParsedTriggerKeys) => {
    switch (triggerKey) {
      case 'amount':
        return t(i18n)`Amount`;
      case 'was_created_by_user_id':
        return t(i18n)`Created by user`;
      case 'counterpart_id':
        return t(i18n)`Counterparts`;
      case 'tags':
        return t(i18n)`Tags`;
      default:
        return triggerKey;
    }
  };

  const getTriggerLabel = (triggerKey: ParsedTriggerKeys) => {
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
        case OPERATOR_OPERATIONS.GREATER_THAN:
          return t(i18n)`Greater than ${formattedValue}`;
        case OPERATOR_OPERATIONS.GREATER_THAN_OR_EQUAL:
          return t(i18n)`Greater than or equal to ${formattedValue}`;
        case OPERATOR_OPERATIONS.LESS_THAN:
          return t(i18n)`Less than ${formattedValue}`;
        case OPERATOR_OPERATIONS.LESS_THAN_OR_EQUAL:
          return t(i18n)`Less than or equal to ${formattedValue}`;
        case OPERATOR_OPERATIONS.EQUALS:
          return t(i18n)`Equal to ${formattedValue}`;
        default:
          return formattedValue;
      }
    }

    if (amountValue.length === 2) {
      const leftRange = amountValue.find(
        (value) => value[0] === OPERATOR_OPERATIONS.GREATER_THAN_OR_EQUAL
      );
      const rightRange = amountValue.find(
        (value) => value[0] === OPERATOR_OPERATIONS.LESS_THAN_OR_EQUAL
      );

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
  ): policyTrigger is ApprovalPolicyTriggers => {
    return Boolean(
      policyTrigger &&
        typeof policyTrigger === 'object' &&
        'all' in policyTrigger &&
        Array.isArray(policyTrigger['all'])
    );
  };

  if (!isApprovalPolicyTrigger(approvalPolicy?.trigger)) {
    return {
      triggers: {} as ParsedTriggers,
      getTriggerName,
      getTriggerLabel,
      getAmountLabel,
    };
  }

  const triggers = approvalPolicy.trigger?.all?.reduce<ParsedTriggers>(
    (acc, trigger) => {
      // Skip triggers that don't have the required properties
      if (
        typeof trigger === 'string' ||
        !trigger.operator ||
        !trigger.left_operand ||
        !trigger.right_operand
      ) {
        return acc;
      }

      const { key, value } = getTriggerKeyAndValue(trigger);

      if (!key || !value) {
        return acc;
      }

      if (!isValidTriggerKey(key)) {
        return acc;
      }

      switch (key) {
        case 'amount':
          if (
            (typeof value === 'string' || typeof value === 'number') &&
            isValidOperation(trigger.operator)
          ) {
            if (!acc.amount) {
              acc.amount = { currency: 'EUR', value: [] };
            }
            acc.amount.value.push([trigger.operator, value]);
          }
          break;
        case 'currency':
          if (!acc.amount) {
            acc.amount = {
              value: [],
              currency: value as CurrencyEnum,
            };
          } else {
            acc.amount.currency = value as CurrencyEnum;
          }
          break;
        case 'tags.id':
          if (typeof value === 'string') {
            if (!acc.tags) {
              acc.tags = [];
            }
            acc.tags.push(value);
          }
          break;
        case 'counterpart_id':
        case 'was_created_by_user_id':
          if (Array.isArray(value)) {
            acc[key] = value;
          }
          break;
      }

      return acc;
    },
    {} as ParsedTriggers
  );

  return {
    triggers,
    getTriggerName,
    getTriggerLabel,
    getAmountLabel,
  };
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
