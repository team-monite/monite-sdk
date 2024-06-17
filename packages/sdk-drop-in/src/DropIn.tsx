import { ComponentProps, ElementType, ReactNode } from 'react';
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';

import { css, Global } from '@emotion/react';
import {
  ApprovalPolicies,
  Counterparts,
  Onboarding,
  Payables,
  Products,
  Receivables,
  RootElementsProvider,
  Tags,
} from '@monite/sdk-react';

import { DropInMoniteProvider } from './CommonMoniteProvider.tsx';

type ProviderProps = Pick<
  ComponentProps<typeof DropInMoniteProvider>,
  'locale' | 'theme'
>;

export const DropIn = ({
  router,
  basename,
  locale,
  rootElements,
  theme,
  fetchToken,
  entityId,
  component,
  apiUrl = 'https://api.dev.monite.com/v1',
}: {
  rootElements: ComponentProps<typeof RootElementsProvider>['elements'];
  entityId?: string;
  apiUrl?: string;
  component: WidgetType;
  fetchToken?: () => Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>;
} & Pick<ComponentProps<typeof Router>, 'router' | 'basename'> &
  ProviderProps) => {
  if (router && !(router in supportedRouters))
    throw new Error('Provided router type is not supported');

  if (!entityId) throw new Error('Missing required prop `entityId`');

  if (!fetchToken) throw new Error('Missing required prop `fetchToken`');

  if (!component) throw new Error('Missing required prop `component`');

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
          {Widget && <Widget />}
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
