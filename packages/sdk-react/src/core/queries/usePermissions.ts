'use client';

import {
  ActionEnum,
  ActionSchema,
  PayableActionEnum,
  PayableActionSchema,
  PermissionEnum,
} from '@monite/sdk-api';

import {
  useEntityUserByAuthToken,
  useEntityUserRoleByAuthToken,
} from './useEntityUsers';

export const COMMON_PERMISSIONS_OBJECTS_TYPES = [
  'person',
  'onboarding',
  'comment',
  'counterpart',
  'entity_user',
  'entity',
  'entity_vat_ids',
  'counterpart_vat_id',
  'entity_bank_account',
  'export',
  'payables_purchase_order',
  'payment_reminder',
  'overdue_reminder',
  'product',
  'receivable',
  'reconciliation',
  'role',
  'tag',
  'todo_task',
  'todo_task_mute',
  'transaction',
  'workflow',
  'approval_request',
  'approval_policy',
  'payment_record',
] as const;

export const PAYABLE_PERMISSIONS_OBJECTS_TYPES = ['payable'] as const;

export type commonPermissionsObjectType =
  | 'person'
  | 'onboarding'
  | 'comment'
  | 'counterpart'
  | 'entity_user'
  | 'entity'
  | 'entity_vat_ids'
  | 'counterpart_vat_id'
  | 'entity_bank_account'
  | 'export'
  | 'payables_purchase_order'
  | 'payment_reminder'
  | 'overdue_reminder'
  | 'product'
  | 'receivable'
  | 'reconciliation'
  | 'role'
  | 'tag'
  | 'todo_task'
  | 'todo_task_mute'
  | 'transaction'
  | 'workflow'
  | 'approval_request'
  | 'approval_policy'
  | 'payment_record';

export type payablePermissionsObjectType = 'payable';

type CommonOperator = {
  method: commonPermissionsObjectType;
  action: ActionEnum;
};

type PayableOperator = {
  method: payablePermissionsObjectType;
  action: PayableActionEnum;
};

type IsActionAllowedType = { entityUserId?: string } & (
  | PayableOperator
  | CommonOperator
);

interface PermissionMap
  extends Record<CommonOperator['method'], Array<ActionSchema>> {
  payable: Array<PayableActionSchema>;
}

/**
 * ## Example
 * ```tsx
 * useIsActionAllowed('workflow', ActionEnum.CREATE);
 * useIsActionAllowed('payable', PayableActionEnum.CREATE);
 * useIsActionAllowed('payable', PayableActionEnum.CREATE, '5b4daced-6b9a-4707-83c6-08193d999fab');
 * ```
 * @param method What method we would like to check permissions for (payable, counterpart, etc.)
 * @param action What action we would like to check (create, update, delete, etc.)
 * @param entityUserId? What user we would like to check permissions for.
 *    It's important for permission status `ALLOWED_FOR_OWN`
 *
 * @returns `true` if action is allowed, `false` otherwise.
 *    Also returns `false` if `entityUserId` is not provided
 *    and backend status is `ALLOWED_FOR_OWN`
 */
export function useIsActionAllowed({
  method,
  action,
  entityUserId,
}: IsActionAllowedType) {
  const {
    data: actions,
    userIdFromAuthToken,
    ...rest
  } = usePermissions(method);

  return {
    ...rest,
    data: isActionAllowed({
      action,
      actions,
      entityUserId,
      entityUserIdFromAuthToken: userIdFromAuthToken,
    }),
  };
}

/**
 * Checks if the action is allowed for the given entity user.
 *
 * @param action Action to check, e.g. `create`, `update`, `delete`, etc.
 * @param entityUserId Entity user identifier to check permissions for, e.g. `invoice.entityUserId`
 * @param entityUserIdFromAuthToken Actual current user identifier from the auth token
 * @param actions List of actions for the specific method, e.g. `workflow`, `payable`, etc.
 */
export function isActionAllowed({
  action,
  actions,
  entityUserId,
  entityUserIdFromAuthToken,
}: {
  action: PayableOperator['action'] | CommonOperator['action'];
  actions: Array<ActionSchema | PayableActionSchema> | undefined;
  entityUserId?: string;
  entityUserIdFromAuthToken: string | undefined;
}) {
  const actionSchema = actions?.find(
    ({ action_name }) => action_name === action
  );

  if (!actionSchema) return false;

  /** We have to handle `ALLOWED_FOR_OWN` with the user identifier */
  if (actionSchema.permission === PermissionEnum.ALLOWED_FOR_OWN) {
    return entityUserIdFromAuthToken === entityUserId;
  }

  return actionSchema.permission === PermissionEnum.ALLOWED;
}

/**
 * Checks permissions for the given entity user.
 *
 * @param method Specific method to check permissions
 */
export function usePermissions<T extends keyof PermissionMap>(method: T) {
  const userQuery = useEntityUserByAuthToken();
  const roleQuery = useEntityUserRoleByAuthToken();

  const role = roleQuery.data;
  const user = userQuery.data;

  const rest = {
    isLoading: roleQuery.isLoading || userQuery.isLoading,
    isPending: roleQuery.isPending || userQuery.isPending,
    isSuccess: roleQuery.isSuccess && userQuery.isSuccess,
    isError: roleQuery.isError || userQuery.isError,
    isFetching: roleQuery.isFetching || userQuery.isFetching,
    error: roleQuery.error || userQuery.error,
    userIdFromAuthToken: user?.id,
  };

  if (!user || !role || !('permissions' in role)) {
    return {
      ...rest,
      data: undefined,
    };
  }

  const permissions = role.permissions.objects;

  if (!permissions) {
    return {
      ...rest,
      data: undefined,
    };
  }

  const permission = permissions.find(
    (permission) => permission.object_type === method
  );

  const actions = permission?.actions as PermissionMap[T];

  return {
    ...rest,
    data: actions,
  };
}
