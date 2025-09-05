import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { type APISchema, createAPIClient } from '@monite/sdk-react';
import {
  Avatar,
  Box,
  Drawer,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';
import { type QraftContextValue } from '@openapi-qraft/react';
import {
  createSecureRequestFn,
  QraftSecureRequestFn,
} from '@openapi-qraft/react/Unstable_QraftSecureRequestFn';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import {
  Component,
  createContext,
  ReactNode,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import { useLocation } from 'react-router-dom';

// ==============================================================================
// EntityIdLoader Components
// ==============================================================================

type EntityIdLoaderBaseProps = {
  apiUrl: string;
  fetchToken: () => Promise<
    APISchema.components['schemas']['AccessTokenResponse']
  >;
};

export const EntityIdLoader = ({
  children,
  fetchToken,
  apiUrl,
}: EntityIdLoaderBaseProps & {
  children: (entityId: string) => ReactNode;
}) => {
  return (
    <EntityIdLoaderProvider fetchToken={fetchToken} apiUrl={apiUrl}>
      <ErrorBoundary>
        <EntityIdLoaderRenderCallback>{children}</EntityIdLoaderRenderCallback>
      </ErrorBoundary>
    </EntityIdLoaderProvider>
  );
};

const EntityIdLoaderProvider = ({
  children,
  apiUrl,
  fetchToken,
}: EntityIdLoaderBaseProps & { children: ReactNode }) => {
  const requestFn = useMemo(
    () => createEntityUsersMyEntityRequestFn(fetchToken),
    [fetchToken]
  );

  return (
    <EntityIdContext.Provider
      value={{
        requestFn,
        baseUrl: apiUrl,
      }}
    >
      {children}
    </EntityIdContext.Provider>
  );
};

const EntityIdLoaderRenderCallback = ({
  children,
}: {
  children: (entityId: string) => ReactNode;
}) => {
  const { api } = createAPIClient({ context: EntityIdContext });
  const getEntityUsersMeQuery =
    api.entityUsers.getEntityUsersMyEntity.useSuspenseQuery(
      {},
      {
        // Keep entity user data in cache indefinitely,
        // as it's unlikely to change during iframe app lifecycle.
        staleTime: Infinity,
        gcTime: Infinity,
      }
    );

  return <>{children(getEntityUsersMeQuery.data.id)}</>;
};

export const createEntityUsersMyEntityRequestFn = (
  fetchToken: EntityIdLoaderBaseProps['fetchToken']
) => {
  const { requestFn: moniteRequestFn } = createAPIClient();

  return createSecureRequestFn(
    {
      async HTTPBearer() {
        const { access_token } = await fetchToken();
        return {
          token: access_token,
          refreshInterval: Infinity,
        };
      },
    },
    moniteRequestFn,
    new QueryClient()
  );
};

const EntityIdContext = createContext<QraftContextValue>(undefined);

// ==============================================================================
// SDKDemoAPIProvider
// ==============================================================================

export const SDKDemoAPIProvider = ({
  children,
  apiUrl,
  entityId,
  fetchToken,
}: {
  children: ReactNode;
  apiUrl: string;
  entityId: string | undefined;
  fetchToken: () => Promise<{
    access_token: string;
    expires_in: number;
    token_type: string;
  }>;
}) => {
  const queryClient = useQueryClient();

  const { requestFn, api, version } = useMemo(
    () => createAPIClient({ context: SDKDemoQraftContext, entityId }),
    [entityId]
  );

  return (
    <QraftSecureRequestFn
      requestFn={requestFn}
      securitySchemes={{
        HTTPBearer: async () => {
          const { access_token } = await fetchToken();
          return {
            token: access_token,
            refreshInterval: 10 * 60_000,
          };
        },
      }}
    >
      {(securedRequestFn) => (
        <SDKDemoQraftContext.Provider
          value={{
            requestFn: securedRequestFn,
            baseUrl: apiUrl,
            queryClient: queryClient,
          }}
        >
          <SDKDemoAPIContext.Provider
            value={{
              api,
              version,
              requestFn: securedRequestFn,
            }}
          >
            {children}
          </SDKDemoAPIContext.Provider>
        </SDKDemoQraftContext.Provider>
      )}
    </QraftSecureRequestFn>
  );
};

const SDKDemoQraftContext = createContext<QraftContextValue>(undefined);
const SDKDemoAPIContext = createContext<ReturnType<typeof createAPIClient>>(
  undefined!
);

export const useSDKDemoAPI = () => {
  const value = useContext(SDKDemoAPIContext);
  if (!value) {
    throw new Error('useSDKDemoAPI must be used within a SDKDemoAPIProvider');
  }
  return value;
};

// ==============================================================================
// SDKDemoI18nProvider
// ==============================================================================

export const SDKDemoI18nProvider = ({
  children,
  localeCode,
  messages,
}: {
  children: ReactNode;
  localeCode: string;
  messages?: Record<string, unknown>;
}) => {
  const sdkDemoI18n = useMemo(() => {
    return setupI18n({
      locale: localeCode,
      messages: {
        [localeCode]: messages || {},
      },
    });
  }, [localeCode, messages]);

  return <I18nProvider i18n={sdkDemoI18n}>{children}</I18nProvider>;
};

// ==============================================================================
// DefaultLayout Component
// ==============================================================================

type DefaultLayoutProps = {
  children?: ReactNode;
  siderProps?: { footer?: ReactNode };
  MenuComponent?: React.ComponentType;
};

export const DefaultLayout = ({
  children,
  siderProps,
  MenuComponent,
}: DefaultLayoutProps) => {
  const location = useLocation();
  const { api } = useSDKDemoAPI();
  const { data: user, isLoading: isUserLoading } =
    api.entityUsers.getEntityUsersMe.useQuery({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const drawerWidth = '240px';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          m: 0,
          height: '100vh',
          width: '100vw',
        }}
      >
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            {!isUserLoading && user && (
              <>
                <Avatar
                  sx={{ width: 44, height: 44 }}
                  alt={user.first_name}
                  src={user.userpic_file_id || undefined}
                />
                <Typography
                  ml={1}
                  variant="button"
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  {user.first_name} {user.last_name}
                </Typography>
              </>
            )}
            {isUserLoading && <CircularProgress size={44} />}
          </Box>
          <Box display="flex" sx={{ flex: 1 }}>
            {MenuComponent && <MenuComponent />}
          </Box>
          <Box>
            <Stack direction="column" spacing={2} mx={2} mb={2}>
              {siderProps?.footer}
            </Stack>
          </Box>
        </Drawer>

        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            height: 'inherit',
            position: 'relative',
            width: `calc(100vw - ${drawerWidth})`,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

// ==============================================================================
// Error Boundary
// ==============================================================================

type ErrorBoundaryProps = {
  children: ReactNode;
};

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  {
    isError: boolean;
  }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { isError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { isError: true, error: error };
  }

  render() {
    if (this.state.isError) return null;
    return this.props.children;
  }
}
