import { components } from '@/api';
import { ApprovalPoliciesTriggers } from '@/components/approvalPolicies/ApprovalPoliciesTable/components/ApprovalPoliciesTriggers';

interface ApprovalPolicyViewProps {
  /** Approval policy to be displayed */
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
}

export const ApprovalPolicyView = ({
  approvalPolicy,
}: ApprovalPolicyViewProps) => {
  return (
    <div>
      <ApprovalPoliciesTriggers approvalPolicy={approvalPolicy} />
    </div>
  );
};
