import { useApprovalPolicyById } from '@/core/queries';

import * as Styled from '../styles';
import {
  ApprovalChain,
  ApprovalPoliciesRulesItem,
  IScriptItem,
} from './ApprovalPoliciesRulesItem';

interface IApprovalPoliciesRulesProps {
  approvalPolicyId: string;
}

export const ApprovalPoliciesRules = ({
  approvalPolicyId,
}: IApprovalPoliciesRulesProps) => {
  const { data: approvalPolicy } = useApprovalPolicyById(approvalPolicyId);

  if (!approvalPolicy) {
    return null;
  }

  return (
    <Styled.ColumnList>
      {approvalPolicy.script.length > 1 ? (
        <ApprovalChain />
      ) : (
        isScriptItem(approvalPolicy.script[0]) && (
          <ApprovalPoliciesRulesItem rule={approvalPolicy.script[0]} />
        )
      )}
    </Styled.ColumnList>
  );
};

const isScriptItem = (
  scriptItem: IScriptItem | unknown
): scriptItem is IScriptItem => {
  if (!scriptItem) return false;
  if (typeof scriptItem !== 'object') return false;
  return 'call' in scriptItem || 'all' in scriptItem || 'any' in scriptItem;
};
