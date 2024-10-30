import { components } from '@monite/sdk-api/src/api';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_UNITS,
} from './consts';

export type Sort = {
  sort: components['schemas']['ProductCursorFields'];
  order: components['schemas']['OrderEnum'];
};

export type Filters = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_TYPE]?: ProductServiceTypeEnum | null;
  [FILTER_TYPE_UNITS]?: string | null;
};

export type FilterValue = ProductServiceTypeEnum | 'all' | string | null;

type ProductServiceTypeEnum = components['schemas']['ProductServiceTypeEnum'];
