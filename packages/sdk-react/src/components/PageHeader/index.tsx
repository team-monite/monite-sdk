import React from 'react';

import { Stack, Typography } from '@mui/material';

type PageHeaderProps = {
  title: React.ReactNode;
  extra?: React.ReactNode;
};

export const PageHeader = ({ title, extra }: PageHeaderProps) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{
      marginBottom: 3,
    }}
  >
    <Typography variant="h2">{title}</Typography>
    {extra ? <aside>{extra}</aside> : null}
  </Stack>
);
