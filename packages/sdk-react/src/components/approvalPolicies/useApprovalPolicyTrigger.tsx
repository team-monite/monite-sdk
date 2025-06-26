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
  all: Array<
    | {
        operator?: string;
        left_operand?: { name: ApprovalPoliciesTriggerKey };
        right_operand?: string | string[] | number;
      }
    | string
  >;
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
        return t(i18n)`Counterparts`;
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
      triggers: {} as Triggers,
      getTriggerName,
      getTriggerLabel,
      getAmountLabel,
    };
  }

  const triggers = approvalPolicy.trigger?.all?.reduce<Triggers>(
    (acc, trigger) => {
      // Handle string-based triggers (e.g.: for tags, counterpart, user)
      // Parse string triggers like "{'id1' in invoice.tags.id}" or "{invoice.was_created_by_user_id in ['id1']}" or "{invoice.counterpart_id in ['id1', 'id2']}"
      if (typeof trigger === 'string') {
        // Parse string triggers like "{invoice.counterpart_id in ['id1', 'id2']}" or "{invoice.was_created_by_user_id in ['id1']}"
        const arrayMatch = trigger.match(
          /\{invoice\.([^.]+)\.?([^.]*)\s+in\s+\[([^\]]+)\]\}/
        );
        // Parse string triggers like "{'id1' in invoice.tags.id}"
        const singleMatch = trigger.match(
          /\{'([^']+)'\s+in\s+invoice\.([^.]+)\.?([^.]*)\}/
        );

        if (arrayMatch) {
          // Handle array-based triggers (counterpart, user)
          const [, field, idsString] = arrayMatch;
          let triggerKey: ApprovalPoliciesTriggerKey;

          if (field === 'counterpart_id') {
            triggerKey = 'counterpart_id';
          } else if (field === 'was_created_by_user_id') {
            triggerKey = 'was_created_by_user_id';
          } else {
            return acc;
          }

          // Extract IDs from the string, removing quotes
          const ids = idsString
            .split(',')
            .map((id: string) => id.trim().replace(/['"]/g, ''))
            .filter((id: string) => id.length > 0);

          acc[triggerKey] = ids;
        } else if (singleMatch) {
          // Handle single ID triggers (tags)
          const [, id, field, subfield] = singleMatch;

          if (field === 'tags' && subfield === 'id') {
            if (!acc.tags) {
              acc.tags = [];
            }
            acc.tags.push(id);
          }
        }
        return acc;
      }

      // Handle object-based triggers (e.g.: for amount)
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
    triggers,
    getTriggerName,
    getTriggerLabel,
    getAmountLabel,
  };
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
