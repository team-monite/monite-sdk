import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { ThemeSelect } from '@/components/Layout/ThemeSelect';
import { Menu } from '@/components/Menu';
import { useConfig } from '@/context/ConfigContext';
import { useSDKDemoAPI } from '@/context/SDKDemoAPIProvider.tsx';
import { ThemeConfig } from '@/types';
import {
  Avatar,
  Box,
  Drawer,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';

type DefaultLayoutProps = {
  children?: React.ReactNode;
  siderProps?: { footer?: React.ReactNode };
  themeConfig: ThemeConfig;
  setThemeConfig: (themeConfig: ThemeConfig) => void;
};

export const DefaultLayout = ({
  children,
  siderProps,
  themeConfig,
  setThemeConfig,
}: DefaultLayoutProps) => {
  const location = useLocation();
  const { api } = useSDKDemoAPI();
  const { data: user, isLoading: isUserLoading } =
    api.entityUsers.getEntityUsersMe.useQuery({});
  const [pagePadding, setPagePadding] = useState(4);
  const config = useConfig();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (location.pathname.indexOf('onboarding') > 0) setPagePadding(0);
    else setPagePadding(4);
  }, [location]);

  const isDev =
    process.env.NODE_ENV === 'development' || config?.stand === 'dev';

  return (
    <>
      <Box
        sx={{ display: 'flex', margin: 0, height: '100%', minHeight: '100vh' }}
      >
        <Drawer
          sx={{
            width: '240px',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: '240px',
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
                <Box ml={1}>
                  <Typography variant="button">
                    {user.first_name} {user.last_name}
                  </Typography>
                </Box>
              </>
            )}
            {isUserLoading && <CircularProgress size={44} />}
          </Box>
          <Box display="flex" sx={{ flex: 1 }}>
            <Menu />
          </Box>
          <Box>
            <Stack direction="column" spacing={2} mx={2} mb={2}>
              {/*Themes are unfinished.*/}
              {/*We want to show the theme switcher only in development mode and on the dev deployment only.*/}
              {isDev && (
                <ThemeSelect value={themeConfig} onChange={setThemeConfig} />
              )}
              {siderProps?.footer}
            </Stack>
          </Box>
        </Drawer>

        <Box
          sx={{
            display: 'flex',
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              minWidth: 0,
              minHeight: '100vh',
              p: pagePadding,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};
