import { useMemo } from 'react';

import { components } from '@/api';
import { CreateReceivablesFormBeforeValidationLineItemProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { getRateValueForDisplay } from '@/core/utils/vatUtils';

interface UseCreateInvoiceProductsTable {
  isNonVatSupported: boolean;
  lineItems: Array<CreateReceivablesFormBeforeValidationLineItemProps>;
  isInclusivePricing: boolean;
  actualCurrency?: components['schemas']['CurrencyEnum'] | undefined;
  formatCurrencyToDisplay: ReturnType<
    typeof useCurrencies
  >['formatCurrencyToDisplay'];
}

interface UseCreateInvoiceProductsTableProps {
  subtotalPrice: Price | undefined;
  totalTaxes: Price | undefined;
  totalPrice: Price | undefined;
  shouldShowVatExemptRationale: boolean;
  taxesByVatRate: Record<number, number>;
}

/**
 * Hook to calculate the subtotal, total taxes and total price of the invoice
 *  (all math operations) before create invoice
 */
export const useCreateInvoiceProductsTable = ({
  lineItems,
  isNonVatSupported,
  isInclusivePricing,
  actualCurrency,
  formatCurrencyToDisplay,
}: UseCreateInvoiceProductsTable): UseCreateInvoiceProductsTableProps => {
  const getPriceAndQuantity = (
    field: CreateReceivablesFormBeforeValidationLineItemProps
  ) => {
    const price = field.product?.price?.value ?? field.price?.value ?? 0;
    const quantity = field.quantity ?? 1;
    return { price, quantity };
  };

  const subtotalPrice = useMemo(() => {
    const price = lineItems.reduce((acc, field) => {
      const { price, quantity } = getPriceAndQuantity(field);
      const vatRate =
        getRateValueForDisplay(
          isNonVatSupported,
          field.vat_rate_value ?? 0,
          field.tax_rate_value ?? 0
        ) / 100;
      if (isInclusivePricing && vatRate) {
        const base = (price * quantity) / (1 + vatRate);
        return acc + base;
      }
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
      currency: currency as CurrencyEnum,
      formatter: formatCurrencyToDisplay,
    });
  }, [
    lineItems,
    formatCurrencyToDisplay,
    actualCurrency,
    isInclusivePricing,
    isNonVatSupported,
  ]);

  const taxesByVatRate = useMemo(() => {
    return lineItems.reduce((acc, field) => {
      const { price, quantity } = getPriceAndQuantity(field);
      const vatRate = getRateValueForDisplay(
        isNonVatSupported,
        field.vat_rate_value ?? 0,
        field.tax_rate_value ?? 0
      );

      if (!vatRate) return acc;

      const amount = price * quantity;
      const tax = isInclusivePricing
        ? amount - amount / (1 + vatRate / 100)
        : amount * (vatRate / 100);

      if (acc[vatRate]) {
        acc[vatRate] += tax;
      } else {
        acc[vatRate] = tax;
      }

      return acc;
    }, {} as Record<number, number>);
  }, [lineItems, isInclusivePricing, isNonVatSupported]);

  const totalTaxes = useMemo(() => {
    const taxes = Object.values(taxesByVatRate).reduce((acc, v) => acc + v, 0);

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
      currency: currency as CurrencyEnum,
      formatter: formatCurrencyToDisplay,
    });
  }, [lineItems, formatCurrencyToDisplay, actualCurrency, taxesByVatRate]);

  const totalPrice = useMemo(() => {
    if (!subtotalPrice || !totalTaxes) {
      return undefined;
    }
    return subtotalPrice.add(totalTaxes);
  }, [subtotalPrice, totalTaxes]);

  const shouldShowVatExemptRationale =
    !isNonVatSupported &&
    lineItems.some(
      (lineItem) =>
        getRateValueForDisplay(
          isNonVatSupported,
          lineItem.vat_rate_value ?? 0,
          lineItem.tax_rate_value ?? 0
        ) /
          100 ===
        0
    );

  return {
    subtotalPrice,
    totalTaxes,
    totalPrice,
    shouldShowVatExemptRationale,
    taxesByVatRate,
  };
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
