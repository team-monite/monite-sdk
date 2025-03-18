import React from 'react';

import { format } from 'date-fns';

import { ArrowForward, ArrowRight } from '@mui/icons-material';
import { Link, TableCell, TableRow } from '@mui/material';

import { CounterpartCellById } from '@/components/Dashboard/CounterpartCellById';
import { DashboardTable } from '@/components/Dashboard/DashboardTable';
import DashboardCard from '@/components/DashboardCard';
import EmptyState from '@/components/EmptyState';
import { IconReceipt, IconSmilyFace } from '@/icons';

export const OutstandingInvoicesCard = ({ overdueInvoices }: any) => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good! All invoices are collected.
    </EmptyState>
  );
  const totalOverdueInvoices = overdueInvoices?.length;

  return (
    <DashboardCard
      title="Overdue invoices"
      renderIcon={(props) => <IconReceipt {...props} />}
      action={
        <Link
          href={'/receivables'}
          sx={{
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: `0.9rem`,
            display: 'flex',
            alignItems: 'center',
            mt: 0.5,
            pl: 0.5,
          }}
        >
          See all ({totalOverdueInvoices}){' '}
          <ArrowForward sx={{ fontSize: '1rem' }} />
        </Link>
      }
    >
      {totalOverdueInvoices ? (
        <div>
          <DashboardTable>
            {overdueInvoices
              .slice(0, 3)
              .map((receivable: Record<string, any>) => {
                return (
                  <TableRow
                    key={receivable.id}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {receivable.document_id}
                    </TableCell>
                    <TableCell>
                      <CounterpartCellById
                        counterpart_id={receivable.counterpart_id}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {format(new Date(receivable.due_date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell align="right">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: receivable.currency,
                      }).format(receivable.total_amount / 100)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </DashboardTable>
        </div>
      ) : (
        emptyState
      )}
    </DashboardCard>
  );
};
