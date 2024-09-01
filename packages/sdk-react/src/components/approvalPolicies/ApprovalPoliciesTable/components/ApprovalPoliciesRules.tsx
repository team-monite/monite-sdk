import type { components } from '@/api';
import { useApprovalPolicyScript } from '@/components/approvalPolicies/useApprovalPolicyScript';

import { UListUiAlt } from '../components/icons/UListUiAlt';
import { UUserCircle } from '../components/icons/UUserCircle';
import { UUsersAlt } from '../components/icons/UUsersAlt';
import { UUserSquare } from '../components/icons/UUserSquare';
import * as Styled from '../styles';

interface ApprovalPoliciesRulesProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
}

export const ApprovalPoliciesRules = ({
  approvalPolicy,
}: ApprovalPoliciesRulesProps) => {
  const { rules, getRuleName } = useApprovalPolicyScript({ approvalPolicy });

  if (!approvalPolicy) {
    return null;
  }

  return (
    <Styled.ColumnList>
      {rules?.map((rule) => {
        switch (rule?.type) {
          case 'single_user':
            return (
              <li key={rule.type}>
                <UUserCircle width={18} />
                {getRuleName(rule.type)}
              </li>
            );
          case 'users_from_list':
            return (
              <li key={rule.type}>
                <UUsersAlt width={18} />
                {getRuleName(rule.type)}
              </li>
            );
          case 'roles_from_list':
            return (
              <li key={rule.type}>
                <UUserSquare width={18} />
                {getRuleName(rule.type)}
              </li>
            );
          case 'approval_chain':
            return (
              <li key={rule.type}>
                <UListUiAlt width={18} />
                {getRuleName(rule.type)}
              </li>
            );
        }
      })}
    </Styled.ColumnList>
  );
};
