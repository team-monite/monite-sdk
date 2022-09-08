import {
  api__v1__payables__pagination__CursorFields,
  PayableStateEnum,
} from '@monite/sdk-api';
import { SortOrderEnum } from '@monite/ui-kit-react';
import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from './consts';

export type Sort = {
  sort: api__v1__payables__pagination__CursorFields;
  order: SortOrderEnum;
};

export type Filters = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_STATUS]?: PayableStateEnum | null;
  [FILTER_TYPE_DUE_DATE]?: Date | null;
  [FILTER_TYPE_CREATED_AT]?: Date | null;
};

export type FilterValue = PayableStateEnum | 'all' | Date | string | null;
