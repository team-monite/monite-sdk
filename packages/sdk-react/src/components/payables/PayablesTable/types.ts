import { components } from '@/api';
import { SortOrderEnum } from '@/utils/types';

import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from './consts';

export type Sort = {
  sort: components['schemas']['PayableCursorFields'];
  order: SortOrderEnum;
};

export type FilterTypes = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_STATUS]?: components['schemas']['PayableStateEnum'] | null;
  [FILTER_TYPE_DUE_DATE]?: Date | null;
  [FILTER_TYPE_CREATED_AT]?: Date | null;
};

export type FilterValue =
  | components['schemas']['PayableStateEnum']
  | 'all'
  | Date
  | string
  | null;
