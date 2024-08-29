import { Trans } from '@lingui/macro';

import { UListUiAlt } from './icons/UListUiAlt';
import { UUserCircle } from './icons/UUserCircle';
import { UUsersAlt } from './icons/UUsersAlt';
import { UUserSquare } from './icons/UUserSquare';

/**
 * All options for `call` field in `script` object
 *
 * @see {@link https://docs.monite.com/docs/monitescript#approval-requests}
 */
enum ScriptCallType {
  ByUsers = 'ApprovalRequests.request_approval_by_users',
  ByRoles = 'ApprovalRequests.request_approval_by_roles',
}

interface RuleValueProps {
  call: ScriptCallType;
  params?: {
    user_ids?: string[];
    required_approval_count?: number;
  };
}

interface RuleAllProps {
  all: Array<RuleValueProps>;
}

interface RuleAnyProps {
  any: Array<RuleValueProps>;
}

export type ScriptItemProps = RuleValueProps | RuleAllProps | RuleAnyProps;

const ByUser = ({
  userIds,
  approvalCount,
}: {
  userIds?: string[];
  approvalCount?: number;
}) => {
  return (
    <li>
      {approvalCount && approvalCount === 1 && userIds?.length === 1 && (
        <>
          <UUserCircle width={18} />
          <Trans>Single user</Trans>
        </>
      )}
      {approvalCount && approvalCount > 1 && (
        <>
          <UUsersAlt width={18} />
          <Trans>
            Users from the list
            {approvalCount && approvalCount > 1 ? (
              <>&nbsp;(x{approvalCount})</>
            ) : (
              ''
            )}
          </Trans>
        </>
      )}
    </li>
  );
};

const ByRole = ({ approvalCount }: { approvalCount?: number }) => {
  return (
    <li>
      <UUserSquare width={18} />
      <Trans>
        Role approval
        {approvalCount && approvalCount > 1 ? (
          <>&nbsp;(x{approvalCount})</>
        ) : (
          ''
        )}
      </Trans>
    </li>
  );
};

export const ApprovalChain = () => {
  return (
    <li>
      <UListUiAlt width={18} />
      <Trans>Approval chain</Trans>
    </li>
  );
};

export const ApprovalPoliciesRulesItem = ({
  rule,
}: {
  rule: ScriptItemProps;
}) => {
  /**
   * We have to handle only `&` operator. In Monite Script 2.0 terminology, it's `all`
   * We also have `any` or `|` operator, but we don't support it yet.
   */
  if ('all' in rule) {
    return (
      <>
        {rule.all.map((r, index) => (
          <ApprovalPoliciesRulesItem rule={r} key={index} />
        ))}
      </>
    );
  }

  if (!('call' in rule)) {
    return null;
  }

  const callType: ScriptCallType = rule.call;
  const approvalCount = rule?.params?.required_approval_count;

  switch (callType) {
    case ScriptCallType.ByUsers: {
      return (
        <ByUser userIds={rule.params?.user_ids} approvalCount={approvalCount} />
      );
    }

    case ScriptCallType.ByRoles: {
      return <ByRole approvalCount={approvalCount} />;
    }
  }

  return null;
};
