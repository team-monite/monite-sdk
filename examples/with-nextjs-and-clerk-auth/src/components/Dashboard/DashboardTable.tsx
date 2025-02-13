import React, { ReactNode } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export const DashboardTable = ({ children }: { children: ReactNode }) => {
  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: '100%',
          'thead th': { fontWeight: '500' },
          '& td, & th': { fontSize: '0.9rem', padding: '4px', border: 0 },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell align="right">Due date</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
