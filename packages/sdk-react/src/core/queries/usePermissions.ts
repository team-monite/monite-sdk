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

type PayableOperator = {
  method: 'payable';
  action: PayableActionEnum;
};

type CommonOperator = {
  method: 'workflow' | 'counterpart' | 'product' | 'receivable';
  action: ActionEnum;
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
  const { data, userIdFromAuthToken, ...rest } = usePermissions(method);
  /**
   * Unfortunately, we have to cast `data` to `Array<ActionSchema | PayableActionSchema> | undefined`
   *  because TypeScript can't infer a type of `data` from `usePermissions` hook
   * @link {@see https://github.com/microsoft/TypeScript/pull/47109}
   */
  const actions = data as Array<ActionSchema | PayableActionSchema> | undefined;

  if (!actions) {
    return { ...rest, data: false };
  }

  const schemaAction = actions.find((act) => act.action_name === action);

  if (!schemaAction) {
    return {
      ...rest,
      data: false,
    };
  }

  /** We have to handle `ALLOWED_FOR_OWN` with the user identifier */
  if (schemaAction.permission === PermissionEnum.ALLOWED_FOR_OWN) {
    if (userIdFromAuthToken === entityUserId) {
      return { ...rest, data: true };
    }
  }

  return { ...rest, data: schemaAction.permission === PermissionEnum.ALLOWED };
}

/**
 * Checks permissions for the given entity user.
 *
 * @param method Specific method to check permissions
 */
export function usePermissions<T extends keyof PermissionMap>(method: T) {
  const { data: user, ...rest } = useEntityUserByAuthToken();
  const { data: role } = useEntityUserRoleByAuthToken();

  if (!user || !role || !('permissions' in role)) {
    return {
      ...rest,
      data: undefined,
      userIdFromAuthToken: user?.id,
    };
  }

  const permissions = role.permissions.objects;

  if (!permissions) {
    return {
      ...rest,
      data: undefined,
      userIdFromAuthToken: user.id,
    };
  }

  const permission = permissions.find(
    (permission) => permission.object_type === method
  );

  const actions = permission?.actions as PermissionMap[T];

  return {
    ...rest,
    data: actions,
    userIdFromAuthToken: user.id,
  };
}
