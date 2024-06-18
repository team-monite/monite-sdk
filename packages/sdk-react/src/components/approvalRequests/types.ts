import { ApprovalRequestStatus } from '@monite/sdk-api';

import { FILTER_TYPE_STATUS } from './consts';

export type FilterTypes = {
  [FILTER_TYPE_STATUS]?: ApprovalRequestStatus | null;
};

export type FilterValue = ApprovalRequestStatus | 'all' | null;
