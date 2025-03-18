import React from 'react';

import { format } from 'date-fns';

import { ArrowForward } from '@mui/icons-material';
import { Link, TableCell, TableRow } from '@mui/material';

import { CounterpartCellById } from '@/components/Dashboard/CounterpartCellById';
import { DashboardTable } from '@/components/Dashboard/DashboardTable';
import DashboardCard from '@/components/DashboardCard';
import EmptyState from '@/components/EmptyState';
import { IconPayable, IconSmilyFace } from '@/icons';

export const DuePayablesCard = ({
  duePayables,
}: {
  duePayables: Record<string, any>[] | undefined;
}) => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good! All bills are paid.
    </EmptyState>
  );
  const totalDuePayables = duePayables?.length;

  return (
    <DashboardCard
      title="Due payables"
      renderIcon={(props) => <IconPayable {...props} />}
      iconVariant="critical"
      action={
        <Link
          href={'/payables'}
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
          See all ({totalDuePayables})
          <ArrowForward sx={{ fontSize: '1rem' }} />
        </Link>
      }
    >
      {totalDuePayables ? (
        <div>
          <DashboardTable>
            {duePayables.slice(0, 3).map((payable) => {
              return (
                <TableRow
                  key={payable.id}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {payable.document_id}
                  </TableCell>
                  <TableCell>
                    <CounterpartCellById
                      counterpart_id={payable.counterpart_id}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {format(new Date(payable.due_date), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell align="right">
                    {' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payable.currency,
                    }).format(payable.total_amount / 100)}
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
