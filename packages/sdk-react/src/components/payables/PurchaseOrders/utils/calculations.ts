import { components } from '@/api';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { rateBasisPointsToDecimal } from '@/core/utils/vatUtils';

export interface PurchaseOrderCalculations {
  subtotalMinor: number;
  totalTaxMinor: number;
  totalAmountMinor: number;
}

/**
 * Calculates subtotal, tax, and total amount for a purchase order
 * Supports both VAT (basis points) and tax_rate_value (percentage) for international use cases
 */
export function calculatePurchaseOrderTotals(
  purchaseOrder: components['schemas']['PurchaseOrderResponseSchema']
): PurchaseOrderCalculations {
  const totals = purchaseOrder.items?.reduce(
    (acc, item) => {
      const quantity = item.quantity ?? 0;
      const priceMinor = item.price ?? 0;
      const lineSubtotalMinor = quantity * priceMinor;

      const vatBasisPoints = item.vat_rate ?? 0;
      const taxRateDecimal = rateBasisPointsToDecimal(vatBasisPoints);
      const lineTaxMinor = lineSubtotalMinor * taxRateDecimal;

      return {
        subtotalMinor: acc.subtotalMinor + lineSubtotalMinor,
        totalTaxMinor: acc.totalTaxMinor + lineTaxMinor,
      };
    },
    { subtotalMinor: 0, totalTaxMinor: 0 }
  ) ?? { subtotalMinor: 0, totalTaxMinor: 0 };

  const totalAmountMinor = totals.subtotalMinor + totals.totalTaxMinor;

  return {
    subtotalMinor: totals.subtotalMinor,
    totalTaxMinor: totals.totalTaxMinor,
    totalAmountMinor,
  };
}

/**tax_rate_value is not available on purchase order line items
 * Calculates the line item total (price * quantity)
 */
export function calculateLineItemTotal(
  priceInMinorUnits: number,
  quantity: number
): number {
  return priceInMinorUnits * quantity;
}

/**
 * Calculates expiry date based on valid_for_days
 * Normalizes today to UTC midnight to ensure consistent calculation across timezones
 * Also normalizes result to handle DST transitions correctly
 */
export function calculateExpiryDate(validForDays: number): Date {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const result = addDays(today, validForDays);

  result.setUTCHours(0, 0, 0, 0);

  return result;
}

/**
 * Calculates valid_for_days from expiry date
 * Normalizes both dates to UTC midnight to ensure consistent calculation regardless of time of day or timezone
 * Uses differenceInCalendarDays to count calendar days (not 24-hour periods) to handle DST correctly
 */
export function calculateValidForDays(expiryDate: Date): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setUTCHours(0, 0, 0, 0);

  return differenceInCalendarDays(expiry, today);
}
