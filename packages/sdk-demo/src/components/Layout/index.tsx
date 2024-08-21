import { ReactNode, useEffect } from 'react';
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
  children?: ReactNode;
  siderProps?: { footer?: ReactNode };
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
