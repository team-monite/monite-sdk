import { ReactNode } from 'react';

import { MoniteContext, useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { Provider, renderWithClient } from '@/utils/test-utils';
import { useLingui, I18nProvider } from '@lingui/react';
import { DatePicker } from '@mui/x-date-pickers';
import { QueryClient } from '@tanstack/react-query';
import { act, renderHook, screen, waitFor } from '@testing-library/react';

import { I18nLoader, getLocaleWithDefaults } from './i18nUtils';
import { MoniteI18nProvider } from './MoniteI18nProvider';

describe('MoniteI18nProvider Lingui', () => {
  const type = 'Gegenstück';
  const name = 'John';

  const HelloWoldGeneral = () => {
    const { i18n } = useLingui();
    return (
      <>
        <button type="button">
          {i18n._('Delete {type} "{name}"?', { name: 'Alex', type })}
        </button>
        <a href="#">{i18n._('Delete {type} "{name}"?', { type, name })}</a>
        <p>{i18n._('Delete confirmation')}</p>
      </>
    );
  };

  const HelloWoldTransOnly = () => {
    const { i18n } = useLingui();
    const myVar = 'TEST_VAR_CONTENT';

    return (
      <button type="reset">
        {i18n._('SimpleVarTestWithElement', { myVar })}{' '}
      </button>
    );
  };

  const LinguiTestContextWrapper = ({
    code,
    messages,
    children,
  }: {
    code: string;
    messages: Record<string, string>;
    children: ReactNode;
  }) => {
    const moniteContext = useMoniteContext();

    return (
      <I18nLoader
        locale={{
          code,
          currencyNumberFormat: {
            display: 'symbol',
            localeCode: 'en',
          },
          messages,
        }}
      >
        {(i18nInstance) => (
          <MoniteContext.Provider
            value={{
              ...moniteContext,
              i18n: i18nInstance,
            }}
          >
            <I18nProvider i18n={i18nInstance}>
              <MoniteI18nProvider>{children}</MoniteI18nProvider>
            </I18nProvider>
          </MoniteContext.Provider>
        )}
      </I18nLoader>
    );
  };

  describe('General translations with i18n._', () => {
    beforeEach(() => {
      act(() => {
        renderWithClient(
          <LinguiTestContextWrapper
            code="de"
            messages={{
              'Delete confirmation': 'Bestätigung löschen',
              'Delete {type} "{name}"?': 'Löschen {type} "{name}"?',
            }}
          >
            <HelloWoldGeneral />
          </LinguiTestContextWrapper>
        );
      });
    });

    test('should render static text (paragraph)', async () => {
      expect(
        await screen.findByText('Bestätigung löschen')
      ).toBeInTheDocument();
    });

    test('should render dynamic text for button (Alex)', async () => {
      expect(
        await screen.findByRole('button', {
          name: `Löschen ${type} "Alex"?`,
        })
      ).toBeInTheDocument();
    });

    test('should render dynamic text for link (John)', async () => {
      expect(
        await screen.findByRole('link', {
          name: `Löschen ${type} "${name}"?`,
        })
      ).toBeInTheDocument();
    });
  });

  describe('Scoped translation functionality (formerly Trans component test)', () => {
    beforeEach(() => {
      act(() => {
        renderWithClient(
          <LinguiTestContextWrapper
            code="de"
            messages={{
              SimpleVarTestWithElement: 'Einfacher Test mit {myVar}',
              'Delete {type} "{name}"?': 'Löschen {type} "{name}"?',
            }}
          >
            <HelloWoldTransOnly />
          </LinguiTestContextWrapper>
        );
      });
    });

    test('should render dynamic translations using i18n._ with a local variable', async () => {
      expect(
        await screen.findByRole('button', {
          name: 'Einfacher Test mit TEST_VAR_CONTENT',
        })
      ).toBeInTheDocument();
    });
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
        {(i18n: any, dateFnsLocale: any) => (
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

  test.skip('should render "DE" format in DatePicker', async () => {
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

  test.skip('should render "US" format in DatePicker', async () => {
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
        dateFormat: {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        },
      })
    ).toEqual({
      code: 'de',
      currencyNumberFormat: {
        display: 'name',
        localeCode: 'fr',
      },
      dateFormat: {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      },
      dateTimeFormat: {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      },
    });
  });

  test('returns default locale if not specified', async () => {
    expect(getLocaleWithDefaults(undefined)).toEqual({
      code: 'en-US', // Jest's default locale
      currencyNumberFormat: {
        display: 'symbol',
        localeCode: 'en-US',
      },
      dateFormat: {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
      dateTimeFormat: {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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
        '100,00\u00A0$'
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
        '100,00\u00A0USD'
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

  test('should format with currency symbol and default locale', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(useCurrencies, {
      wrapper: ({ children }) => (
        <Provider
          client={queryClient}
          moniteProviderProps={{
            locale: getLocaleWithDefaults({ code: 'en' }),
          }}
        >
          {children}
        </Provider>
      ),
    });

    await waitFor(() => {
      expect(result.current.formatCurrencyToDisplay(100_00, 'USD')).toEqual(
        '$100.00'
      );
    });
  });

  test('should format with currency code and default locale', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(useCurrencies, {
      wrapper: ({ children }) => (
        <Provider
          client={queryClient}
          moniteProviderProps={{
            locale: getLocaleWithDefaults({
              code: 'en',
              currencyNumberFormat: { display: 'code' },
            }),
          }}
        >
          {children}
        </Provider>
      ),
    });

    await waitFor(() => {
      expect(result.current.formatCurrencyToDisplay(100_00, 'USD')).toEqual(
        'USD\u00A0100.00'
      );
    });
  });

  test('should format with currency name and default locale', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(useCurrencies, {
      wrapper: ({ children }) => (
        <Provider
          client={queryClient}
          moniteProviderProps={{
            locale: getLocaleWithDefaults({
              code: 'en',
              currencyNumberFormat: { display: 'name' },
            }),
          }}
        >
          {children}
        </Provider>
      ),
    });

    await waitFor(() => {
      expect(result.current.formatCurrencyToDisplay(100_00, 'USD')).toEqual(
        '100.00 US dollars'
      );
    });
  });

  test('should format with custom locale code', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(useCurrencies, {
      wrapper: ({ children }) => (
        <Provider
          client={queryClient}
          moniteProviderProps={{
            locale: getLocaleWithDefaults({
              code: 'de-DE',
              currencyNumberFormat: { localeCode: 'de-DE' },
            }),
          }}
        >
          {children}
        </Provider>
      ),
    });

    await waitFor(() => {
      expect(result.current.formatCurrencyToDisplay(100_00, 'USD')).toEqual(
        '100,00\u00A0$'
      );
    });
  });

  test('should format with custom locale code and currency code', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(useCurrencies, {
      wrapper: ({ children }) => (
        <Provider
          client={queryClient}
          moniteProviderProps={{
            locale: getLocaleWithDefaults({
              code: 'de-DE',
              currencyNumberFormat: { display: 'code', localeCode: 'de-DE' },
            }),
          }}
        >
          {children}
        </Provider>
      ),
    });

    await waitFor(() => {
      expect(result.current.formatCurrencyToDisplay(100_00, 'USD')).toEqual(
        '100,00\u00A0USD'
      );
    });
  });
});
