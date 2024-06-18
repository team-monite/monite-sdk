import { ApprovalRequestStatus } from '@monite/sdk-api';

import { FILTER_TYPE_STATUS, FILTER_TYPE_CREATED_AT } from './consts';

export type FilterTypes = {
  [FILTER_TYPE_STATUS]?: ApprovalRequestStatus | null;
  [FILTER_TYPE_CREATED_AT]?: Date | null;
};

export type FilterValue = ApprovalRequestStatus | 'all' | Date | string | null;
