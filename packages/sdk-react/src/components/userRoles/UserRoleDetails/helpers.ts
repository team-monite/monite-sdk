import {
  COMMON_PERMISSIONS_OBJECTS_TYPES,
  commonPermissionsObjectType,
  PAYABLE_PERMISSIONS_OBJECTS_TYPES,
  payablePermissionsObjectType,
} from '@/core/queries/usePermissions';
import {
  ActionEnum,
  ActionSchema,
  PayableActionEnum,
  PayableActionSchema,
  PermissionEnum,
  RootSchema,
} from '@monite/sdk-api';

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

const checkIfPermissionIsAllowed = (permission?: PermissionEnum) => {
  return (
    permission === PermissionEnum.ALLOWED ||
    permission === PermissionEnum.ALLOWED_FOR_OWN
  );
};

const transformActionsToComponentFormat = <T extends string, P>(
  actions: ActionSchema[] | PayableActionSchema[],
  enumType: Record<string, T>,
  permission: P
) => {
  actions?.forEach((action) => {
    if (
      action.action_name &&
      Object.values(enumType).includes(action.action_name as T)
    ) {
      const result = {
        key: action.action_name as T,
        value: checkIfPermissionIsAllowed(action.permission),
      };
      if (result) {
        (permission as Record<string, boolean>)[result.key] = result.value;
      }
    }
  });
};

export const transformPermissionsToComponentFormat = (
  objects: RootSchema[]
): PermissionRow[] => {
  return objects
    .map((object) => {
      if (!object.object_type) return null;

      if (isCommonPermissionObjectType(object.object_type)) {
        let permission: CommonPermissionRow = { name: object.object_type };
        transformActionsToComponentFormat(
          object.actions as ActionSchema[],
          ActionEnum,
          permission
        );
        return permission;
      }

      if (isPayablePermissionObjectType(object.object_type)) {
        let permission: PayablePermissionRow = { name: object.object_type };
        transformActionsToComponentFormat(
          object.actions as PayableActionSchema[],
          PayableActionEnum,
          permission
        );
        return permission;
      }

      return null;
    })
    .filter(
      (permission): permission is CommonPermissionRow | PayablePermissionRow =>
        permission !== null
    );
};

const createInitialPermissionState = <T extends string>(
  objectType: payablePermissionsObjectType | commonPermissionsObjectType,
  actionEnum: Record<string, T>
): PayablePermissionRow | CommonPermissionRow => {
  let permission: Record<string, boolean | typeof objectType> = {};

  permission.name = objectType;

  Object.values(actionEnum).forEach((action) => {
    permission[action] = false;
  });

  return permission as PayablePermissionRow | CommonPermissionRow;
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
