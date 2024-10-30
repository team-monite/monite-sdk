import {
  useApprovalPolicyTrigger,
  Triggers,
} from '@/components/approvalPolicies/useApprovalPolicyTrigger';
import type { components } from '@monite/sdk-api/src/api';

import * as Styled from '../styles';
import { UBuilding } from './icons/UBuilding';
import { ULabel } from './icons/ULabel';
import { UMoneyBill } from './icons/UMoneyBill';
import { UUserCircle } from './icons/UUserCircle';

interface ApprovalPoliciesTriggersProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
}

export const ApprovalPoliciesTriggers = ({
  approvalPolicy,
}: ApprovalPoliciesTriggersProps) => {
  const { triggers, getTriggerName } = useApprovalPolicyTrigger({
    approvalPolicy,
  });

  if (!approvalPolicy) {
    return null;
  }

  return (
    <Styled.ColumnList>
      {(Object.keys(triggers) as Array<keyof Triggers>).map((triggerKey) => {
        switch (triggerKey) {
          case 'amount': {
            return (
              <li key={triggerKey}>
                <UMoneyBill width={18} />
                {getTriggerName(triggerKey)}
              </li>
            );
          }

          case 'was_created_by_user_id': {
            return (
              <li key={triggerKey}>
                <UUserCircle width={18} />
                {getTriggerName(triggerKey)}
              </li>
            );
          }

          case 'counterpart_id': {
            return (
              <li key={triggerKey}>
                <UBuilding width={18} />
                {getTriggerName(triggerKey)}
              </li>
            );
          }

          case 'tags': {
            return (
              <li key={triggerKey}>
                <ULabel width={18} />
                {getTriggerName(triggerKey)}
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
