'use client';

import { useMemo } from 'react';

import { CreateReceivablesFormBeforeValidationLineItemProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';

interface UseCreateInvoiceProductsTable {
  lineItems: Array<CreateReceivablesFormBeforeValidationLineItemProps>;
  formatCurrencyToDisplay: ReturnType<
    typeof useCurrencies
  >['formatCurrencyToDisplay'];
}

interface UseCreateInvoiceProductsTableProps {
  subtotalPrice: Price | undefined;
  totalTaxes: Price | undefined;
  totalPrice: Price | undefined;
  shouldShowVatExemptRationale: boolean;
}

/**
 * Hook to calculate the subtotal, total taxes and total price of the invoice
 *  (all math operations) before create invoice
 */
export const useCreateInvoiceProductsTable = ({
  lineItems,
  formatCurrencyToDisplay,
}: UseCreateInvoiceProductsTable): UseCreateInvoiceProductsTableProps => {
  const subtotalPrice = useMemo(() => {
    const price = lineItems.reduce((acc, field) => {
      const price = field.price?.value ?? 0;
      const quantity = field.quantity;

      return acc + price * quantity;
    }, 0);
    const currencyItem = lineItems.find((field) =>
      Boolean(field.price?.currency)
    );

    if (!currencyItem || !currencyItem.price) {
      return;
    }

    return new Price({
      value: price,
      currency: currencyItem.price.currency,
      formatter: formatCurrencyToDisplay,
    });
  }, [lineItems, formatCurrencyToDisplay]);

  const totalTaxes = useMemo(() => {
    const taxes = lineItems.reduce((acc, field) => {
      const price = field.price?.value ?? 0;
      const quantity = field.quantity;
      const subtotalPrice = price * quantity;
      const taxRate = field.vat_rate_value;

      if (!taxRate) {
        return acc;
      }

      const tax = (subtotalPrice * taxRate) / 10_000;

      return acc + tax;
    }, 0);
    const currencyItem = lineItems.find((field) =>
      Boolean(field.price?.currency)
    );

    if (!currencyItem || !currencyItem.price) {
      return;
    }

    return new Price({
      value: taxes,
      currency: currencyItem.price.currency,
      formatter: formatCurrencyToDisplay,
    });
  }, [lineItems, formatCurrencyToDisplay]);

  const totalPrice = useMemo(() => {
    if (!subtotalPrice || !totalTaxes) {
      return;
    }

    return subtotalPrice.add(totalTaxes);
  }, [subtotalPrice, totalTaxes]);

  const shouldShowVatExemptRationale = lineItems.some(
    (lineItem) => lineItem.vat_rate_value === 0
  );

  return {
    subtotalPrice,
    totalTaxes,
    totalPrice,
    shouldShowVatExemptRationale,
  };
};
