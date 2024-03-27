import React from 'react';

import { useDialog } from '@/components';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { CenteredContentBox } from '@/ui/box';
import CloseIcon from '@mui/icons-material/Close';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';

interface NotFoundProps {
  title: React.ReactNode;
  description: React.ReactNode;
}

export const NotFound = ({ title, description }: NotFoundProps) => {
  const dialogContext = useDialog();

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
            <SearchOffIcon fontSize="large" color="error" />
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
