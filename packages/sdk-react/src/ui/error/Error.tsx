import { useDialog } from '@/components';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { CenteredContentBox } from '@/ui/box';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import type { FallbackRender } from '@sentry/react';

type ErrorProps = Parameters<FallbackRender>[0];

export const Error = (props: ErrorProps) => (
  <MoniteScopedProviders>
    <ErrorBase {...props} />
  </MoniteScopedProviders>
);

const ErrorBase = (props: ErrorProps) => {
  const dialogContext = useDialog();
  const { i18n } = useLingui();

  const title = t(i18n)`Something went wrong`;
  const description = props.error.toString();

  return (
    <>
      {dialogContext && (
        <Grid container padding={2}>
          <Grid item xs={11} />
          <Grid item xs={1}>
            <IconWrapper
              onClick={dialogContext.onClose}
              color="inherit"
              aria-label="close"
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
            <Typography variant="h3">{title}</Typography>
            <Typography variant="body2">{description}</Typography>
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                onClick={props.resetError}
                endIcon={<CachedIcon fontSize="small" />}
              >{t(i18n)`Try again`}</Button>
              <Button
                variant="outlined"
                href="https://docs.monite.com/docs/support"
                endIcon={<OpenInNewIcon fontSize="small" />}
              >
                {t(i18n)`Contact support`}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CenteredContentBox>
    </>
  );
};
