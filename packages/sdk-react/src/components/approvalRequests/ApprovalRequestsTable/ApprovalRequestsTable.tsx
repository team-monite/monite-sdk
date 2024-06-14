import React from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export const ApprovalRequestsTable = () => {
  return (
    <Box
      sx={{ padding: 2, width: '100%', height: '100%' }}
      className={ScopedCssBaselineContainerClassName}
    >
      <Box sx={{ marginBottom: 2 }}>{`Filters`}</Box>
      <DataGrid columns={[]} rows={[]} />
    </Box>
  );
};
