import { FILTER_TYPE_HAS_TRANSACTION, FILTER_TYPE_SEARCH } from './consts';

export type ReceiptsFilters = Partial<{
  [FILTER_TYPE_SEARCH]: string;
  [FILTER_TYPE_HAS_TRANSACTION]: string;
}>;
