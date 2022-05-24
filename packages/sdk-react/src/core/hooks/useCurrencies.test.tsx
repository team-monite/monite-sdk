import { createRenderWithClient } from '@/utils/test-utils';
import { CurrencyEnum } from '@monite/sdk-api';
import { renderHook, waitFor } from '@testing-library/react';

import { useCurrencies } from './useCurrencies';

describe('useCurrencies', () => {
  describe('# getSymbolFromCurrency', () => {
    test('should return $ sign when we provided currensy as USD', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.getSymbolFromCurrency(CurrencyEnum.USD)).toBe('$');
    });

    test('should return € sign when we provided currensy as EUR', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.getSymbolFromCurrency(CurrencyEnum.EUR)).toBe('€');
    });

    test('should return ₸ sign when we provided currensy as KZT', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.getSymbolFromCurrency(CurrencyEnum.KZT)).toBe('₸');
    });

    test('should return "bitcoin" text when we provided unsupported currency', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.getSymbolFromCurrency('bitcoin')).toBe('bitcoin');
    });
  });

  describe('# formatFromMinorUnits', () => {
    test('should return 100 (usd) when we provide 10000 minor units', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        result.current.formatFromMinorUnits(10_000, CurrencyEnum.USD)
      ).toBe(100);
    });

    test('should return 10 (yen) when we provide 10 minor units', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatFromMinorUnits(10, CurrencyEnum.JPY)).toBe(
        10
      );
    });

    test('should return 1 (tunisian dinar) when we provide 1000 minor units', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatFromMinorUnits(1_000, CurrencyEnum.TND)).toBe(
        1
      );
    });

    test('should return "null" when the currency is not in the list', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatFromMinorUnits(1, 'unavailable')).toBe(null);
    });
  });

  describe('# formatToMinorUnits', () => {
    test('should return 10000 minor units when we provide 100 usd', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatToMinorUnits(100, CurrencyEnum.USD)).toBe(
        10_000
      );
    });

    test('should return 10 minor units when we provide 10 yen', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatToMinorUnits(10, CurrencyEnum.JPY)).toBe(10);
    });

    test('should return 1000 minor units when we provide 1 tunisian dinar', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatToMinorUnits(1, CurrencyEnum.TND)).toBe(
        1_000
      );
    });

    test('should return "null" when the currency is not in the list', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatToMinorUnits(1, 'unavailable')).toBe(null);
    });
  });

  describe('# formatCurrencyToDisplay', () => {
    test('should return "100,00 $" when we provide 10000 minor units in browser locale format', async () => {
      jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('de-DE');

      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        result.current.formatCurrencyToDisplay(10000, CurrencyEnum.USD)
      ).toBe('100,00 $');
    });

    test('should return "$100.00" when we provide 10000 minor units in United States format', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient({
          providerOptions: {
            locale: {
              code: 'en-US',
            },
          },
        }),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(
        result.current.formatCurrencyToDisplay(10000, CurrencyEnum.USD)
      ).toBe('$100.00');
    });

    test('should return "￥10" when we provide 10 minor units in Japanese format in Japanese Yen currency', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient({
          providerOptions: {
            locale: {
              code: 'ja-JP',
            },
          },
        }),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatCurrencyToDisplay(10, CurrencyEnum.JPY)).toBe(
        '￥10'
      );
    });

    test('should return "null" when the currency is not in the list', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: createRenderWithClient(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatCurrencyToDisplay(1, 'unavailable')).toBe(
        null
      );
    });
  });
});
