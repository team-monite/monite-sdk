import { components } from '@/api';
import { rateMinorToMajor } from '@/core/utils/vatUtils';
import { useMemo } from 'react';

type Schemas = components['schemas'];

/**
 * A hook that creates default form values from an invoice
 * @param invoice The invoice data from the API
 * @param isNonVatSupported Whether VAT is not supported in the current region
 * @returns The default values for the form
 */
export const useInvoiceDefaultValues = (
  invoice: Schemas['InvoiceResponsePayload'],
  isNonVatSupported: boolean
) => {
  return useMemo(
    () => ({
      /** Customer section */
      counterpart_id: invoice.counterpart_id,
      counterpart_vat_id_id: invoice.counterpart_vat_id?.id ?? '',

      default_shipping_address_id:
        invoice.counterpart_shipping_address?.id ?? '',
      default_billing_address_id: invoice.counterpart_billing_address?.id ?? '',

      /** Entity section */
      entity_vat_id_id: invoice.entity_vat_id?.id ?? '',
      fulfillment_date: invoice.fulfillment_date
        ? new Date(invoice.fulfillment_date)
        : null,
      purchase_order: invoice.purchase_order ?? '',
      footer: invoice.footer ?? '',

      /** Items section */
      line_items: invoice.line_items.map((lineItem) => {
        const measureUnitName = lineItem.product.measure_unit?.name;
        const measureUnitId = lineItem.product.measure_unit?.id;

        return {
          quantity: lineItem.quantity,
          product_id: lineItem.product.id,
          vat_rate_id: lineItem.product.vat_rate.id ?? undefined,
          vat_rate_value: lineItem.product.vat_rate.value,
          product: {
            name: lineItem.product.name,
            price:
              invoice.vat_mode === 'inclusive'
                ? lineItem.product.price_after_vat
                : lineItem.product.price,
            // Get measure_unit_id directly from the API response if available
            measure_unit_id:
              measureUnitId && measureUnitId !== '' ? measureUnitId : undefined,
            // Store the measure unit name separately for custom units
            measure_unit_name:
              !measureUnitId && measureUnitName ? measureUnitName : undefined,
            type: lineItem.product.type || 'product',
          },
          // For custom measure units that don't have an ID but have a name
          measure_unit:
            !measureUnitId && measureUnitName
              ? { name: measureUnitName, id: null }
              : undefined,
          tax_rate_value: isNonVatSupported
            ? lineItem.product.vat_rate.value !== undefined
              ? rateMinorToMajor(lineItem.product.vat_rate.value)
              : undefined
            : undefined,
        };
      }),
      vat_exemption_rationale: invoice.vat_exemption_rationale ?? '',
      memo: invoice.memo ?? '',

      /** Payment section */
      entity_bank_account_id: invoice.entity_bank_account?.id ?? '',
      payment_terms_id: invoice.payment_terms?.id ?? '',

      /** Reminders section */
      payment_reminder_id: invoice.payment_reminder_id ?? '',
      overdue_reminder_id: invoice.overdue_reminder_id ?? '',
      vat_mode: invoice.vat_mode ?? 'exclusive',
    }),
    [invoice, isNonVatSupported]
  );
};
