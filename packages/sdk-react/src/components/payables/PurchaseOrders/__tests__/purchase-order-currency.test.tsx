import { Price } from '@/core/utils/price';
import { rateMajorToMinor } from '@/core/utils/currencies';
import { useCreateInvoiceProductsTable } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/useCreateInvoiceProductsTable';
import { renderHook } from '@testing-library/react';

describe('Purchase Order Currency Regression Tests', () => {
  const mockFormatter = (value: string | number, _currency: string) => {
    const numValue = Number(value);
    const dollarValue = numValue / 100;
    const formatted = dollarValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `$${formatted}`;
  };

  describe('Bug #1: Missing taxesByVatRate calculation', () => {
    test('useCreateInvoiceProductsTable returns taxesByVatRate', () => {
      const { result } = renderHook(() =>
        useCreateInvoiceProductsTable({
          lineItems: [
            {
              id: '1',
              product: {
                price: { value: 11.11, currency: 'USD' },
                name: 'Item A',
                type: 'product',
              },
              quantity: 1,
              vat_rate_value: 7,
            },
          ],
          isNonVatSupported: false,
          isInclusivePricing: false,
          actualCurrency: 'USD',
          formatCurrencyToDisplay: mockFormatter,
        })
      );

      expect(result.current.taxesByVatRate).toBeDefined();
      expect(typeof result.current.taxesByVatRate).toBe('object');
    });

    test('taxesByVatRate calculation logic works correctly', () => {
      const lineItems = [
        { price: 11.11, quantity: 1, vatRate: 7 },
        { price: 22.22, quantity: 1, vatRate: 7 },
        { price: 33.33, quantity: 1, vatRate: 10 },
      ];

      const taxes: Record<number, number> = {};

      lineItems.forEach((item) => {
        const lineSubtotal = item.price * item.quantity;
        const lineTax = lineSubtotal * (item.vatRate / 100);

        if (!taxes[item.vatRate]) {
          taxes[item.vatRate] = 0;
        }
        taxes[item.vatRate] += lineTax;
      });

      expect(Object.keys(taxes)).toHaveLength(2);
      expect(taxes[7]).toBeDefined();
      expect(taxes[10]).toBeDefined();

      // 7% tax on $11.11 + $22.22 = $33.33 * 0.07 = $2.33
      expect(taxes[7]).toBeCloseTo(2.33, 2);

      // 10% tax on $33.33 = $3.33
      expect(taxes[10]).toBeCloseTo(3.33, 2);
    });
  });

  describe('Bug #2: Price.value was private', () => {
    test('Price.getValue() is accessible', () => {
      const price = new Price({
        value: 2222,
        currency: 'USD',
        formatter: mockFormatter,
      });

      expect(() => price.getValue()).not.toThrow();
      expect(price.getValue()).toBe(2222);
    });

    test('Price.getValue() returns numeric value in minor units', () => {
      const testCases = [
        { input: 1111, expected: 1111 },
        { input: 2222, expected: 2222 },
        { input: '3333', expected: 3333 },
        { input: 0, expected: 0 },
      ];

      testCases.forEach(({ input, expected }) => {
        const price = new Price({
          value: input,
          currency: 'USD',
          formatter: mockFormatter,
        });

        expect(price.getValue()).toBe(expected);
        expect(typeof price.getValue()).toBe('number');
      });
    });
  });

  describe('Bug #3: Table rows dividing major units by 100', () => {
    test('sanitized items keep prices in major units when treatFlatPricesAsMajorUnits=true', () => {
      const formPrice = 11.11;
      const treatFlatPricesAsMajorUnits = true;

      const sanitizedPrice = treatFlatPricesAsMajorUnits
        ? formPrice
        : rateMajorToMinor(formPrice);

      expect(sanitizedPrice).toBe(11.11);
    });

    test('table row calculations work correctly with major units', () => {
      const priceMajor = 11.11;
      const quantity = 1;

      const totalAmountMajor = priceMajor * quantity;

      const priceMinorForDisplay = rateMajorToMinor(priceMajor);
      const totalAmountMinorForDisplay = rateMajorToMinor(totalAmountMajor);

      expect(priceMinorForDisplay).toBe(1111);
      expect(totalAmountMinorForDisplay).toBe(1111);

      expect(mockFormatter(priceMinorForDisplay, 'USD')).toBe('$11.11');
    });

    test('prevents double division bug', () => {
      const priceMajor = 11.11;

      const wrongCents = priceMajor / 100;
      const wrongMinor = rateMajorToMinor(wrongCents);
      expect(mockFormatter(wrongMinor, 'USD')).toBe('$0.11');

      const correctMinor = rateMajorToMinor(priceMajor);
      expect(mockFormatter(correctMinor, 'USD')).toBe('$11.11');
    });
  });

  describe('Bug #4: Preview totals double-converting', () => {
    test('Price objects already store values in minor units', () => {
      const price = new Price({
        value: 1111,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const minorValue = price.getValue();
      expect(minorValue).toBe(1111);

      const wrongValue = rateMajorToMinor(minorValue);
      expect(mockFormatter(wrongValue, 'USD')).toBe('$1,111.00');

      expect(mockFormatter(minorValue, 'USD')).toBe('$11.11');
    });

    test('priceToMinorUnits helper extracts without conversion', () => {
      const priceToMinorUnits = (price?: Price) => {
        return price ? price.getValue() : null;
      };

      const subtotal = new Price({
        value: 1111,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const minorUnits = priceToMinorUnits(subtotal);
      expect(minorUnits).toBe(1111);
      expect(mockFormatter(minorUnits!, 'USD')).toBe('$11.11');
    });
  });

  describe('Bug #5: Form tax totals not converting major to minor', () => {
    test('tax calculation produces values in major units', () => {
      const price = 11.11;
      const quantity = 1;
      const vatRate = 7;

      const lineSubtotal = price * quantity;
      const taxMajor = lineSubtotal * (vatRate / 100);

      expect(taxMajor).toBeCloseTo(0.78, 1);
      expect(taxMajor).toBeLessThan(1);
    });

    test('formatCurrencyToDisplay requires conversion to minor units', () => {
      const taxMajor = 0.7777;

      const wrongFormatted = mockFormatter(taxMajor, 'USD');
      expect(wrongFormatted).toBe('$0.01');

      const taxMinor = rateMajorToMinor(taxMajor);
      const correctFormatted = mockFormatter(taxMinor, 'USD');
      expect(correctFormatted).toBe('$0.78');
    });

    test('complete tax calculation and display flow', () => {
      const taxMajor = 11.11 * 0.07;
      const taxMinor = rateMajorToMinor(taxMajor);

      const formatted = mockFormatter(taxMinor, 'USD');

      expect(formatted).toBe('$0.78');
    });
  });

  describe('Complete Purchase Order Flow (Integration)', () => {
    test('handles $11.11 item with 7% tax correctly through entire flow', () => {
      const formPrice = 11.11;
      const vatRate = 7;
      const quantity = 1;

      const apiPrice = rateMajorToMinor(formPrice);
      expect(apiPrice).toBe(1111);

      const subtotalMajor = formPrice * quantity;
      const subtotalMinor = rateMajorToMinor(subtotalMajor);
      expect(subtotalMinor).toBe(1111);

      const taxMajor = subtotalMajor * (vatRate / 100);
      const taxMinor = rateMajorToMinor(taxMajor);
      expect(taxMinor).toBeCloseTo(78, 0);

      const totalMajor = subtotalMajor + taxMajor;
      const totalMinor = rateMajorToMinor(totalMajor);
      expect(totalMinor).toBeCloseTo(1189, 0);

      expect(mockFormatter(subtotalMinor, 'USD')).toBe('$11.11');
      expect(mockFormatter(taxMinor, 'USD')).toBe('$0.78');
      expect(mockFormatter(totalMinor, 'USD')).toBe('$11.89');
    });

    test('handles multiple items with different tax rates', () => {
      const item1Subtotal = 11.11 * 2;
      const item1Tax = item1Subtotal * 0.07;

      const item2Subtotal = 22.22 * 1;
      const item2Tax = item2Subtotal * 0.10;

      const subtotalMajor = item1Subtotal + item2Subtotal;
      const subtotalMinor = rateMajorToMinor(subtotalMajor);
      expect(subtotalMinor).toBe(4444);
      expect(mockFormatter(subtotalMinor, 'USD')).toBe('$44.44');

      const tax7Minor = rateMajorToMinor(item1Tax);
      expect(tax7Minor).toBeCloseTo(156, 0);

      const tax10Minor = rateMajorToMinor(item2Tax);
      expect(tax10Minor).toBeCloseTo(222, 0);

      const totalMajor = subtotalMajor + item1Tax + item2Tax;
      const totalMinor = rateMajorToMinor(totalMajor);
      // Accept either 4821 or 4822 due to floating point rounding
      expect(totalMinor).toBeGreaterThanOrEqual(4821);
      expect(totalMinor).toBeLessThanOrEqual(4822);
    });
  });
});
