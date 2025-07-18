import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { ReactNode } from 'react';

export const DashboardTable = ({ children }: { children: ReactNode }) => {
  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: '100%',
          'thead th': {
            fontWeight: '600',
            color: '#3E424A',
            fontSize: '13px',
            letterSpacing: '0.097px',
            padding: '8px 4px',
          },
          '& td, & th': {
            fontSize: '0.9rem',
            padding: '12px 4px',
            borderBottom: '1px solid #eee',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Due date</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};
