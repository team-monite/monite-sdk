import { Price } from './price';
import { components } from '@/api';

type CurrencyEnum = components['schemas']['CurrencyEnum'];

describe('Price class', () => {
  const mockFormatter = jest.fn(
    (value: string | number, currency: CurrencyEnum) => {
      const numValue = Number(value);
      const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
      return `${symbol}${(numValue / 100).toFixed(2)}`;
    }
  );

  beforeEach(() => {
    mockFormatter.mockClear();
  });

  describe('constructor and getValue', () => {
    test('creates Price object with minor units', () => {
      const price = new Price({
        value: 2222,
        currency: 'USD',
        formatter: mockFormatter,
      });

      expect(price.getValue()).toBe(2222);
    });

    test('stores value in minor units internally', () => {
      const price = new Price({
        value: 1111,
        currency: 'USD',
        formatter: mockFormatter,
      });

      expect(price.getValue()).toBe(1111);
      expect(price.getValue()).not.toBe(11.11);
    });

    test('handles zero value', () => {
      const price = new Price({
        value: 0,
        currency: 'USD',
        formatter: mockFormatter,
      });

      expect(price.getValue()).toBe(0);
    });

    test('handles string values', () => {
      const price = new Price({
        value: '2222',
        currency: 'USD',
        formatter: mockFormatter,
      });

      expect(price.getValue()).toBe(2222);
    });
  });

  describe('add method', () => {
    test('adds two prices with same currency', () => {
      const price1 = new Price({
        value: 2222,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const price2 = new Price({
        value: 1111,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const total = price1.add(price2);

      expect(total.getValue()).toBe(3333);
    });

    test('throws error when currencies do not match', () => {
      const priceUSD = new Price({
        value: 2222,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const priceEUR = new Price({
        value: 1111,
        currency: 'EUR',
        formatter: mockFormatter,
      });

      expect(() => priceUSD.add(priceEUR)).toThrow('Currencies must match');
    });

    test('handles adding zero', () => {
      const price = new Price({
        value: 2222,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const zero = new Price({
        value: 0,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const result = price.add(zero);
      expect(result.getValue()).toBe(2222);
    });

    test('handles chain addition', () => {
      const p1 = new Price({ value: 1000, currency: 'USD', formatter: mockFormatter });
      const p2 = new Price({ value: 2000, currency: 'USD', formatter: mockFormatter });
      const p3 = new Price({ value: 3000, currency: 'USD', formatter: mockFormatter });

      const total = p1.add(p2).add(p3);
      expect(total.getValue()).toBe(6000);
    });
  });

  describe('toString method', () => {
    test('formats price using provided formatter', () => {
      const price = new Price({
        value: 2222,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const formatted = price.toString();

      expect(mockFormatter).toHaveBeenCalledWith(2222, 'USD');
      expect(formatted).toBe('$22.22');
    });

    test('works with different currencies', () => {
      const priceEUR = new Price({
        value: 5000,
        currency: 'EUR',
        formatter: mockFormatter,
      });

      const formatted = priceEUR.toString();

      expect(mockFormatter).toHaveBeenCalledWith(5000, 'EUR');
      expect(formatted).toBe('€50.00');
    });

    test('handles null formatter result', () => {
      const nullFormatter = jest.fn(() => null);
      const price = new Price({
        value: 2222,
        currency: 'USD',
        formatter: nullFormatter,
      });

      expect(price.toString()).toBe('');
    });
  });

  describe('Real-world Purchase Order scenarios', () => {
    test('calculates subtotal for multiple items', () => {
      const itemPrice = new Price({
        value: 1111,
        currency: 'USD',
        formatter: mockFormatter,
      });

      let subtotal = new Price({
        value: 0,
        currency: 'USD',
        formatter: mockFormatter,
      });

      for (let i = 0; i < 3; i++) {
        subtotal = subtotal.add(itemPrice);
      }

      expect(subtotal.getValue()).toBe(3333);
      expect(subtotal.toString()).toBe('$33.33');
    });

    test('calculates total with tax', () => {
      const subtotal = new Price({
        value: 1111,
        currency: 'USD',
        formatter: mockFormatter,
      });

      // $0.78 tax (7% of $11.11)
      const tax = new Price({
        value: 78,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const total = subtotal.add(tax);

      expect(total.getValue()).toBe(1189);
      expect(total.toString()).toBe('$11.89');
    });

    test('handles multiple line items with different prices', () => {
      const items = [
        new Price({ value: 1111, currency: 'USD', formatter: mockFormatter }),
        new Price({ value: 2222, currency: 'USD', formatter: mockFormatter }),
        new Price({ value: 3333, currency: 'USD', formatter: mockFormatter }),
      ];

      const subtotal = items.reduce((acc, item) => acc.add(item));

      expect(subtotal.getValue()).toBe(6666);
      expect(subtotal.toString()).toBe('$66.66');
    });
  });

  describe('Edge cases', () => {
    test('handles negative values (refunds)', () => {
      const refund = new Price({
        value: -2222,
        currency: 'USD',
        formatter: mockFormatter,
      });

      expect(refund.getValue()).toBe(-2222);
    });

    test('handles very large amounts', () => {
      const largePrice = new Price({
        value: 99999999,
        currency: 'USD',
        formatter: mockFormatter,
      });

      expect(largePrice.getValue()).toBe(99999999);
      expect(largePrice.toString()).toBe('$999999.99');
    });

    test('adding result maintains correct formatter', () => {
      const price1 = new Price({
        value: 1000,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const price2 = new Price({
        value: 2000,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const sum = price1.add(price2);

      expect(sum.toString()).toBe('$30.00');
      expect(mockFormatter).toHaveBeenCalled();
    });
  });

  describe('Integration with currency conversion (documentation)', () => {
    test('documents correct usage with rateMajorToMinor', () => {
      const formValue = 22.22;
      const valueMinor = Math.round(formValue * 100); // rateMajorToMinor

      const price = new Price({
        value: valueMinor,
        currency: 'USD',
        formatter: mockFormatter,
      });

      expect(price.getValue()).toBe(2222);
      expect(price.toString()).toBe('$22.22');
    });

    test('documents correct usage with getValue for display', () => {
      const price = new Price({
        value: 2222,
        currency: 'USD',
        formatter: mockFormatter,
      });

      const minorUnits = price.getValue();
      const formatted = mockFormatter(minorUnits, 'USD');

      expect(formatted).toBe('$22.22');
    });
  });
});
