import { useFinancing } from '@/components/financing/hooks';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { useTheme } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Money } from '@mui/icons-material';
import { Box, Button, lighten, Stack, Typography } from '@mui/material';

import { FinanceFaqWrapper } from './FinanceFaqWrapper';

export const FinanceIntegrationCard = () => {
  const { i18n } = useLingui();
  const { startFinanceSession } = useKanmonContext();
  const theme = useTheme();

  const { isLoading, isEnabled } = useFinancing();

  if (!isEnabled) {
    return null;
  }

  return (
    <Stack
      gap={4}
      sx={{ border: '1px solid #DEDEDE' }}
      borderRadius="16px"
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
          <Money
            sx={{
              color: '#3737FF',
              width: 20,
              height: 20,
            }}
          />
        </Box>
      </Box>
      <Stack gap={1}>
        <Typography variant="subtitle1">{t(
          i18n
        )`Invoice financing`}</Typography>
        <Typography variant="body1" fontWeight={400}>
          {t(
            i18n
          )`Apply for a monthly plan loans to manage your business more efficiently`}
        </Typography>
      </Stack>
      <Stack direction="row" gap={1} alignItems="center">
        <Button
          disabled={isLoading}
          onClick={() => startFinanceSession()}
          variant="outlined"
          sx={{
            px: 2,
          }}
        >{t(i18n)`Apply for loans`}</Button>

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
