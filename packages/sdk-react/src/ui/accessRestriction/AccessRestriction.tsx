import React from 'react';

import { useDialog } from '@/components/Dialog';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { CenteredContentBox } from '@/ui/box';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import { Typography, Box, Stack, IconButton, Grid } from '@mui/material';

export interface AccessRestrictionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const AccessRestriction = (props: AccessRestrictionProps) => {
  const dialogContext = useDialog();
  const { i18n } = useLingui();
  const title = props.title ?? t(i18n)`Access Restricted`;
  const description = props.description ?? (
    <Trans>
      You don’t have permissions to view this page.
      <br />
      Contact your system administrator for details.
    </Trans>
  );

  return (
    <MoniteStyleProvider>
      {dialogContext && (
        <Grid container padding={2}>
          <Grid item xs={11} />
          <Grid item xs={1}>
            <IconButton
              onClick={dialogContext.onClose}
              color="inherit"
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
      <CenteredContentBox>
        <Stack alignItems="center" spacing={2}>
          <Box>
            <LockIcon fontSize="large" color="primary" />
          </Box>
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h3">{title}</Typography>
            <Typography>{description}</Typography>
          </Stack>
        </Stack>
      </CenteredContentBox>
    </MoniteStyleProvider>
  );
};
