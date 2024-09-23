import { components } from '@/api';
import { API } from '@/api/client';

import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CUSTOM_MONITE,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from './consts';

export type Sort = {
  sort: components['schemas']['PayableCursorFields'];
  order: 'asc' | 'desc';
};

export type FilterTypes = Partial<{
  [FILTER_TYPE_SEARCH]: string | null;
  [FILTER_TYPE_STATUS]: components['schemas']['PayableStateEnum'] | null;
  [FILTER_TYPE_DUE_DATE]: Date | null;
  [FILTER_TYPE_CREATED_AT]: Date | null;
  [FILTER_TYPE_CUSTOM_MONITE]: keyof PayablesTabFilter;
}>;

export type FilterValue =
  | components['schemas']['PayableStateEnum']
  | 'all'
  | Date
  | string
  | null;

//TODO: better to map it with schema.json keyof values
export type FieldValueTypes =
  | 'document_id'
  | 'counterpart_id'
  | 'created_at'
  | 'issued_at'
  | 'due_date'
  | 'status'
  | 'amount'
  | 'pay';

export interface MonitePayableTableProps {
  isShowingSummaryCards?: boolean;
  fieldOrder?: Array<keyof FieldValueTypes>;
  customFilters?: Array<keyof PayablesTabFilter>;
}

/*
PayablesTabFilter
  query?: {
    sort?: components["schemas"]["PayableCursorFields"];
    order?: components["schemas"] ["OrderEnum"];
    limit?: number;
    pagination_token?: string;
    created_at__lt?: string;
    created_at__gt?: string;
    created_at__lte?: string;
    created_at__gte?: string;
    status?: components["schemas"]["PayableStateEnum"];
    due_date__lt?: string;
    due_date__gt?: string;
    due_date__lte?: string;
    due_date__gte?: string;
    amount__lt?: number;
    amount__gt?: number;
    amount__lte?: number;
    amount__gte?: number;
    overdue?: boolean;
    document_id__icontains?: string;
    counterpart_id?: string;
    ...
 */

export type PayablesTabFilter = NonNullable<
  API['payables']['getPayables']['types']['parameters']['query']
>;
