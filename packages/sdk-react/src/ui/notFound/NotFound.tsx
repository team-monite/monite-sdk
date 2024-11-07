import { ReactNode } from 'react';

import { useDialog } from '@/components/Dialog';
import { CenteredContentBox } from '@/ui/box';
import { IconWrapper } from '@/ui/iconWrapper';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Grid, Stack, Typography } from '@mui/material';

interface NotFoundProps {
  title: ReactNode;
  description: ReactNode;
}

export const NotFound = ({ title, description }: NotFoundProps) => {
  const dialogContext = useDialog();

  return (
    <>
      {dialogContext && (
        <Grid container padding={2}>
          <Grid item xs={11} />
          <Grid item xs={1}>
            <IconWrapper
              onClick={dialogContext.onClose}
              color="inherit"
              ariaLabelOverride="close"
              showCloseIcon
              aria-label="close"
            />
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
            <Typography>{description}</Typography>
          </Stack>
        </Stack>
      </CenteredContentBox>
    </>
  );
};
