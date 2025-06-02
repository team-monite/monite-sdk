import { CenteredContentBox } from '@/ui/box';
import { IconWrapper } from '@/ui/iconWrapper';
import { useLingui } from '@lingui/react';
import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import type { FallbackRender } from '@sentry/react';


export interface ErrorBaseProps {
  error: unknown;
  componentStack?: string;
  eventId?: string;
  resetError?: () => void;
  onClose?: () => void;
  iconWrapperSettings?: {
    icon?: React.ReactNode;
    fallbackIcon?: React.ReactNode;
  };
}

export const ErrorBase = ({
  error,
  resetError,
  onClose,
  iconWrapperSettings,
}: ErrorBaseProps) => {
  const { i18n: { _ } } = useLingui();
  const safeError = error instanceof Error ? error : new Error(String(error));

  return (
    <>
      {onClose && (
        <Grid container padding={2}>
          <Grid item xs={11} />
          <Grid item xs={1}>
            <IconWrapper
              onClick={onClose}
              color="inherit"
              aria-label="close"
              iconWrapperSettings={iconWrapperSettings}
            >
              <CloseIcon />
            </IconWrapper>
          </Grid>
        </Grid>
      )}
      <CenteredContentBox>
        <Stack alignItems="center" spacing={2}>
          <Box>
            <SearchOffIcon fontSize="large" color="error" />
          </Box>
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h3">{_('Something went wrong')}</Typography>
            <Typography variant="body2">{safeError.message}</Typography>
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                onClick={resetError}
                endIcon={<CachedIcon fontSize="small" />}
              >
                {_('Try again')}
              </Button>
              <Button
                variant="outlined"
                href="https://docs.monite.com/docs/support"
                endIcon={<OpenInNewIcon fontSize="small" />}
              >
                {_('Contact support')}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CenteredContentBox>
    </>
  );
};
