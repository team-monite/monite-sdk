import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export type ApprovalPolicyScriptType =
  | 'single_user'
  | 'users_from_list'
  | 'roles_from_list'
  | 'approval_chain';

interface ApprovalPolicyRule {
  call:
    | 'ApprovalRequests.request_approval_by_users'
    | 'ApprovalRequests.request_approval_by_roles';
  params: {
    user_ids?: string[];
    role_ids?: string[];
    required_approval_count: number;
  };
}

interface ApprovalPolicyNestedRule {
  run_concurrently: boolean;
  all: (ApprovalPolicyRule | ApprovalPolicyNestedRule)[];
}

type ApprovalPolicyScript = [
  {
    if: {
      run_concurrently: boolean;
      all: (ApprovalPolicyRule | ApprovalPolicyNestedRule)[];
    };
    then: string[];
    else: string[];
  }
];

export interface Rules {
  single_user?: {
    userId: string;
  };
  users_from_list?: {
    userIds: string[];
    count: number;
  };
  roles_from_list?: {
    roleIds: string[];
    count: number;
  };
  approval_chain?: {
    chainUserIds: string[];
  };
}

interface UseApprovalPolicyScriptProps {
  approvalPolicy?: components['schemas']['ApprovalPolicyResource'];
}

export const useApprovalPolicyScript = ({
  approvalPolicy,
}: UseApprovalPolicyScriptProps) => {
  const { i18n } = useLingui();

  const isApprovalPolicyRule = (rule: unknown): rule is ApprovalPolicyRule => {
    if (typeof rule !== 'object' || rule === null) return false;

    // Check if 'call' property exists and is of the correct type
    if (!('call' in rule) || typeof rule.call !== 'string') return false;
    if (
      ![
        // eslint-disable-next-line lingui/no-unlocalized-strings
        'ApprovalRequests.request_approval_by_users',
        // eslint-disable-next-line lingui/no-unlocalized-strings
        'ApprovalRequests.request_approval_by_roles',
      ].includes(rule.call)
    ) {
      return false;
    }

    // Check if 'params' property exists and is an object
    if (
      !('params' in rule) ||
      typeof rule.params !== 'object' ||
      rule.params === null
    )
      return false;

    const params = rule.params;

    // Check params properties
    if ('user_ids' in params && !Array.isArray(params.user_ids)) return false;
    if ('role_ids' in params && !Array.isArray(params.role_ids)) return false;
    if (
      !('required_approval_count' in params) ||
      typeof params.required_approval_count !== 'number'
    )
      return false;

    // If all checks pass, it's a valid ApprovalPolicyRule
    return true;
  };

  const isApprovalPolicyNestedRule = (
    rule: unknown
  ): rule is ApprovalPolicyNestedRule => {
    if (typeof rule !== 'object' || rule === null) return false;

    if (
      !('run_concurrently' in rule) ||
      typeof rule.run_concurrently !== 'boolean'
    )
      return false;
    if (!('all' in rule) || !Array.isArray(rule.all)) return false;

    return rule.all.every(
      (item) => isApprovalPolicyRule(item) || isApprovalPolicyNestedRule(item)
    );
  };

  const isApprovalPolicyScript = (
    policyScript: unknown
  ): policyScript is ApprovalPolicyScript => {
    if (!Array.isArray(policyScript) || policyScript.length !== 1) return false;

    const [scriptObject] = policyScript;

    if (typeof scriptObject !== 'object' || scriptObject === null) return false;

    // Check if 'if', 'then', and 'else' properties exist
    if (
      !('if' in scriptObject) ||
      !('then' in scriptObject) ||
      !('else' in scriptObject)
    )
      return false;

    const { if: ifBlock, then: thenBlock, else: elseBlock } = scriptObject;

    // Check if 'if' block is an object
    if (typeof ifBlock !== 'object' || ifBlock === null) return false;

    // Check if 'run_concurrently' and 'all' properties exist in the 'if' block
    if (!('run_concurrently' in ifBlock) || !('all' in ifBlock)) return false;

    const { run_concurrently, all: allBlock } = ifBlock;

    if (typeof run_concurrently !== 'boolean') return false;
    if (!Array.isArray(allBlock)) return false;

    // Check if 'then' and 'else' are arrays
    if (!Array.isArray(thenBlock) || !Array.isArray(elseBlock)) return false;

    return allBlock.every(
      (item) => isApprovalPolicyRule(item) || isApprovalPolicyNestedRule(item)
    );
  };

  const isSingleUserRule = (
    rule: ApprovalPolicyRule
  ): rule is ApprovalPolicyRule & { params: { user_ids: [string] } } => {
    return (
      rule.call === 'ApprovalRequests.request_approval_by_users' &&
      Array.isArray(rule.params.user_ids) &&
      rule.params.user_ids.length === 1 &&
      rule.params.required_approval_count === 1
    );
  };

  const isUsersFromListRule = (
    rule: ApprovalPolicyRule
  ): rule is ApprovalPolicyRule & { params: { user_ids: string[] } } => {
    return (
      rule.call === 'ApprovalRequests.request_approval_by_users' &&
      Array.isArray(rule.params.user_ids) &&
      rule.params.user_ids.length > 1 &&
      rule.params.required_approval_count > 0
    );
  };

  const isRolesFromListRule = (
    rule: ApprovalPolicyRule
  ): rule is ApprovalPolicyRule & { params: { role_ids: string[] } } => {
    return (
      rule.call === 'ApprovalRequests.request_approval_by_roles' &&
      Array.isArray(rule.params.role_ids) &&
      rule.params.role_ids.length >= 1 &&
      rule.params.required_approval_count > 0
    );
  };

  const isApprovalChainRule = (
    rule: ApprovalPolicyNestedRule
  ): rule is ApprovalPolicyNestedRule & { all: ApprovalPolicyRule[] } => {
    return (
      !rule.run_concurrently &&
      rule.all.length > 1 &&
      rule.all.every(
        (item) => isApprovalPolicyRule(item) && isSingleUserRule(item)
      )
    );
  };

  const getRuleName = (ruleType: string) => {
    switch (ruleType) {
      case 'single_user':
        return t(i18n)`Single user`;
      case 'users_from_list':
        return t(i18n)`Users from the list`;
      case 'roles_from_list':
        return t(i18n)`Roles from the list`;
      case 'approval_chain':
        return t(i18n)`Approval chain`;
    }
  };

  const getRuleLabel = (ruleKey: keyof Rules, value?: number) => {
    switch (ruleKey) {
      case 'single_user':
        return t(i18n)`Single user`;
      case 'users_from_list':
        if (value === 1) {
          return t(i18n)`Any user from the list`;
        }
        return t(i18n)`Any ${value} users from the list`;
      case 'roles_from_list':
        return t(i18n)`Any user with role`;
      case 'approval_chain':
        return t(i18n)`All users from list, one by one`;
    }
  };

  if (isApprovalPolicyScript(approvalPolicy?.script)) {
    const rules = approvalPolicy?.script[0].if.all.reduce<Partial<Rules>>(
      (acc, rule) => {
        if (isApprovalPolicyNestedRule(rule)) {
          if (isApprovalChainRule(rule)) {
            return {
              ...acc,
              approval_chain: {
                chainUserIds: rule.all.reduce<string[]>((acc, item) => {
                  if (
                    isApprovalPolicyRule(item) &&
                    isSingleUserRule(item) &&
                    item.params.user_ids[0]
                  ) {
                    const userId = item.params.user_ids[0];

                    if (userId) return [...acc, item.params.user_ids[0]];

                    return acc;
                  }

                  return acc;
                }, []),
              },
            };
          }
        } else if (isApprovalPolicyRule(rule)) {
          if (isSingleUserRule(rule)) {
            return {
              ...acc,
              single_user: {
                userId: rule.params.user_ids[0],
              },
            };
          } else if (isUsersFromListRule(rule)) {
            return {
              ...acc,
              users_from_list: {
                userIds: rule.params.user_ids,
                count: rule.params.required_approval_count,
              },
            };
          } else if (isRolesFromListRule(rule)) {
            return {
              ...acc,
              roles_from_list: {
                roleIds: rule.params.role_ids,
                count: rule.params.required_approval_count,
              },
            };
          }
        }

        return acc;
      },
      {} as Rules
    );

    return {
      rules,
      getRuleName,
      getRuleLabel,
    };
  }

  return {
    rules: undefined,
    getRuleName,
    getRuleLabel,
  };
};
