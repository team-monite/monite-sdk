import {
  useApprovalPolicyScript,
  Rules,
} from '@/components/approvalPolicies/useApprovalPolicyScript';
import type { components } from '@monite/sdk-api/src/api';

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
      {rules &&
        (Object.keys(rules) as Array<keyof Rules>).map((ruleKey) => {
          switch (ruleKey) {
            case 'single_user':
              return (
                <li key={ruleKey}>
                  <UUserCircle width={18} />
                  {getRuleName(ruleKey)}
                </li>
              );
            case 'users_from_list':
              return (
                <li key={ruleKey}>
                  <UUsersAlt width={18} />
                  {getRuleName(ruleKey)}
                </li>
              );
            case 'roles_from_list':
              return (
                <li key={ruleKey}>
                  <UUserSquare width={18} />
                  {getRuleName(ruleKey)}
                </li>
              );
            case 'approval_chain':
              return (
                <li key={ruleKey}>
                  <UListUiAlt width={18} />
                  {getRuleName(ruleKey)}
                </li>
              );
          }
        })}
    </Styled.ColumnList>
  );
};
