import { SortOrderEnum } from '@/utils/types';
import {
  PayableStateEnum,
  CounterpartType,
  CounterpartCursorFields,
} from '@monite/sdk-api';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_IS_CUSTOMER,
} from './consts';

export type Sort = {
  sort: CounterpartCursorFields;
  order: SortOrderEnum;
};

export type Filters = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_TYPE]?: CounterpartType | null;
  [FILTER_TYPE_IS_CUSTOMER]?: string | null;
};

export type FilterValue = PayableStateEnum | 'all' | Date | string | null;
