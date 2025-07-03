import { ReactNode } from 'react';

import { Stack, Typography } from '@mui/material';

type PageHeaderProps = {
  title: ReactNode;
  extra?: ReactNode;
  className?: string;
};

export const PageHeader = ({ title, extra, className }: PageHeaderProps) => (
  <Stack
    className={className}
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
