import { FieldValueTypes } from '@/components/payables/PayablesTable/types';

export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_STATUS = 'status';
export const FILTER_TYPE_DUE_DATE = 'due_date';
export const FILTER_TYPE_CREATED_AT = 'created_at';
export const FILTER_TYPE_OVERDUE = 'overdue';

export const DEFAULT_FIELD_ORDER: FieldValueTypes[] = [
  'document_id',
  'counterpart_id',
  'created_at',
  'issued_at',
  'due_date',
  'status',
  'amount',
  'pay',
];
