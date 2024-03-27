import { SortOrderEnum } from '@/utils/types';
import { ApprovalPolicyCursorFields } from '@monite/sdk-api';

export type Sort = {
  sort: ApprovalPolicyCursorFields;
  order: SortOrderEnum;
};
