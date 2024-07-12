import { components } from '@/api';
import {
  commonPermissionsObjectType,
  payablePermissionsObjectType,
} from '@/core/queries/usePermissions';

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
