import React, { ReactNode } from 'react';

import { MoniteContext, useMoniteContext } from '@/core/context/MoniteContext';
import {
  Provider,
  renderWithClient,
  testQueryClient,
} from '@/utils/test-utils';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DatePicker } from '@mui/x-date-pickers';
import { act, render, screen } from '@testing-library/react';

import { MoniteI18nProvider, I18nLoader } from './MoniteI18nProvider';

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

  it('should render static translations with `t` macro', async () => {
    expect(await screen.findByText('Bestätigung löschen')).toBeInTheDocument();
  });

  it('should render dynamic translations with `i18n._`', async () => {
    expect(
      await screen.findByRole('button', {
        name: `Löschen ${type} "${name}"?`,
      })
    ).toBeInTheDocument();
  });

  it('should render dynamic translations with `t` macro', async () => {
    expect(
      await screen.findByRole('link', {
        name: `Löschen ${type} "${name}"?`,
      })
    ).toBeInTheDocument();
  });

  it('should render dynamic translations with `<Trans/>`', async () => {
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
      <I18nLoader locale={{ code }}>
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

  it('should render "DE" format in DatePicker', async () => {
    renderWithClient(
      <SpecificI18nLoader code="de-DE">
        <DatePicker open />
      </SpecificI18nLoader>
    );

    expect(await screen.findByLabelText('Choose date')).toHaveAttribute(
      'placeholder',
      'DD.MM.YYYY'
    );
  });

  it('should render "US" format in DatePicker', async () => {
    renderWithClient(
      <SpecificI18nLoader code="en-US">
        <DatePicker open />
      </SpecificI18nLoader>
    );

    expect(await screen.findByLabelText('Choose date')).toHaveAttribute(
      'placeholder',
      'MM/DD/YYYY'
    );
  });
});
