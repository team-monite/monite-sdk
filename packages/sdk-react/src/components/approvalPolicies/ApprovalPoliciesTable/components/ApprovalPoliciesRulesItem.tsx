import { Trans } from '@lingui/macro';

import { UListUiAlt } from './icons/UListUiAlt';
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

interface IRuleValue {
  call: ScriptCallType;
  params?: {
    required_approval_count?: number;
  };
}

interface IRuleAll {
  all: Array<IRuleValue>;
}

interface IRuleAny {
  any: Array<IRuleValue>;
}

export type IScriptItem = IRuleValue | IRuleAll | IRuleAny;

const ByUser = ({ approvalCount }: { approvalCount?: number }) => {
  return (
    <li>
      <UUsersAlt width={18} />
      <Trans>
        Users from the list
        {approvalCount && approvalCount > 1 ? (
          <>&nbsp;(x{approvalCount})</>
        ) : (
          ''
        )}
      </Trans>
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

export const ApprovalPoliciesRulesItem = ({ rule }: { rule: IScriptItem }) => {
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
      return <ByUser approvalCount={approvalCount} />;
    }

    case ScriptCallType.ByRoles: {
      return <ByRole approvalCount={approvalCount} />;
    }
  }

  return null;
};
