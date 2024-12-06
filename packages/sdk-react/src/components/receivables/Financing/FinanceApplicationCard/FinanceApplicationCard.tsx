import { useFinancing } from '@/core/queries/useFinancing';
import { useTheme } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  CircularProgress,
  lighten,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { MoneyIcon } from '../infographics/MoneyIcon';
import { FinanceFaqWrapper } from './FinanceFaq/FinanceFaqWrapper';

export const FinanceApplicationCard = () => {
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

  if (isLoading) {
    return <CircularProgress color="inherit" size={20} />;
  }

  if (!isEnabled) {
    return (
      <Stack
        gap={3}
        sx={{ border: '1px solid', borderColor: 'divider' }}
        borderRadius={3}
        p={3}
      >
        <Typography variant="body1">
          {t(i18n)`Financing is currently only available for US entities`}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      gap={3}
      sx={{ border: '1px solid', borderColor: 'divider' }}
      borderRadius={3}
      p={3}
    >
      <Box>
        <Box
          sx={{
            backgroundColor: lighten(theme.palette.primary.main, 0.9),
            borderRadius: '100%',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <MoneyIcon />
        </Box>
      </Box>
      <Stack gap={1}>
        <Typography variant="subtitle1">{t(
          i18n
        )`Invoice financing`}</Typography>
        <Typography variant="body1">
          {t(
            i18n
          )`Apply for a monthly plan loans to manage your business more efficiently`}
        </Typography>
      </Stack>
      <Stack direction="row" gap={1} alignItems="center">
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

        <FinanceFaqWrapper>
          {({ openModal }) => (
            <Button onClick={openModal} variant="text">{t(
              i18n
            )`Read more`}</Button>
          )}
        </FinanceFaqWrapper>
      </Stack>
    </Stack>
  );
};
