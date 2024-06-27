import { ComponentProps, ElementType, lazy, ReactNode, Suspense } from 'react';
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';

import { css, Global } from '@emotion/react';
import { RootElementsProvider } from '@monite/sdk-react';

import { DropInMoniteProvider } from '../lib/DropInMoniteProvider.tsx';

type ProviderProps = Pick<
  ComponentProps<typeof DropInMoniteProvider>,
  'locale' | 'theme'
>;

export const MoniteApp = ({
  disabled,
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
  disabled?: boolean;
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
  if (disabled) return null;

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
          <Suspense>
            <Widget />
          </Suspense>
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

export type WidgetType =
  | 'payables'
  | 'receivables'
  | 'counterparts'
  | 'products'
  | 'tags'
  | 'approval-policies'
  | 'onboarding';

const mapComponentTypeToWidget: Record<WidgetType, ElementType> = {
  payables: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Payables,
    }))
  ),
  receivables: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Receivables,
    }))
  ),
  counterparts: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Counterparts,
    }))
  ),
  products: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Products,
    }))
  ),
  tags: lazy(() =>
    import('@monite/sdk-react').then((module) => ({ default: module.Tags }))
  ),
  onboarding: lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.Onboarding,
    }))
  ),
  'approval-policies': lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.ApprovalPolicies,
    }))
  ),
};

export const supportedRouters = {
  browser: BrowserRouter,
  hash: HashRouter,
  memory: MemoryRouter,
} as const;
