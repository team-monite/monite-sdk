import { rateMinorToMajor, rateMajorToMinor } from './currencies';

describe('Currency Conversion Functions', () => {
  describe('rateMinorToMajor', () => {
    test('converts minor units to major units correctly', () => {
      expect(rateMinorToMajor(2222)).toBe(22.22);
      expect(rateMinorToMajor(1111)).toBe(11.11);
      expect(rateMinorToMajor(10050)).toBe(100.5);
      expect(rateMinorToMajor(100)).toBe(1);
    });

    test('handles zero correctly', () => {
      expect(rateMinorToMajor(0)).toBe(0);
    });

    test('handles single digit cents', () => {
      expect(rateMinorToMajor(1)).toBe(0.01);
      expect(rateMinorToMajor(5)).toBe(0.05);
      expect(rateMinorToMajor(99)).toBe(0.99);
    });

    test('handles large amounts', () => {
      expect(rateMinorToMajor(123456789)).toBe(1234567.89);
      expect(rateMinorToMajor(999999999)).toBe(9999999.99);
    });

    test('is inverse of rateMajorToMinor', () => {
      const testValues = [0, 1, 100, 2222, 10050, 123456789];
      testValues.forEach((minor) => {
        const major = rateMinorToMajor(minor);
        const backToMinor = rateMajorToMinor(major);
        expect(backToMinor).toBe(minor);
      });
    });
  });

  describe('rateMajorToMinor', () => {
    test('converts major units to minor units correctly', () => {
      expect(rateMajorToMinor(22.22)).toBe(2222);
      expect(rateMajorToMinor(11.11)).toBe(1111);
      expect(rateMajorToMinor(100.5)).toBe(10050);
      expect(rateMajorToMinor(1)).toBe(100);
    });

    test('handles zero correctly', () => {
      expect(rateMajorToMinor(0)).toBe(0);
    });

    test('handles fractional cents', () => {
      expect(rateMajorToMinor(0.01)).toBe(1);
      expect(rateMajorToMinor(0.05)).toBe(5);
      expect(rateMajorToMinor(0.99)).toBe(99);
    });

    test('handles large amounts', () => {
      expect(rateMajorToMinor(1234567.89)).toBe(123456789);
      expect(rateMajorToMinor(9999999.99)).toBe(999999999);
    });

    test('rounds floating point precision issues correctly', () => {
      // Common floating point issues
      expect(rateMajorToMinor(0.1 + 0.2)).toBe(30); // 0.1 + 0.2 = 0.30000000000000004
      // Note: 1.005 * 100 = 100.49999999999999, which rounds to 100
      expect(rateMajorToMinor(1.005)).toBe(100);
    });

    test('is inverse of rateMinorToMajor', () => {
      const testValues = [0, 0.01, 1, 22.22, 100.5, 1234567.89];
      testValues.forEach((major) => {
        const minor = rateMajorToMinor(major);
        const backToMajor = rateMinorToMajor(minor);
        expect(backToMajor).toBeCloseTo(major, 2);
      });
    });
  });

  describe('Real-world Purchase Order scenarios', () => {
    test('handles typical purchase order item prices', () => {
      const price1 = 22.22;
      expect(rateMajorToMinor(price1)).toBe(2222);
      expect(rateMinorToMajor(2222)).toBe(price1);

      const price2 = 11.11;
      expect(rateMajorToMinor(price2)).toBe(1111);
      expect(rateMinorToMajor(1111)).toBe(price2);

      const price3 = 99.99;
      expect(rateMajorToMinor(price3)).toBe(9999);
      expect(rateMinorToMajor(9999)).toBe(price3);
    });

    test('handles VAT calculations', () => {
      const itemPrice = 11.11;
      const vatRate = 0.07;
      const taxAmount = itemPrice * vatRate;
      const taxMinor = rateMajorToMinor(taxAmount);

      expect(taxMinor).toBe(78);
    });

    test('handles subtotal and total calculations', () => {
      const itemPrice = 22.22;
      const quantity = 3;
      const subtotal = itemPrice * quantity;

      expect(rateMajorToMinor(subtotal)).toBe(6666);

      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      expect(rateMajorToMinor(tax)).toBe(667);
      expect(rateMajorToMinor(total)).toBe(7333);
    });
  });

  describe('Edge cases and validation', () => {
    test('handles negative values (for refunds)', () => {
      expect(rateMajorToMinor(-22.22)).toBe(-2222);
      expect(rateMinorToMajor(-2222)).toBe(-22.22);
    });

    test('handles very small amounts', () => {
      expect(rateMajorToMinor(0.001)).toBe(0); // Less than 1 cent rounds to 0
      expect(rateMajorToMinor(0.005)).toBe(1); // 0.5 cents rounds to 1
    });

    test('maintains precision for typical currency values', () => {
      const testCases = [
        { major: 0.01, minor: 1 },
        { major: 0.99, minor: 99 },
        { major: 1.00, minor: 100 },
        { major: 10.00, minor: 1000 },
        { major: 100.00, minor: 10000 },
      ];

      testCases.forEach(({ major, minor }) => {
        expect(rateMajorToMinor(major)).toBe(minor);
        expect(rateMinorToMajor(minor)).toBe(major);
      });
    });
  });
});
