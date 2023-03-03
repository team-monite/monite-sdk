import { PayableCursorFields, PayableStateEnum } from '@team-monite/sdk-api';
import { SortOrderEnum } from '@team-monite/ui-kit-react';
import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from './consts';

export type Sort = {
  sort: PayableCursorFields;
  order: SortOrderEnum;
};

export type FilterTypes = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_STATUS]?: PayableStateEnum | null;
  [FILTER_TYPE_DUE_DATE]?: Date | null;
  [FILTER_TYPE_CREATED_AT]?: Date | null;
};

export type FilterValue = PayableStateEnum | 'all' | Date | string | null;
