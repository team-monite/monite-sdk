import {
  Receivablesapi__v1__counterparts__pagination__CursorFields,
  PayableStateEnum,
  ReceivablesCounterpartType,
} from '@monite/sdk-api';
import { SortOrderEnum } from '@monite/ui-kit-react';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_IS_CUSTOMER,
} from './consts';

export type Sort = {
  sort: Receivablesapi__v1__counterparts__pagination__CursorFields;
  order: SortOrderEnum;
};

export type Filters = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_TYPE]?: ReceivablesCounterpartType | null;
  [FILTER_TYPE_IS_CUSTOMER]?: string | null;
};

export type FilterValue = PayableStateEnum | 'all' | Date | string | null;
