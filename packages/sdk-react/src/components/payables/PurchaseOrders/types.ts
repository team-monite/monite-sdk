import { components } from '@/api';
import { DeepKeys } from '@/core/types/utils';

export interface CreatePurchaseOrderFormBeforeValidationLineItemProps {
  id?: string;
  name: string;
  quantity: number;
  unit: PurchaseOrderMeasureUnit;
  price: number;
  currency: CurrencyEnum;
  vat_rate: VatRateBasisPoints;
  vat_rate_id?: string;
  vat_rate_value?: number;
  tax_rate_value?: number;
}

export interface CreatePurchaseOrderFormBeforeValidationProps {
  counterpart_id: string;
  line_items: Array<CreatePurchaseOrderFormBeforeValidationLineItemProps>;
  valid_for_days?: number;
  message?: string;
  currency: CurrencyEnum;
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

export interface PurchaseOrderFilterTypes {
  search?: string;
  status?: PurchaseOrderStatusEnum;
  counterpart_id?: string;
}

type PurchaseOrderStatusEnum = components['schemas']['PurchaseOrderStatusEnum'];
export type PurchaseOrderFilterValue = string | Date | null;
export type CurrencyEnum = components['schemas']['CurrencyEnum'];
export type VatRateBasisPoints = number; // integer basis points, e.g., 1900 => 19%
