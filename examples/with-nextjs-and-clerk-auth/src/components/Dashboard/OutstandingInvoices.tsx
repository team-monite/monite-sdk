import React from 'react';

import { format } from 'date-fns';

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
      iconVariant="success"
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
          <Link
            href={'/receivables'}
            sx={{
              display: 'inline-block',
              borderRadius: '8px',
              height: `40px`,
              fontSize: `0.9rem`,
              mt: 0.5,
              pl: 0.5,
            }}
          >
            See all ({totalOverdueInvoices})
          </Link>
        </div>
      ) : (
        emptyState
      )}
    </DashboardCard>
  );
};
