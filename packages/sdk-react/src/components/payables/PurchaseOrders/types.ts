import { components } from '@/api';
import { DeepKeys } from '@/core/types/utils';

export interface CreatePurchaseOrderFormBeforeValidationLineItemProps {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  currency: string;
  vat_rate: number;
}

export interface CreatePurchaseOrderFormBeforeValidationProps {
  counterpart_id: string;
  line_items: Array<CreatePurchaseOrderFormBeforeValidationLineItemProps>;
  valid_for_days: number;
  message?: string;
  currency: string;
  entity_vat_id_id?: string;
  counterpart_address_id?: string;
  project_id?: string;
}

export type PurchaseOrderLineItemPath =
  DeepKeys<CreatePurchaseOrderFormBeforeValidationLineItemProps>;

export type PurchaseOrderFormLineItemPath =
  | `line_items.${number}`
  | `line_items.${number}.${PurchaseOrderLineItemPath}`;

export enum PurchaseOrderStatus {
  Draft = 'draft',
  Issued = 'issued',
}

export const PURCHASE_ORDER_MEASURE_UNITS = [
  'unit',
  'cm',
  'day',
  'hour',
  'kg',
  'litre',
] as const;

export type PurchaseOrderMeasureUnit =
  (typeof PURCHASE_ORDER_MEASURE_UNITS)[number];

export interface PurchaseOrderSectionGeneralProps {
  disabled: boolean;
}

export interface PurchaseOrderValidationErrorItem {
  [key: string]:
    | PurchaseOrderValidationErrorItem
    | { message: string }
    | undefined;
}

export interface EmailPurchaseOrderFormData {
  subject_text: string;
  body_text: string;
}

export type CurrencyEnum = components['schemas']['CurrencyEnum'];

export interface PurchaseOrderFilterTypes {
  search?: string;
  status?: components['schemas']['PurchaseOrderStatusEnum'];
  counterpart_id?: string;
}

export type PurchaseOrderFilterValue = string | Date | null;
