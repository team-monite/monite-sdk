import { FILTER_TYPE_SEARCH, FILTER_TYPE_STARTED_AT } from './consts';

export type FilterTypes = Partial<{
  [FILTER_TYPE_SEARCH]: string | null;
  [FILTER_TYPE_STARTED_AT]: Date | null;
}>;
