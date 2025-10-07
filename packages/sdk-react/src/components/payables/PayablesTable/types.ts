import {
  FILTER_TYPE_SUMMARY_CARD,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from './consts';
import { components } from '@/api';
import { API } from '@/api/client';

export type Sort = {
  sort: components['schemas']['PayableCursorFields'];
  order: 'asc' | 'desc';
};

export type FilterTypes = Partial<{
  [FILTER_TYPE_SEARCH]: string | null;
  [FILTER_TYPE_STATUS]: components['schemas']['PayableStateEnum'] | null;
  [FILTER_TYPE_DUE_DATE]: Date | null;
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
  | 'counterpart_id'
  | 'document_id'
  | 'amount'
  | 'due_date'
  | 'was_created_by_user_id'
  | 'created_at'
  | 'issued_at'
  | 'amount_paid'
  | 'amount_to_pay'
  | 'status'
  | 'pay';

export interface MonitePayableTableProps {
  isShowingSummaryCards?: boolean;
  fieldOrder?: [FieldValueTypes, ...FieldValueTypes[]];
  summaryCardFilters?: Record<string, PayablesTabFilter | null>;
  requiredColumns?: [FieldValueTypes, ...FieldValueTypes[]];
  displayColumns?: [FieldValueTypes, ...FieldValueTypes[]];
}

export type PayablesTabFilter = NonNullable<
  API['payables']['getPayables']['types']['parameters']['query']
>;
