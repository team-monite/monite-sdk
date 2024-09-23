import { components } from '@/api';
import { API } from '@/api/client';

import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_OVERDUE,
} from './consts';

export type Sort = {
  sort: components['schemas']['PayableCursorFields'];
  order: 'asc' | 'desc';
};

export type FilterTypes = {
  [FILTER_TYPE_SEARCH]?: string | null;
  [FILTER_TYPE_STATUS]?: components['schemas']['PayableStateEnum'] | null;
  [FILTER_TYPE_DUE_DATE]?: Date | null;
  [FILTER_TYPE_CREATED_AT]?: Date | null;
  [FILTER_TYPE_OVERDUE]?: boolean | null;
};

export type FilterValue =
  | components['schemas']['PayableStateEnum']
  | 'all'
  | Date
  | string
  | null;

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
}

export type PayablesTabFilter = NonNullable<
  API['payables']['getPayables']['types']['parameters']['query']
>;
