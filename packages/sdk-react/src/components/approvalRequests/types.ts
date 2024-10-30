import { components } from '@monite/sdk-api/src/api';

import {
  FILTER_TYPE_STATUS,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CURRENT_USER,
  FILTER_TYPE_ADDED_BY,
} from './consts';

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
