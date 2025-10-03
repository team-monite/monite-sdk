import { components } from '@/api';
import { CreateReceivablesFormBeforeValidationLineItemProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useCurrencies } from '@/core/hooks';
import { Price } from '@/core/utils/price';
import { getRateValueForDisplay, ratePercentageToDecimal } from '@/core/utils/vatUtils';
import { rateMajorToMinor } from '@/core/utils/currencies';
import { useMemo } from 'react';


type ExtendedLineItem = CreateReceivablesFormBeforeValidationLineItemProps & {
  price?:
    | number
    | { value?: number; currency?: components['schemas']['CurrencyEnum'] };
  currency?: components['schemas']['CurrencyEnum'];
};


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
    const extField = field as ExtendedLineItem;
    const flatNumeric =
      typeof extField.price === 'number' ? extField.price : undefined;
    const flatObjectVal =
      typeof extField.price === 'object' ? extField.price?.value : undefined;
    const nestedVal = field.product?.price?.value;
    const candidates = [flatNumeric, flatObjectVal, nestedVal]
      .map((v) => (typeof v === 'number' ? v : Number(v)))
      .filter((v) => Number.isFinite(v));
    const price = (candidates.find((v) => v > 0) ??
      candidates[0] ??
      0) as number;
    const quantity = field.quantity ?? 1;
    return { price, quantity };
  };

  const taxesByVatRate = useMemo(() => {
    const taxes: Record<number, number> = {};

    lineItems.forEach((field) => {
      const { price, quantity } = getPriceAndQuantity(field);
      const vatRatePercent = getRateValueForDisplay(
        isNonVatSupported,
        field.vat_rate_value ?? 0,
        field.tax_rate_value ?? 0
      );
      const vatRateDecimal = ratePercentageToDecimal(vatRatePercent);

      if (vatRatePercent === 0) return;

      let lineSubtotal = price * quantity;
      if (isInclusivePricing && vatRateDecimal) {
        lineSubtotal = lineSubtotal / (1 + vatRateDecimal);
      }

      const lineTax = lineSubtotal * vatRateDecimal;

      if (!taxes[vatRatePercent]) {
        taxes[vatRatePercent] = 0;
      }
      taxes[vatRatePercent] += lineTax;
    });

    return taxes;
  }, [lineItems, isNonVatSupported, isInclusivePricing]);

  const subtotalPrice = useMemo(() => {
    const priceMajor = lineItems.reduce((acc, field) => {
      const { price, quantity } = getPriceAndQuantity(field);
      const vatRate = ratePercentageToDecimal(
        getRateValueForDisplay(
          isNonVatSupported,
          field.vat_rate_value ?? 0,
          field.tax_rate_value ?? 0
        )
      );
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
      (lineItems.find((field) => {
        const extField = field as ExtendedLineItem;
        return typeof extField.price === 'object' && extField.price?.currency;
      }) as ExtendedLineItem | undefined)?.price?.currency ??
      (
        lineItems.find((field) =>
          Boolean((field as ExtendedLineItem).currency)
        ) as ExtendedLineItem
      )?.currency;

    if (!currency) {
      return undefined;
    }

    const priceMinor = rateMajorToMinor(priceMajor);

    const priceObj = new Price({
      value: priceMinor,
      currency: currency as CurrencyEnum,
      formatter: formatCurrencyToDisplay,
    });
    return priceObj;
  }, [
    lineItems,
    formatCurrencyToDisplay,
    actualCurrency,
    isInclusivePricing,
    isNonVatSupported,
  ]);

  const totalTaxes = useMemo(() => {
    const taxesMajor = Object.values(taxesByVatRate).reduce(
      (acc, v) => acc + v,
      0
    );
    const taxesMinor = rateMajorToMinor(taxesMajor);

    const currency =
      actualCurrency ??
      lineItems.find((field) => Boolean(field.product?.price?.currency))
        ?.product?.price?.currency ??
      (
        lineItems.find((field) =>
          Boolean((field as ExtendedLineItem).currency)
        ) as ExtendedLineItem
      )?.currency;

    if (!currency) {
      return undefined;
    }

    const priceObj = new Price({
      value: taxesMinor,
      currency: currency as CurrencyEnum,
      formatter: formatCurrencyToDisplay,
    });
    return priceObj;
  }, [
    lineItems,
    formatCurrencyToDisplay,
    actualCurrency,
    taxesByVatRate,
  ]);

  const totalPrice = useMemo(() => {
    if (!subtotalPrice || !totalTaxes) {
      return undefined;
    }
    const totalObj = subtotalPrice.add(totalTaxes);

    return totalObj;
  }, [subtotalPrice, totalTaxes]);

  const shouldShowVatExemptRationale =
    !isNonVatSupported &&
    lineItems.some(
      (lineItem) =>
        getRateValueForDisplay(
          isNonVatSupported,
          lineItem.vat_rate_value ?? 0,
          lineItem.tax_rate_value ?? 0
        ) === 0
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
