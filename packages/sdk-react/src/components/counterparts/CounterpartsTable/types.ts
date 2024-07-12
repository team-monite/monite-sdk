import { components } from '@/api';
import { SortOrderEnum } from '@/utils/types';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_IS_CUSTOMER,
} from './consts';

export type Sort = {
  sort: components['schemas']['CounterpartCursorFields'];
  order: SortOrderEnum;
};

export type Filters = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_TYPE]?: components['schemas']['CounterpartType'] | null;
  [FILTER_TYPE_IS_CUSTOMER]?: string | null;
};

export type FilterValue =
  | components['schemas']['PayableStateEnum']
  | 'all'
  | Date
  | string
  | null;
