import React, { ReactNode } from 'react';

import { MoniteContext, useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { Provider, renderWithClient } from '@/utils/test-utils';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DatePicker } from '@mui/x-date-pickers';
import { QueryClient } from '@tanstack/react-query';
import { act, renderHook, screen, waitFor } from '@testing-library/react';

import {
  MoniteI18nProvider,
  I18nLoader,
  getLocaleWithDefaults,
} from './MoniteI18nProvider';

describe('MoniteI18nProvider Lingui', () => {
  const type = 'Gegenstück';
  const name = 'John';

  const HelloWold = () => {
    const { i18n } = useLingui();

    return (
      <>
        <button type="reset">
          <Trans>
            Delete {type} “{name}”?
          </Trans>
        </button>
        <a href="#">{t(i18n)`Delete ${type} “${name}”?`}</a>
        <button>
          {i18n._('Delete {type} “{name}”?', { name: 'Alex', type })}
        </button>
        <p>{t(i18n)`Delete confirmation`}</p>
      </>
    );
  };

  beforeEach(async () =>
    act(() => {
      function App() {
        const moniteContext = useMoniteContext();

        return (
          <I18nLoader
            locale={{
              code: 'en',
              currencyNumberFormat: {
                display: 'symbol',
                localeCode: 'en',
              },
              messages: {
                'Delete confirmation': 'Bestätigung löschen',
                'Delete {type} “{name}”?': 'Löschen {type} "{name}"?',
              },
            }}
          >
            {(i18n) => (
              <MoniteContext.Provider
                value={{
                  ...moniteContext,
                  i18n,
                }}
              >
                <MoniteI18nProvider>
                  <HelloWold />
                </MoniteI18nProvider>
              </MoniteContext.Provider>
            )}
          </I18nLoader>
        );
      }

      return void renderWithClient(<App />);
    })
  );

  test('should render static translations with `t` macro', async () => {
    expect(await screen.findByText('Bestätigung löschen')).toBeInTheDocument();
  });

  test('should render dynamic translations with `i18n._`', async () => {
    expect(
      await screen.findByRole('button', {
        name: `Löschen ${type} "${name}"?`,
      })
    ).toBeInTheDocument();
  });

  test('should render dynamic translations with `t` macro', async () => {
    expect(
      await screen.findByRole('link', {
        name: `Löschen ${type} "${name}"?`,
      })
    ).toBeInTheDocument();
  });

  test('should render dynamic translations with `<Trans/>`', async () => {
    expect(
      await screen.findByRole('button', {
        name: `Löschen ${type} "Alex"?`,
      })
    ).toBeInTheDocument();
  });
});

describe('MoniteI18nProvider DatePicker', () => {
  const SpecificI18nLoader = ({
    code,
    children,
  }: {
    code: string;
    children: ReactNode;
  }) => {
    const moniteContext = useMoniteContext();

    return (
      <I18nLoader
        locale={{
          code,
          currencyNumberFormat: { localeCode: code, display: 'symbol' },
        }}
      >
        {(i18n, dateFnsLocale) => (
          <MoniteContext.Provider
            value={{
              ...moniteContext,
              i18n,
              dateFnsLocale,
            }}
          >
            <MoniteI18nProvider>{children} </MoniteI18nProvider>
          </MoniteContext.Provider>
        )}
      </I18nLoader>
    );
  };

  test('should render "DE" format in DatePicker', async () => {
    renderWithClient(
      <SpecificI18nLoader code="de-DE">
        <DatePicker
          open
          slotProps={{
            popper: { container: null },
            dialog: { container: null },
          }}
        />
      </SpecificI18nLoader>
    );

    expect(await screen.findByLabelText('Choose date')).toHaveAttribute(
      'placeholder',
      'DD.MM.YYYY'
    );
  });

  test('should render "US" format in DatePicker', async () => {
    renderWithClient(
      <SpecificI18nLoader code="en-US">
        <DatePicker
          open
          slotProps={{
            popper: { container: null },
            dialog: { container: null },
          }}
        />
      </SpecificI18nLoader>
    );

    expect(await screen.findByLabelText('Choose date')).toHaveAttribute(
      'placeholder',
      'MM/DD/YYYY'
    );
  });
});

describe('MoniteI18nProvider currencyNumberFormat', () => {
  test('returns locale codes if specified', async () => {
    expect(
      getLocaleWithDefaults({
        code: 'de',
        currencyNumberFormat: {
          display: 'name',
          localeCode: 'fr',
        },
      })
    ).toEqual({
      code: 'de',
      currencyNumberFormat: {
        display: 'name',
        localeCode: 'fr',
      },
    });
  });

  test('returns default currency locale if not specified', async () => {
    expect(getLocaleWithDefaults({ code: 'de' })).toEqual({
      code: 'de',
      currencyNumberFormat: {
        display: 'symbol',
        localeCode: 'de',
      },
    });
  });

  test('returns default currency locale if not specified', async () => {
    expect(getLocaleWithDefaults(undefined)).toEqual({
      code: 'en-US', // Jest's default locale
      currencyNumberFormat: {
        display: 'symbol',
        localeCode: 'en-US',
      },
    });
  });

  test('supports `currencyDisplay: symbol` option', async () => {
    const queryClient = new QueryClient();

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: ({ children }) => (
        <Provider
          client={queryClient}
          children={children}
          moniteProviderProps={{
            locale: {
              code: 'en-US',
              currencyNumberFormat: {
                display: 'symbol',
                localeCode: 'de-DE',
              },
            },
          }}
        />
      ),
    });

    await waitFor(() => {
      expect(result.current.formatCurrencyToDisplay(100_00, 'USD')).toEqual(
        '100,00 $'
      );
    });
  });

  test('supports `currencyDisplay: code` option', async () => {
    const queryClient = new QueryClient();

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: ({ children }) => (
        <Provider
          client={queryClient}
          children={children}
          moniteProviderProps={{
            locale: {
              code: 'en-US',
              currencyNumberFormat: {
                display: 'code',
                localeCode: 'de-DE',
              },
            },
          }}
        />
      ),
    });

    await waitFor(() => {
      expect(result.current.formatCurrencyToDisplay(100_00, 'USD')).toEqual(
        '100,00 USD'
      );
    });
  });

  test('supports `currencyDisplay: name` option', async () => {
    const queryClient = new QueryClient();

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: ({ children }) => (
        <Provider
          client={queryClient}
          children={children}
          moniteProviderProps={{
            locale: {
              code: 'en-US',
              currencyNumberFormat: {
                display: 'name',
                localeCode: 'de-DE',
              },
            },
          }}
        />
      ),
    });

    await waitFor(() => {
      expect(result.current.formatCurrencyToDisplay(100_00, 'USD')).toEqual(
        '100,00 US-Dollar'
      );
    });
  });
});
