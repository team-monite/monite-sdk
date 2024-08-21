import type { components } from '@/api';
import { useApprovalPolicyTrigger } from '@/components/approvalPolicies/useApprovalPolicyTrigger';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import * as Styled from '../styles';
import { UBuilding } from './icons/UBuilding';
import { ULabel } from './icons/ULabel';
import { UMoneyBill } from './icons/UMoneyBill';
import { UMoneyStack } from './icons/UMoneyStack';
import { UUserCircle } from './icons/UUserCircle';

interface ApprovalPoliciesTriggersProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
}

export const ApprovalPoliciesTriggers = ({
  approvalPolicy,
}: ApprovalPoliciesTriggersProps) => {
  const { i18n } = useLingui();
  const { triggerNames } = useApprovalPolicyTrigger({ approvalPolicy });

  if (!approvalPolicy) {
    return null;
  }

  return (
    <Styled.ColumnList>
      {triggerNames.map((triggerName, index) => {
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
};
