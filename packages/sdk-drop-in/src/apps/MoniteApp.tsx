import { AppCircularProgress } from '@/lib/AppCircularProgress';
import { DropInMoniteProvider } from '@/lib/DropInMoniteProvider';
import { css, Global } from '@emotion/react';
import { type APISchema, RootElementsProvider } from '@monite/sdk-react';
import {
  ComponentProps,
  ElementType,
  lazy,
  ReactNode,
  Suspense,
  useEffect,
} from 'react';
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';

type ProviderProps = Pick<
  ComponentProps<typeof DropInMoniteProvider>,
  'locale' | 'theme' | 'componentSettings'
>;

export const MoniteApp = ({
  disabled,
  router,
  basename,
  locale,
  rootElements,
  theme,
  componentSettings,
  entityId,
  component,
  apiUrl = 'https://api.dev.monite.com/v1',
  fetchToken,
  onMount,
  onUnmount,
}: {
  disabled?: boolean;
  rootElements: ComponentProps<typeof RootElementsProvider>['elements'];
  entityId?: string;
  apiUrl?: string;
  component: WidgetType;
  fetchToken?: () => Promise<
    APISchema.components['schemas']['AccessTokenResponse']
  >;
  onMount?: () => void;
  onUnmount?: () => void;
} & Pick<ComponentProps<typeof Router>, 'router' | 'basename'> &
  ProviderProps) => {
  useEffect(() => {
    return () => {
      onUnmount?.();
    };
  }, [onUnmount]);

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
        componentSettings={componentSettings}
        sdkConfig={{
          entityId,
          apiUrl,
          fetchToken,
        }}
        onThemeMounted={() => {
          onMount?.();
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
          <Suspense fallback={<AppCircularProgress />}>
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
  | 'onboarding'
  | 'user-roles'
  | 'document-templates'
  | 'template-settings';

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
  'user-roles': lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.UserRoles,
    }))
  ),
  'document-templates': lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.DocumentDesign,
    }))
  ),
  'template-settings': lazy(() =>
    import('@monite/sdk-react').then((module) => ({
      default: module.TemplateSettings,
    }))
  ),
};

export const supportedRouters = {
  browser: BrowserRouter,
  hash: HashRouter,
  memory: MemoryRouter,
} as const;
