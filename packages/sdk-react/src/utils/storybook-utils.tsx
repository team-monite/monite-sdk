import { MoniteProvider } from '@/core/context/MoniteProvider';
import { entityIds } from '@/mocks/entities';
import { css, Global } from '@emotion/react';
import { apiVersion, GrantType, MoniteSDK } from '@monite/sdk-api';
import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { useQueryClient } from '@tanstack/react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  moniteLight as themeMoniteLight,
  moniteDark as themeMoniteDark,
} from '@team-monite/sdk-themes';

export const generateRandomId = () =>
  (Math.random() + 1).toString(36).substring(2);

export const generateRandomDate = () =>
  new Date(new Date().getDate() - Math.random() * 1e12).toString();

export function getRandomProperty<T = unknown>(obj: Record<string, T>): T {
  const keys = Object.keys(obj);

  return obj[keys[(keys.length * Math.random()) << 0]];
}

export function getRandomItemFromArray<T = unknown>(array: Array<T>): T {
  const randomIndex = Math.floor(Math.random() * array.length);

  return array[randomIndex];
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const ComponentWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  /**
   * We have to clean QueryClient cache when we change
   *  a story to avoid any caches between components
   */
  queryClient.removeQueries();

  return <>{children}</>;
};

export const withGlobalStorybookDecorator = (
  cb?: () => {
    monite: MoniteSDK;
  }
): any => {
  const { monite } = cb?.() ?? { monite: undefined };

  return withThemeFromJSXProvider({
    themes: {
      light: createTheme(themeMoniteLight),
      dark: createTheme(themeMoniteDark),
    },
    defaultTheme: 'light',
    Provider: (...args: any[]) => {
      const updatedArgs = monite ? { ...args[0], monite } : args[0];

      return GlobalStorybookDecorator(updatedArgs);
    },
  });
};

export const GlobalStorybookDecorator = (props: {
  children: React.ReactNode;
  theme?: ThemeOptions;
  monite?: MoniteSDK;
}) => {
  const apiUrl = 'https://api.sandbox.monite.com/v1';

  const monite = new MoniteSDK({
    entityId: entityIds[0],
    apiUrl,
    fetchToken: async () => {
      const request = {
        grant_type: GrantType.ENTITY_USER,
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
  });

  const backgroundColor =
    props.theme?.palette?.mode === 'light'
      ? '#FFFFFF'
      : props.theme?.palette?.background?.default;

  return (
    <>
      <Global
        styles={css`
          body {
            background-color: ${backgroundColor} !important;
          }
        `}
      />
      <MoniteProvider monite={props.monite ?? monite} theme={props.theme}>
        <ComponentWrapper>{props.children}</ComponentWrapper>
      </MoniteProvider>
    </>
  );
};
