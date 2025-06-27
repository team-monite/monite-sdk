import { vi } from 'vitest';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { useLingui } from '@lingui/react';
import { useTheme } from '@mui/material/styles';
import { renderHook, waitFor } from '@testing-library/react';

import { MoniteProvider } from './MoniteProvider';

describe('MoniteProvider', () => {
  const moniteSettingsMock = {
    entityId: '123',
    fetchToken: () =>
      Promise.resolve({
        access_token: '123213',
        token_type: 'Bearer',
        expires_in: 3600,
      }),
  };

  describe('# Themes', () => {
    test.skip('should updated primary color after deep merge', () => {
      const partialTheme = {
        colors: {
          primary: '#fff',
        },
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: (props) => (
          <MoniteProvider monite={moniteSettingsMock} theme={partialTheme}>
            <MoniteScopedProviders>{props.children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      waitFor(() =>
        expect(result.current.palette.primary.main).toBe(
          partialTheme.colors.primary
        )
      );
    });
  });

  describe('# Currency', () => {
    test('should return "100,00 $" when browser locale is German', async () => {
      vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('de-DE');

      const { result } = renderHook(() => useCurrencies(), {
        wrapper: ({ children }) => (
          <MoniteProvider monite={moniteSettingsMock}>
            <MoniteScopedProviders>{children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatCurrencyToDisplay(10000, 'USD')).toBe(
        '100,00 $'
      );
    });

    test('should return "$100,00" when browser locale is the USA', async () => {
      vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');

      const { result } = renderHook(() => useCurrencies(), {
        wrapper: ({ children }) => (
          <MoniteProvider monite={moniteSettingsMock}>
            <MoniteScopedProviders>{children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatCurrencyToDisplay(10000, 'USD')).toBe(
        '$100.00'
      );
    });

    test('should return "US$100,00" when browser locale is the UK', async () => {
      vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-GB');

      const { result } = renderHook(() => useCurrencies(), {
        wrapper: ({ children }) => (
          <MoniteProvider monite={moniteSettingsMock}>
            <MoniteScopedProviders>{children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatCurrencyToDisplay(10000, 'USD')).toBe(
        'US$100.00'
      );
    });

    test('should return "US$100,00" when user set `de` code', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: ({ children }) => (
          <MoniteProvider monite={moniteSettingsMock} locale={{ code: 'de' }}>
            <MoniteScopedProviders>{children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatCurrencyToDisplay(10000, 'USD')).toBe(
        '100,00 $'
      );
    });

    test('should return "US$100,00" when user set `en` code', async () => {
      const { result } = renderHook(() => useCurrencies(), {
        wrapper: ({ children }) => (
          <MoniteProvider monite={moniteSettingsMock} locale={{ code: 'en' }}>
            <MoniteScopedProviders>{children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.formatCurrencyToDisplay(10000, 'USD')).toBe(
        '$100.00'
      );
    });
  });

  describe('# Date format', () => {
    test('check that currency locale is correct after setting it by user', async () => {
      const { result } = renderHook(() => useLingui(), {
        wrapper: ({ children }) => (
          <MoniteProvider
            monite={moniteSettingsMock}
            locale={{ code: 'de-DE' }}
          >
            <MoniteScopedProviders>{children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      const value = new Date('2021-05-31T00:00:00.000Z');

      await waitFor(() => expect(result.current.i18n.locale).toBe('de-DE'));
      expect(
        result.current.i18n.date(value, DateTimeFormatOptions.EightDigitDate)
      ).toBe('31.05.2021');
    });

    test('check that cucerrency locale is correct after setting it by user', async () => {
      const { result } = renderHook(() => useLingui(), {
        wrapper: ({ children }) => (
          <MoniteProvider
            monite={moniteSettingsMock}
            locale={{ code: 'en-US' }}
          >
            <MoniteScopedProviders>{children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      const value = new Date('2021-05-31T00:00:00.000Z');

      await waitFor(() => expect(result.current.i18n.locale).toBe('en-US'));

      expect(
        result.current.i18n.date(value, DateTimeFormatOptions.EightDigitDate)
      ).toBe('05/31/2021');
    });

    test('check that cucerrency locale is correct after setting it by user', async () => {
      const { result } = renderHook(() => useLingui(), {
        wrapper: ({ children }) => (
          <MoniteProvider
            monite={moniteSettingsMock}
            locale={{ code: 'en-GB' }}
          >
            <MoniteScopedProviders>{children}</MoniteScopedProviders>
          </MoniteProvider>
        ),
      });

      const value = new Date('2021-05-31T00:00:00.000Z');

      await waitFor(() => expect(result.current.i18n.locale).toBe('en-GB'));

      expect(
        result.current.i18n.date(value, DateTimeFormatOptions.EightDigitDate)
      ).toBe('31/05/2021');
    });
  });
});
