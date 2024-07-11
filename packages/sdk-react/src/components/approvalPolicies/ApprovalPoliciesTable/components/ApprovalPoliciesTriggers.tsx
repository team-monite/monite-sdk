'use client';

import React from 'react';

import { useApprovalPolicyById } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import * as Styled from '../styles';
import { UBuilding } from './icons/UBuilding';
import { ULabel } from './icons/ULabel';
import { UMoneyBill } from './icons/UMoneyBill';
import { UMoneyStack } from './icons/UMoneyStack';
import { UUserCircle } from './icons/UUserCircle';

interface ApprovalPoliciesTriggersProps {
  approvalPolicyId: string;
}

type IApprovalPoliciesTriggerName =
  | 'invoice.amount'
  | 'invoice.counterpart_id'
  | 'invoice.currency'
  | 'invoice.was_created_by_user_id'
  | 'invoice.tags'
  | string;

export const ApprovalPoliciesTriggers = ({
  approvalPolicyId,
}: ApprovalPoliciesTriggersProps) => {
  const { i18n } = useLingui();
  const { data: approvalPolicy } = useApprovalPolicyById(approvalPolicyId);

  if (!approvalPolicy) {
    return null;
  }

  if (
    typeof approvalPolicy.trigger === 'object' &&
    approvalPolicy.trigger['all'] &&
    Array.isArray(approvalPolicy.trigger['all'])
  ) {
    const uniqueTriggerNames: Array<IApprovalPoliciesTriggerName> =
      approvalPolicy.trigger['all'].reduce((acc, trigger) => {
        if (
          trigger.hasOwnProperty('left_operand') &&
          trigger.hasOwnProperty('operator') &&
          trigger.hasOwnProperty('right_operand')
        ) {
          const triggerName: IApprovalPoliciesTriggerName =
            typeof trigger.left_operand === 'object'
              ? trigger.left_operand.name
              : trigger.left_operand;

          return acc.includes(triggerName) ? acc : [...acc, triggerName];
        }

        return acc;
      }, []);

    return (
      <Styled.ColumnList>
        {uniqueTriggerNames.map((triggerName, index) => {
          switch (triggerName) {
            case 'invoice.amount': {
              return (
                <li key={index}>
                  <UMoneyBill width={18} />
                  {t(i18n)`Amount`}
                </li>
              );
            }

            case 'invoice.currency': {
              return (
                <li key={index}>
                  <UMoneyStack width={18} />
                  {t(i18n)`Currency`}
                </li>
              );
            }

            case 'invoice.was_created_by_user_id': {
              return (
                <li key={index}>
                  <UUserCircle width={18} />
                  {t(i18n)`Created by user`}
                </li>
              );
            }

            case 'invoice.counterpart_id': {
              return (
                <li key={index}>
                  <UBuilding width={18} />
                  {t(i18n)`Counterparts`}
                </li>
              );
            }

            case 'invoice.tags': {
              return (
                <li key={index}>
                  <ULabel width={18} />
                  {t(i18n)`Tags`}
                </li>
              );
            }

            default:
              return null;
          }
        })}
      </Styled.ColumnList>
    );
  }

  return null;
};
