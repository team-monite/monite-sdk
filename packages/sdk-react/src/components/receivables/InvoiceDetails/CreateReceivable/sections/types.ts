import { type CreateReceivablesFormBeforeValidationLineItemProps } from '../validation';
import { components } from '@/api';
import { DeepKeys } from '@/core/types/utils';

/**
 * Type-safe path for accessing line item properties in validation errors
 */
export type LineItemPath =
  DeepKeys<CreateReceivablesFormBeforeValidationLineItemProps>;

/**
 * Type-safe path for full form line item field paths
 */
export type FormLineItemPath =
  | `line_items.${number}`
  | `line_items.${number}.${LineItemPath}`;

export type CurrencyEnum = components['schemas']['CurrencyEnum'];
type MeasureUnit = components['schemas']['LineItemProductMeasureUnit'];
type MeasureUnitId = MeasureUnit['id'];

/**
 * Sanitizable line item type for invoice creation
 * Used for data processing before validation
 */
export type SanitizableLineItem = Omit<
  Partial<CreateReceivablesFormBeforeValidationLineItemProps>,
  'product' | 'price'
> & {
  /**
   * Optional flat fields accepted by sanitization helpers
   * When provided, they will be normalized into product.price and related fields
   */
  price?: number;
  currency?: CurrencyEnum;
  unit?: MeasureUnitId;
  product?: Omit<
    Partial<CreateReceivablesFormBeforeValidationLineItemProps['product']>,
    'type'
  > & {
    type?: string;
  };
};

export interface SectionGeneralProps {
  /**
   * Describes if the form must be disabled
   *  to prevent the user from editing it
   */
  disabled: boolean;
}

export interface ValidationErrorItem {
  [key: string]: ValidationErrorItem | { message: string } | undefined;
}
