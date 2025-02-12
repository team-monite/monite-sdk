import { useState } from 'react';

import { useFinancing } from '@/core/queries/useFinancing';
import { useTheme } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MoneyOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  lighten,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { FinanceFaqWrapper } from '../FinanceFaq/FinanceFaqWrapper';

const LOCAL_STORAGE_KEY = 'financing_banner_hidden';

export const FinanceBanner = () => {
  const { i18n } = useLingui();
  const theme = useTheme();
  const {
    displayButtonMessage,
    actionRequired,
    startFinanceSession,
    isInitializing,
    isLoading,
    isEnabled,
  } = useFinancing();

  const [isHidden, setIsHidden] = useState(
    Boolean(localStorage.getItem(LOCAL_STORAGE_KEY))
  );
  const handleHide = () => {
    setIsHidden(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

  if (isHidden) {
    return null;
  }

  if (isLoading) {
    return <Skeleton variant="rounded" height="98px" width="100%" />;
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'space-between',
        marginTop: '2px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flex: '1 1 0%',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: lighten(theme.palette.primary.main, 0.9),
            borderRadius: 3,
            p: 1,
          }}
        >
          <MoneyOutlined
            sx={{ color: lighten(theme.palette.primary.main, 0.6) }}
          />
        </Box>
        <Box sx={{ flex: '1 1 0%' }}>
          <Typography variant="subtitle2">{t(
            i18n
          )`Fund your sales/purchases`}</Typography>
          <Typography variant="body1">
            {t(
              i18n
            )`Get a small business loan plan to manage finances more efficiently.`}{' '}
            <FinanceFaqWrapper>
              {({ openModal }) => (
                <Typography
                  onClick={openModal}
                  variant="body1"
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  component="span"
                >{t(i18n)`Read more >`}</Typography>
              )}
            </FinanceFaqWrapper>
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" gap={1} alignItems="center">
        <Button onClick={handleHide} variant="text">{t(i18n)`Hide`}</Button>
        {isInitializing ? (
          <Skeleton variant="rounded" width="140px" height="32px" />
        ) : (
          displayButtonMessage && (
            <Button
              disabled={!actionRequired}
              onClick={() => {
                startFinanceSession();
              }}
              variant="outlined"
            >{t(i18n)`${displayButtonMessage}`}</Button>
          )
        )}
      </Stack>
    </Box>
  );
};
