import { components } from '@monite/sdk-api/src/api';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_IS_CUSTOMER,
} from './consts';

export type Sort = {
  sort: components['schemas']['CounterpartCursorFields'];
  order: 'asc' | 'desc';
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
