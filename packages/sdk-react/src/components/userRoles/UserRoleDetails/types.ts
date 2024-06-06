import {
  commonPermissionsObjectType,
  payablePermissionsObjectType,
} from '@/core/queries/usePermissions';
import { ActionEnum, PayableActionEnum } from '@monite/sdk-api';

export type CommonActions = {
  [key in ActionEnum]?: boolean;
};

export type PayableActions = {
  [key in PayableActionEnum]?: boolean;
};

export interface CommonPermissionRow extends CommonActions {
  name?: commonPermissionsObjectType;
}

export interface PayablePermissionRow extends PayableActions {
  name?: payablePermissionsObjectType;
}

export type PermissionRow = CommonPermissionRow | PayablePermissionRow;
