import { components } from '@/api';

import {
  FILTER_TYPE_STATUS,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CURRENT_USER,
  FILTER_TYPE_ADDED_BY,
} from './consts';

export enum ApprovalRequestStatus {
  APPROVED = 'approved',
  CANCELED = 'canceled',
  REJECTED = 'rejected',
  WAITING = 'waiting',
}

export type FilterTypes = {
  [FILTER_TYPE_STATUS]?: components['schemas']['ApprovalRequestStatus'] | null;
  [FILTER_TYPE_CREATED_AT]?: Date | null;
  [FILTER_TYPE_ADDED_BY]?: string | null;
  [FILTER_TYPE_CURRENT_USER]?: boolean | null;
};

export type FilterValue =
  | components['schemas']['ApprovalRequestStatus']
  | 'all'
  | Date
  | string
  | boolean
  | null;
