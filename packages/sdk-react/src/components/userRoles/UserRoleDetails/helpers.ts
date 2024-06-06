import {
  COMMON_PERMISSIONS_OBJECTS_TYPES,
  commonPermissionsObjectType,
  PAYABLE_PERMISSIONS_OBJECTS_TYPES,
  payablePermissionsObjectType,
} from '@/core/queries/usePermissions';
import {
  ActionEnum,
  PayableActionEnum,
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

export const transformPermissionsToComponentFormat = (
  objects: RootSchema[]
): PermissionRow[] => {
  return objects
    .map((object) => {
      if (object.object_type) {
        if (isCommonPermissionObjectType(object.object_type)) {
          let permission: CommonPermissionRow = {};

          permission.name = object.object_type;

          object.actions?.forEach((action) => {
            const actionName = action.action_name;

            if (actionName) {
              if (
                Object.values(ActionEnum).includes(actionName as ActionEnum)
              ) {
                permission[actionName as ActionEnum] =
                  checkIfPermissionIsAllowed(action.permission);
              }
            }
          });

          return permission;
        }

        if (isPayablePermissionObjectType(object.object_type)) {
          let permission: PayablePermissionRow = {};

          permission.name = object.object_type;

          object.actions?.forEach((action) => {
            const actionName = action.action_name;

            if (actionName) {
              if (
                Object.values(PayableActionEnum).includes(
                  actionName as PayableActionEnum
                )
              ) {
                permission[actionName as PayableActionEnum] =
                  checkIfPermissionIsAllowed(action.permission);
              }
            }
          });

          return permission;
        }
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
    ...PAYABLE_PERMISSIONS_OBJECTS_TYPES.map((objectType) => {
      let permission: PayablePermissionRow = {};

      permission.name = objectType;

      Object.values(PayableActionEnum).forEach((action) => {
        permission[action] = false;
      });

      return permission;
    }),
    ...COMMON_PERMISSIONS_OBJECTS_TYPES.map((objectType) => {
      let permission: CommonPermissionRow = {};

      permission.name = objectType;

      Object.values(ActionEnum).forEach((action) => {
        permission[action] = false;
      });

      return permission;
    }),
  ];
};
