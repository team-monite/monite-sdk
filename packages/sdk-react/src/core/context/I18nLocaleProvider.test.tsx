import { MoniteContext, useMoniteContext } from '@/core/context/MoniteContext';
import { renderWithClient } from '@/utils/test-utils';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { act, screen } from '@testing-library/react';

import { I18nLocaleProvider, LinguiDynamicI18n } from './I18nLocaleProvider';

describe('I18nLocaleProvider', () => {
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
          <LinguiDynamicI18n
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
                <I18nLocaleProvider>
                  <HelloWold />
                </I18nLocaleProvider>
              </MoniteContext.Provider>
            )}
          </LinguiDynamicI18n>
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
