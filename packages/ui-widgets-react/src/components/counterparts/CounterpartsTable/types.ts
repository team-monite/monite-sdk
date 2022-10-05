import {
  PayableStateEnum,
  ReceivablesCounterpartType,
} from '@team-monite/sdk-api';
import { SortOrderEnum } from '@team-monite/ui-kit-react';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_IS_CUSTOMER,
} from './consts';

export type Sort = {
  sort: Receivablesapi__v1__counterparts__pagination__CursorFields;
  order: SortOrderEnum;
};

export type Filters = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_TYPE]?: ReceivablesCounterpartType | null;
  [FILTER_TYPE_IS_CUSTOMER]?: string | null;
};

export type FilterValue = PayableStateEnum | 'all' | Date | string | null;

export enum Receivablesapi__v1__counterparts__pagination__CursorFields {
  COUNTERPART_NAME = 'counterpart_name',
}
