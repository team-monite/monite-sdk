import { components } from '@/api';
import { SortOrderEnum } from '@/utils/types';

export type Sort = {
  sort: components['schemas']['ApprovalPolicyCursorFields'];
  order: SortOrderEnum;
};
