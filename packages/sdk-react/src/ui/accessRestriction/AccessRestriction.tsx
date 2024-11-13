import { ReactNode } from 'react';

import { useDialog } from '@/components/Dialog';
import { CenteredContentBox } from '@/ui/box';
import { IconWrapper } from '@/ui/iconWrapper';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import { Box, Grid, Stack, Typography } from '@mui/material';

export interface AccessRestrictionProps {
  title?: ReactNode;
  description?: ReactNode;
}

export const AccessRestriction = (props: AccessRestrictionProps) => {
  const className = 'Monite-AccessRestriction';
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
    <>
      {dialogContext && (
        <Grid container padding={2} className={className + '-InDialog-Header'}>
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
      <CenteredContentBox className={className + '-Content'}>
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
    </>
  );
};
