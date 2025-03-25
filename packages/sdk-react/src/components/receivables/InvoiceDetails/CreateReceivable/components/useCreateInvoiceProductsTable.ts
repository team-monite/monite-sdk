import { useCallback, useMemo } from 'react';

import { components } from '@/api';
import { CreateReceivablesFormBeforeValidationLineItemProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { rateMajorToMinor } from '@/core/utils/vatUtils';

interface UseCreateInvoiceProductsTable {
  isNonVatSupported: boolean;
  lineItems: Array<CreateReceivablesFormBeforeValidationLineItemProps>;
  formatCurrencyToDisplay: ReturnType<
    typeof useCurrencies
  >['formatCurrencyToDisplay'];
  actualCurrency?: components['schemas']['CurrencyEnum'] | undefined;
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
  isNonVatSupported,
  actualCurrency,
}: UseCreateInvoiceProductsTable): UseCreateInvoiceProductsTableProps => {
  const subtotalPrice = useMemo(() => {
    const price = lineItems.reduce((acc, field) => {
      const price = field.product?.price?.value ?? field.price?.value ?? 0;
      const quantity = field.quantity;

      return acc + price * quantity;
    }, 0);

    const currency =
      actualCurrency ??
      lineItems.find((field) => Boolean(field.product?.price?.currency))
        ?.product?.price?.currency ??
      lineItems.find((field) => Boolean(field.price?.currency))?.price
        ?.currency;

    if (!currency) {
      return undefined;
    }

    return new Price({
      value: price,
      currency,
      formatter: formatCurrencyToDisplay,
    });
  }, [lineItems, formatCurrencyToDisplay, actualCurrency]);

  const getVatRateValue = useCallback(
    (field: CreateReceivablesFormBeforeValidationLineItemProps) => {
      return isNonVatSupported
        ? rateMajorToMinor(field?.tax_rate_value ?? 0)
        : field.vat_rate_value;
    },
    [isNonVatSupported]
  );

  const taxes = lineItems.reduce((acc, field) => {
    const price = field.product?.price?.value ?? field.price?.value ?? 0;
    const quantity = field.quantity;
    const subtotalPrice = price * quantity;
    const taxRate = getVatRateValue(field);

    if (!taxRate) {
      return acc;
    }
    const tax = (subtotalPrice * taxRate) / 10_000;

    return acc + tax;
  }, 0);

  const totalTaxes = useMemo(() => {
    const currency =
      actualCurrency ??
      lineItems.find((field) => Boolean(field.product?.price?.currency))
        ?.product?.price?.currency ??
      lineItems.find((field) => Boolean(field.price?.currency))?.price
        ?.currency;

    if (!currency) {
      return undefined;
    }

    return new Price({
      value: taxes,
      currency,
      formatter: formatCurrencyToDisplay,
    });
  }, [lineItems, taxes, formatCurrencyToDisplay, actualCurrency]);

  const totalPrice = useMemo(() => {
    if (!subtotalPrice || !totalTaxes) {
      return undefined;
    }

    return subtotalPrice.add(totalTaxes);
  }, [subtotalPrice, totalTaxes]);

  const shouldShowVatExemptRationale =
    !isNonVatSupported &&
    lineItems.some((lineItem) => getVatRateValue(lineItem) === 0);

  return {
    subtotalPrice,
    totalTaxes,
    totalPrice,
    shouldShowVatExemptRationale,
  };
};
