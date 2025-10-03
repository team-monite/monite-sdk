import { calculateValidForDays, calculateExpiryDate } from '../calculations';

describe('Date calculations with midnight normalization', () => {
  // Use UTC time to avoid timezone confusion in tests
  const MOCK_TODAY = new Date('2025-10-03T14:30:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_TODAY);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('calculateValidForDays', () => {
    it('calculates correctly regardless of current time', () => {
      const expiryDate = new Date('2025-10-30');
      const result = calculateValidForDays(expiryDate);

      expect(result).toBe(27);
    });

    it('handles different times of day consistently', () => {
      const dates = [
        new Date('2025-10-30T00:00:00'),
        new Date('2025-10-30T12:00:00'),
        new Date('2025-10-30T23:59:59'),
      ];

      const results = dates.map(calculateValidForDays);

      expect(results).toEqual([27, 27, 27]);
    });

    it('works with same-day date', () => {
      const today = new Date('2025-10-03');
      const result = calculateValidForDays(today);

      expect(result).toBe(0);
    });

    it('works with tomorrow', () => {
      const tomorrow = new Date('2025-10-04');
      const result = calculateValidForDays(tomorrow);

      expect(result).toBe(1);
    });
  });

  describe('calculateExpiryDate', () => {
    it('calculates expiry date normalized to midnight', () => {
      const result = calculateExpiryDate(27);
      const expected = new Date('2025-10-30');
      expected.setUTCHours(0, 0, 0, 0);

      expect(result.getTime()).toBe(expected.getTime());
    });

    it('handles zero days', () => {
      const result = calculateExpiryDate(0);
      const expected = new Date('2025-10-03');
      expected.setUTCHours(0, 0, 0, 0);

      expect(result.getTime()).toBe(expected.getTime());
    });

    it('handles 30 days (default)', () => {
      const result = calculateExpiryDate(30);
      const expected = new Date('2025-11-02');
      expected.setUTCHours(0, 0, 0, 0);

      expect(result.getTime()).toBe(expected.getTime());
    });
  });

  describe('Round-trip conversion', () => {
    it('preserves date through forward and backward conversion', () => {
      const originalDate = new Date('2025-10-30');
      originalDate.setUTCHours(0, 0, 0, 0);

      const validForDays = calculateValidForDays(originalDate);
      expect(validForDays).toBe(27);

      const reconstructed = calculateExpiryDate(validForDays);

      expect(reconstructed.getTime()).toBe(originalDate.getTime());
    });

    it('handles multiple round trips', () => {
      const dates = [
        new Date('2025-10-15'),
        new Date('2025-11-01'),
        new Date('2025-12-25'),
      ];

      dates.forEach((originalDate) => {
        originalDate.setUTCHours(0, 0, 0, 0);
        const days = calculateValidForDays(originalDate);
        const reconstructed = calculateExpiryDate(days);

        expect(reconstructed.getTime()).toBe(originalDate.getTime());
      });
    });
  });

  describe('Bug regression tests', () => {
    it('fixes the original bug: Oct 30 with current time at 2:30 PM', () => {
      const userPickedDate = new Date('2025-10-30');
      userPickedDate.setUTCHours(0, 0, 0, 0);

      const validForDays = calculateValidForDays(userPickedDate);

      expect(validForDays).toBe(27);

      const reconstructed = calculateExpiryDate(validForDays);

      expect(reconstructed.getTime()).toBe(userPickedDate.getTime());
    });

    it('prevents off-by-one errors with midnight UTC', () => {
      jest.setSystemTime(new Date('2025-10-03T00:00:00Z'));
      
      const expiryDate = new Date('2025-10-30');
      expiryDate.setUTCHours(0, 0, 0, 0);
      const validForDays = calculateValidForDays(expiryDate);
      
      expect(validForDays).toBe(27);
    });

    it('prevents off-by-one errors with 6 AM UTC', () => {
      jest.setSystemTime(new Date('2025-10-03T06:00:00Z'));
      
      const expiryDate = new Date('2025-10-30');
      expiryDate.setUTCHours(0, 0, 0, 0);
      const validForDays = calculateValidForDays(expiryDate);
      
      expect(validForDays).toBe(27);
    });

    it('prevents off-by-one errors with noon UTC', () => {
      jest.setSystemTime(new Date('2025-10-03T12:00:00Z'));
      
      const expiryDate = new Date('2025-10-30');
      expiryDate.setUTCHours(0, 0, 0, 0);
      const validForDays = calculateValidForDays(expiryDate);
      
      expect(validForDays).toBe(27);
    });

    it('prevents off-by-one errors with 6 PM UTC', () => {
      jest.setSystemTime(new Date('2025-10-03T18:00:00Z'));
      
      const expiryDate = new Date('2025-10-30');
      expiryDate.setUTCHours(0, 0, 0, 0);
      const validForDays = calculateValidForDays(expiryDate);
      
      expect(validForDays).toBe(27);
    });

    it('prevents off-by-one errors with end of day UTC', () => {
      jest.setSystemTime(new Date('2025-10-03T23:59:59Z'));
      
      const expiryDate = new Date('2025-10-30');
      expiryDate.setUTCHours(0, 0, 0, 0);
      const validForDays = calculateValidForDays(expiryDate);
      
      expect(validForDays).toBe(27);
    });
  });
});
