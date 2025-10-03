export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_STATUS = 'status';
export const FILTER_TYPE_VENDOR = 'counterpart_id';

export const DEFAULT_FIELD_ORDER = [
  '__check__',
  'document_id',
  'status',
  'counterpart_id',
  'created_at',
  'issued_at',
  'amount',
];

export const PURCHASE_ORDER_CONSTANTS = {
  DEFAULT_VALID_FOR_DAYS: 30,
  DEFAULT_QUANTITY: 1,
  MIN_VALID_DAYS: 1,
  MAX_VALID_DAYS: 365,

  DEFAULT_PAGE_SIZE: 15,

  DEFAULT_PO_DOCUMENT_ID: 'PO-auto',

  MIN_PREVIEW_SCALE: 1,
  A4_PAPER_RATIO: 21 / 29.7,
} as const;

export const TABLE_COLUMN_WIDTHS = {
  CHECKBOX: 40,
  NUMBER: 140,
  STATUS: 100,
  CREATED: 120,
  ISSUED: 120,
  AMOUNT: 120,
} as const;

export const PURCHASE_ORDER_STATUSES = {
  DRAFT: 'draft',
  ISSUED: 'issued',
} as const;

export const FALLBACK_VALUES = {
  VENDOR_NAME: 'Vendor',
  CURRENCY: 'USD',
} as const;
