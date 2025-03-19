import { components } from '@/api';
import {
  COMMON_PERMISSIONS_OBJECTS_TYPES,
  commonPermissionsObjectType,
  PAYABLE_PERMISSIONS_OBJECTS_TYPES,
  payablePermissionsObjectType,
} from '@/core/queries/usePermissions';
import { ActionEnum } from '@/enums/ActionEnum';
import { PayableActionEnum } from '@/enums/PayableActionEnum';

import {
  PermissionRow,
  CommonPermissionRow,
  PayablePermissionRow,
} from './types';

export const isCommonPermissionObjectType = (
  objectType: string
): objectType is commonPermissionsObjectType => {
  return COMMON_PERMISSIONS_OBJECTS_TYPES.includes(
    objectType as commonPermissionsObjectType
  );
};

export const isPayablePermissionObjectType = (
  objectType: string
): objectType is payablePermissionsObjectType => {
  return PAYABLE_PERMISSIONS_OBJECTS_TYPES.includes(
    objectType as payablePermissionsObjectType
  );
};

const checkIfPermissionIsAllowed = (
  permission?: components['schemas']['PermissionEnum']
) => {
  return permission === 'allowed' || permission === 'allowed_for_own';
};

const transformActionsToComponentFormat = <
  T extends
    | components['schemas']['ActionEnum']
    | components['schemas']['PayableActionEnum'],
  P
>(
  actions:
    | components['schemas']['package__roles__head__schemas__ActionSchema'][]
    | components['schemas']['PayableActionSchema'][],
  enumType: T[],
  permission: P
): P => {
  const permissionsObject = actions?.map((action) => {
    if (action.action_name && enumType.includes(action.action_name as T)) {
      const result = {
        key: action.action_name,
        value: checkIfPermissionIsAllowed(action.permission),
      };

      return { [result.key]: result.value };
    }
    return {};
  });

  return Object.assign({}, permission, ...permissionsObject);
};

const createInitialPermissionState = <
  T extends
    | components['schemas']['ActionEnum']
    | components['schemas']['PayableActionEnum']
>(
  objectType: payablePermissionsObjectType | commonPermissionsObjectType,
  actionEnum: T[]
): PayablePermissionRow | CommonPermissionRow => {
  const permission: Record<string, boolean | typeof objectType> = {};

  permission.name = objectType;

  actionEnum.forEach((action) => {
    permission[action] = false;
  });

  return permission as PayablePermissionRow | CommonPermissionRow;
};

export const transformPermissionsToComponentFormat = (
  objects: components['schemas']['RootSchema-Input'][]
): PermissionRow[] => {
  return objects
    .map((object) => {
      if (!object.object_type) return null;

      if (isCommonPermissionObjectType(object.object_type)) {
        const permission: CommonPermissionRow = { name: object.object_type };

        return transformActionsToComponentFormat(
          object.actions as components['schemas']['package__roles__head__schemas__ActionSchema'][],
          ActionEnum,
          permission
        );
      }

      if (isPayablePermissionObjectType(object.object_type)) {
        const permission: PayablePermissionRow = { name: object.object_type };

        return transformActionsToComponentFormat(
          object.actions as components['schemas']['PayableActionSchema'][],
          PayableActionEnum,
          permission
        );
      }

      return null;
    })
    .filter(
      (permission): permission is CommonPermissionRow | PayablePermissionRow =>
        permission !== null
    )
    .sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
};

export const createInitialPermissionsState = (): PermissionRow[] => {
  return [
    ...PAYABLE_PERMISSIONS_OBJECTS_TYPES.map((objectType) =>
      createInitialPermissionState(objectType, PayableActionEnum)
    ),
    ...COMMON_PERMISSIONS_OBJECTS_TYPES.map((objectType) =>
      createInitialPermissionState(objectType, ActionEnum)
    ),
  ].sort((a, b) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
};

export const transformPermissionsToRequestFormat = (
  permissions: PermissionRow[]
): components['schemas']['BizObjectsSchema-Input'] => {
  return {
    objects: permissions
      .map((permission) => {
        const objectType = permission.name;

        if (!objectType) return null;

        if (isCommonPermissionObjectType(objectType)) {
          return {
            object_type: objectType,
            actions: Object.entries(permission)
              .filter(([key]) => key !== 'name')
              .map(([action, permission]) => ({
                action_name: action as components['schemas']['ActionEnum'],
                permission: (permission
                  ? 'allowed'
                  : 'not_allowed') as components['schemas']['PermissionEnum'],
              })),
          };
        }

        if (isPayablePermissionObjectType(objectType)) {
          return {
            object_type: objectType,
            actions: Object.entries(permission)
              .filter(([key]) => key !== 'name')
              .map(([action, permission]) => ({
                action_name:
                  action as components['schemas']['PayableActionEnum'],
                permission: (permission
                  ? 'allowed'
                  : 'not_allowed') as components['schemas']['PermissionEnum'],
              })),
          };
        }
      })
      .filter(
        (value): value is NonNullable<typeof value> =>
          value !== null && value !== undefined
      ),
  };
};
