import { SortOrderEnum } from '@team-monite/ui-kit-react';
import {
  api__v1__receivables__pagination__CursorFields,
  ReceivablesReceivablesStatusEnum,
} from '@team-monite/sdk-api';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_CUSTOMER,
} from './consts';

export type FilterTypes = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_STATUS]?: ReceivablesReceivablesStatusEnum | null;
  [FILTER_TYPE_CUSTOMER]?: string | null;
};

export type Sort = {
  sort: api__v1__receivables__pagination__CursorFields;
  order: SortOrderEnum;
};

export type FilterValue = ReceivablesReceivablesStatusEnum | string | null;
