import { SortOrderEnum } from '@/utils/types';
import { ReceivableCursorFields, ReceivablesStatusEnum } from '@monite/sdk-api';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_CUSTOMER,
  FILTER_TYPE_DUE_DATE_LTE,
} from '../consts';

export type FilterTypes = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_STATUS]?: ReceivablesStatusEnum | null;
  [FILTER_TYPE_CUSTOMER]?: string | null;
  [FILTER_TYPE_DUE_DATE_LTE]?: Date | null;
};

export type Sort = {
  sort: ReceivableCursorFields;
  order: SortOrderEnum;
};

export type FilterValue = ReceivablesStatusEnum | string | null;
