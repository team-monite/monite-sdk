import { useEffect } from 'react';
import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { ThemeSelect } from '@/components/Layout/ThemeSelect';
import { Menu } from '@/components/Menu';
import { useSDKDemoAPI } from '@/context/SDKDemoAPIProvider';
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
            <Menu />
          </Box>
          <Box>
            <Stack direction="column" spacing={2} mx={2} mb={2}>
              <ThemeSelect value={themeConfig} onChange={setThemeConfig} />
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
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};
