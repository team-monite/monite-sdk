import { FILTER_TYPE_CREATED_AT, FILTER_TYPE_SEARCH } from './consts';

export type FilterType = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_CREATED_AT]?: Date | null;
};

export type FilterValue = Date | string | null;
