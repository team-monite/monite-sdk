import { components } from '@monite/sdk-api/src/api';
import { API } from '@monite/sdk-api/src/api/client';

import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_SUMMARY_CARD,
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
  [FILTER_TYPE_SUMMARY_CARD]: PayablesTabFilter | null;
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
  fieldOrder?: FieldValueTypes[];
  summaryCardFilters?: Record<string, PayablesTabFilter | null>;
}

export type PayablesTabFilter = NonNullable<
  API['payables']['getPayables']['types']['parameters']['query']
>;
