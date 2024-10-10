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
    | components['schemas']['ActionSchema'][]
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
  objects: components['schemas']['RootSchema'][]
): PermissionRow[] => {
  return objects
    .map((object) => {
      if (!object.object_type) return null;

      if (isCommonPermissionObjectType(object.object_type)) {
        const permission: CommonPermissionRow = { name: object.object_type };

        return transformActionsToComponentFormat(
          object.actions as components['schemas']['ActionSchema'][],
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
    );
};

export const createInitialPermissionsState = (): PermissionRow[] => {
  return [
    ...PAYABLE_PERMISSIONS_OBJECTS_TYPES.map((objectType) =>
      createInitialPermissionState(objectType, PayableActionEnum)
    ),
    ...COMMON_PERMISSIONS_OBJECTS_TYPES.map((objectType) =>
      createInitialPermissionState(objectType, ActionEnum)
    ),
  ];
};
