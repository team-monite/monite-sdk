import React, {
  ComponentProps,
  ElementType,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  BrowserRouter,
  HashRouter,
  MemoryRouter,
  Routes,
} from 'react-router-dom';

import { css, Global } from '@emotion/react';
import { createAPIClient, RootElementsProvider } from '@monite/sdk-react';
import { Theme, ThemeOptions } from '@mui/material';
import { createSecureRequestFn } from '@openapi-qraft/react';
import { QueryClient } from '@tanstack/react-query';
import { getConfig } from '@team-monite/sdk-demo';

import { DropInMoniteProvider } from './CommonMoniteProvider.tsx';

const Payables = React.lazy(() =>
  import('@monite/sdk-react').then((module) => ({ default: module.Payables }))
);
const Receivables = React.lazy(() =>
  import('@monite/sdk-react').then((module) => ({
    default: module.Receivables,
  }))
);
const Counterparts = React.lazy(() =>
  import('@monite/sdk-react').then((module) => ({
    default: module.Counterparts,
  }))
);
const Products = React.lazy(() =>
  import('@monite/sdk-react').then((module) => ({ default: module.Products }))
);
const Tags = React.lazy(() =>
  import('@monite/sdk-react').then((module) => ({ default: module.Tags }))
);
const ApprovalPolicies = React.lazy(() =>
  import('@monite/sdk-react').then((module) => ({
    default: module.ApprovalPolicies,
  }))
);
const Onboarding = React.lazy(() =>
  import('@monite/sdk-react').then((module) => ({ default: module.Onboarding }))
);

type ProviderProps = Pick<
  ComponentProps<typeof DropInMoniteProvider>,
  'locale' | 'theme'
>;

type IframeAppProps = Pick<
  ComponentProps<typeof Router>,
  'router' | 'basename'
> &
  ProviderProps;

interface MoniteIframeAppProps extends IframeAppProps {
  theme?: ThemeOptions | Theme;
  locale?: Record<string, string>;
  fetchToken: () => Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>;
  component?: WidgetType;
  basename?: string;
  router?: keyof typeof supportedRouters;
  rootElements?: ComponentProps<typeof RootElementsProvider>['elements'];
}

const getEntityId = async (
  apiUrl: string,
  fetchToken: () => Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>
) => {
  const { api, requestFn } = createAPIClient({});
  const { id: entity_id } = await api.entityUsers.getEntityUsersMe(
    {
      parameters: {},
      baseUrl: apiUrl,
    },
    createSecureRequestFn(
      {
        async HTTPBearer() {
          const { access_token } = await fetchToken();
          return {
            token: access_token,
            refreshInterval: Infinity,
          };
        },
      },
      requestFn,
      new QueryClient()
    )
  );
  return entity_id;
};

export const IframeApp: React.FC<MoniteIframeAppProps> = ({
  theme,
  locale,
  fetchToken,
  component,
  router,
  basename,
  rootElements,
}) => {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [entityId, setEntityId] = useState<string>('');

  useEffect(() => {
    try {
      const initialize = async () => {
        const config = await getConfig();
        setApiUrl(config.api_url);
        try {
          const id = await getEntityId(config.api_url, fetchToken);
          setEntityId(id);
        } catch (error) {
          console.error(error);
          throw new Error('Error while fetching entity id');
        }
      };
      initialize();
    } catch (error) {
      console.error(error);
      throw new Error('Error while fetching config');
    }
  }, [fetchToken]);

  if (router && !(router in supportedRouters))
    throw new Error('Provided router type is not supported');

  if (!fetchToken) throw new Error('Missing required prop `fetchToken`');

  const Widget: ElementType | null =
    component && component in mapComponentTypeToWidget
      ? mapComponentTypeToWidget[component]
      : null;

  if (!Widget) throw new Error('Provided component is not supported');

  return (
    <RootElementsProvider elements={rootElements}>
      <DropInMoniteProvider
        locale={locale}
        theme={theme}
        sdkConfig={{
          entityId,
          fetchToken,
          apiUrl,
        }}
      >
        <Global
          styles={css`
            :root,
            :host {
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
              isolation: isolate;
            }

            *,
            *::before,
            *::after {
              box-sizing: border-box;
            }
          `}
        />
        <Router router={router} basename={basename}>
          <Routes>{Widget && <Widget />}</Routes>
        </Router>
      </DropInMoniteProvider>
    </RootElementsProvider>
  );
};

const Router = ({
  router,
  basename,
  children,
}: {
  router?: keyof typeof supportedRouters;
  basename?: string;
  children: ReactNode;
}) => {
  const routerType = router ?? 'memory';
  const RouterComponent = supportedRouters[routerType];

  return (
    <RouterComponent
      basename={basename}
      initialEntries={
        basename && routerType === 'memory' ? [basename] : undefined
      }
    >
      {children}
    </RouterComponent>
  );
};

type WidgetType =
  | 'payables'
  | 'receivables'
  | 'counterparts'
  | 'products'
  | 'tags'
  | 'approval-policies'
  | 'onboarding';

const mapComponentTypeToWidget: Record<WidgetType, ElementType> = {
  payables: Payables,
  receivables: Receivables,
  counterparts: Counterparts,
  products: Products,
  tags: Tags,
  onboarding: Onboarding,
  'approval-policies': ApprovalPolicies,
};

export const supportedRouters = {
  browser: BrowserRouter,
  hash: HashRouter,
  memory: MemoryRouter,
} as const;
