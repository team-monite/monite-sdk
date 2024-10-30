import {
  commonPermissionsObjectType,
  payablePermissionsObjectType,
} from '@/core/queries/usePermissions';
import { components } from '@monite/sdk-api/src/api';

export type CommonActions = {
  [key in components['schemas']['ActionEnum']]?: boolean;
};

export type PayableActions = {
  [key in components['schemas']['PayableActionEnum']]?: boolean;
};

export interface CommonPermissionRow extends CommonActions {
  name?: commonPermissionsObjectType;
}

export interface PayablePermissionRow extends PayableActions {
  name?: payablePermissionsObjectType;
}

export type PermissionRow = CommonPermissionRow | PayablePermissionRow;
