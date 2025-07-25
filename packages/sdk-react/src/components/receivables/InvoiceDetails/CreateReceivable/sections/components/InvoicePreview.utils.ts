import { components } from '@/api';
import { getRateValueForDisplay, rateMinorToMajor } from '@/core/utils/vatUtils';
import type { CreateReceivablesFormBeforeValidationLineItemProps } from '../../validation';

/**
 * Calculate discount from payment terms
 * Applies the first available discount tier (term_1 has priority over term_2)
 * Converts from minor units to major units for display
 */
export const getPaymentTermsDiscount = (
  selectedPaymentTerm?: PaymentTermsResponse | null
): number => {
  if (!selectedPaymentTerm) return 0;

  if (selectedPaymentTerm.term_1?.discount) {
    return rateMinorToMajor(selectedPaymentTerm.term_1.discount);
  }

  if (selectedPaymentTerm.term_2?.discount) {
    return rateMinorToMajor(selectedPaymentTerm.term_2.discount);
  }

  return 0;
};

/**
 * Get measure unit name from ID by looking it up in the provided measure units array
 */
export const getMeasureUnitName = (
  measureUnitId: string,
  measureUnits: UnitResponse[]
): string | null => {
  const unit = measureUnits.find((u) => u.id === measureUnitId);
  return unit?.name || null;
};

/**
 * Generic function to get rate value for any item type
 * Uses the proper VAT utility function to handle unit conversions and logic
 */
export const getRateValueForItem = (
  item: CreateReceivablesFormBeforeValidationLineItemProps,
  isNonVatSupported: boolean
): number => {
  return getRateValueForDisplay(
    isNonVatSupported,
    item.vat_rate_value ?? 0,
    item.tax_rate_value ?? 0
  );
}; 

type PaymentTermsResponse = components['schemas']['PaymentTermsResponse'];
type UnitResponse = components['schemas']['UnitResponse'];
