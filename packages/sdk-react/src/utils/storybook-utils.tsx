import { ReactNode, useMemo } from 'react';

import { apiVersion } from '@/api/api-version';
import { ComponentSettings } from '@/core/componentSettings';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteProvider, MoniteSettings } from '@/core/context/MoniteProvider';
import { RootElementsProvider } from '@/core/context/RootElementsProvider';
import { messages as enLocaleMessages } from '@/core/i18n/locales/en/messages';
import { ThemeConfig } from '@/core/theme/types';
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';
import { entityIds } from '@/mocks/entities';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { deepmerge } from '@mui/utils';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import dateFnsEnUsLocale from 'date-fns/locale/en-US';

export {
  generateRandomId,
  generateRandomDate,
  getRandomProperty,
  getRandomItemFromArray,
  getSampleFromArray,
  getRandomBoolean,
  getRandomNumber,
} from '@/utils/test-utils-random';

export const withGlobalStorybookDecorator = (
  cb?: () => {
    monite?: MoniteSettings;
    theme?: Partial<ThemeConfig>;
    componentSettings?: Partial<ComponentSettings>;
  }
): any => {
  const { monite, theme, componentSettings } = cb?.() ?? {
    monite: undefined,
    theme: undefined,
    componentSettings: undefined,
  };

  return withThemeFromJSXProvider({
    Provider: (...args: any[]) => {
      return GlobalStorybookDecorator({
        ...args,
        children: args[0].children,
        monite,
        theme,
        componentSettings,
      });
    },
  });
};

/**
 * Default theme config for storybook stories.
 *
 * This theme config is used to create the default theme for storybook stories.
 */
const defaultThemeConfig: ThemeConfig = {};

/**
 * Default component settings for storybook stories.
 *
 * These settings are used to configure default functionality of the SDK components in storybook stories.
 */
const defaultComponentSettings: Partial<ComponentSettings> = {
  general: {
    iconWrapper: {
      icon: <ArrowBackIcon />,
      showCloseIcon: true,
    },
  },
  payables: {
    fieldOrder: [
      'amount',
      'document_id',
      'counterpart_id',
      'was_created_by_user_id',
      'due_date',
      'pay',
    ],
    requiredColumns: ['document_id', 'created_at'],
  },
};

export const GlobalStorybookDecorator = (props: {
  children: ReactNode;
  theme?: ThemeConfig;
  monite?: MoniteSettings;
  componentSettings?: Partial<ComponentSettings>;
}) => {
  const apiUrl = 'https://api.sandbox.monite.com/v1';

  const monite = useMemo(
    () => ({
      entityId: entityIds[0],
      apiUrl,
      fetchToken: async () => {
        const request = {
          grant_type: 'entity_user',
          client_id: 'c59964ce-d1c5-4cf3-8e22-9ab0c5e2ffc4',
          client_secret: '49b55da0-f917-4c90-a2be-e45693600bf7',
          entity_user_id: '8ee9e41c-cb3c-4f85-84c8-58aa54b09f44',
        };

        const response = await fetch(`${apiUrl}/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-monite-version': apiVersion,
          },
          body: JSON.stringify(request),
        });

        return await response.json();
      },
    }),
    []
  );

  const storybookRootElement =
    typeof document !== 'undefined' ? document.body : undefined;
  const storybookStylesElement =
    typeof document !== 'undefined' ? document.head : undefined;

  return (
    <>
      <FallbackProviders theme={deepmerge(defaultThemeConfig, props.theme)}>
        <MoniteProvider
          monite={props.monite ?? monite}
          theme={deepmerge(defaultThemeConfig, props.theme)}
          componentSettings={deepmerge(
            defaultComponentSettings,
            props.componentSettings
          )}
        >
          <RootElementsProvider
            elements={{
              root: storybookRootElement,
              styles: storybookStylesElement,
            }}
          >
            <MoniteReactQueryDevtools />
            {props.children}
          </RootElementsProvider>
        </MoniteProvider>
      </FallbackProviders>
    </>
  );
};

const MoniteReactQueryDevtools = () => {
  const { queryClient } = useMoniteContext();

  return <ReactQueryDevtools initialIsOpen={false} client={queryClient} />;
};

/**
 * Provides fallback providers for the storybook stories.
 * If a component is not wrapped in a `<MoniteScopedProviders />,
 * it will use these providers.
 */
function FallbackProviders({
  children,
  theme,
}: {
  children: ReactNode;
  theme: ThemeConfig;
}) {
  const i18n = useMemo(() => {
    return setupI18n({
      locale: 'en',
      messages: {
        en: enLocaleMessages,
      },
    });
  }, []);

  return (
    <ThemeProvider
      theme={createThemeWithDefaults(deepmerge(defaultThemeConfig, theme))}
    >
      <I18nProvider
        // Due to the imperative nature of the I18nProvider,
        // a `key` must be added to change the locale in real time
        key={i18n.locale}
        i18n={i18n}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={dateFnsEnUsLocale}
        >
          {children}
        </LocalizationProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
