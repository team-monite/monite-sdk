import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ThemeSelector } from '@/components/Layout/ThemeSelector';
import { Menu } from '@/components/Menu';
import {
  MoniteStyleProvider,
  useEntityUserByAuthToken,
} from '@monite/sdk-react';
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
};

export const DefaultLayout = ({ children, siderProps }: DefaultLayoutProps) => {
  const location = useLocation();
  const { data: user } = useEntityUserByAuthToken();
  const [pagePadding, setPagePadding] = useState(4);

  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (location.pathname.indexOf('onboarding') > 0) setPagePadding(0);
    else setPagePadding(4);
  }, [location]);

  return (
    <MoniteStyleProvider>
      <Box
        sx={{ display: 'flex', margin: 0, height: '100%', minHeight: '100vh' }}
      >
        <Drawer
          PaperProps={{ sx: { backgroundColor: '#f3f3f3' } }}
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
            {user ? (
              <>
                <Avatar
                  sx={{ width: 44, height: 44 }}
                  alt={user.first_name}
                  // HACK: src as `undefined` doesn't trigger the fallback to alt text. It requires a string with broken url.
                  src={user.userpic_file_id ?? '/'}
                />
                <Box ml={1}>
                  <Typography variant="button">
                    {user.first_name} {user.last_name}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
          <Menu />
          <Box
            sx={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
              p: 2,
            }}
          >
            <Stack direction="column" spacing={2} ml={2}>
              {/*Themes are unfinished.*/}
              {/*We want to show the theme switcher only in development mode and on the dev deployment only.*/}
              {(process.env.NODE_ENV === 'development' ||
                location.pathname.indexOf('dev.monite.') > 0) && (
                <ThemeSelector />
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
    </MoniteStyleProvider>
  );
};
