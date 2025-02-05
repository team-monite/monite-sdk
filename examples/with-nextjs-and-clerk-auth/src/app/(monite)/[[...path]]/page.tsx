'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import Image from 'next/image';

import { useMoniteContext } from '@monite/sdk-react';
import {
  Box,
  Stack,
  Skeleton,
  Button,
  Container,
  TableHead,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from '@mui/material';

import DashboardCard from '@/components/DashboardCard';
import EmptyState from '@/components/EmptyState';
import {
  IconUniversity,
  IconBolt,
  IconReceipt,
  IconPayable,
  IconChart,
  IconSmilyFace,
  IconPresentation,
} from '@/icons';

export default function DefaultPage() {
  const { api } = useMoniteContext();
  const { data: duePayables, isLoading: duePayablesLoading } =
    api.payables.getPayables.useQuery({
      query: { status: 'waiting_to_be_paid' },
    });

  const { data: overdueInvoices, isLoading: overdueInvoicesLoading } =
    api.receivables.getReceivables.useQuery({
      query: { status: 'overdue' },
    });

  return (
    <Container className="Monite-PageContainer Monite-Dashboard">
      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <Stack
          direction="row"
          spacing={3}
          useFlexGap={true}
          justifyContent="space-between"
          alignItems={'center'}
          sx={{ width: '100%', mb: '24px' }}
        >
          <h1>Dashboard</h1>
          <Button
            variant={'contained'}
            size={'medium'}
            sx={{
              borderRadius: '8px',
              height: `40px`,
              fontSize: `0.9rem`,
            }}
          >
            Quick actions
          </Button>
        </Stack>
        <Stack
          direction="row"
          spacing={3}
          useFlexGap={true}
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Box sx={{ flex: 1 }}>
            <CashCard />
          </Box>
          <Box sx={{ flex: 1 }}>
            <RecomendedActionsCard />
          </Box>
        </Stack>
        <Box sx={{ width: '100%', mt: 3 }}>
          <CashFlowCard />
        </Box>
        <Stack
          direction="row"
          spacing={3}
          useFlexGap={true}
          justifyContent="space-between"
          sx={{ width: '100%', mt: 3 }}
        >
          <Box sx={{ flex: 1 }}>
            {!overdueInvoicesLoading ? (
              <OutstandingInvoicesCard
                overdueInvoices={overdueInvoices?.data}
              />
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={200} />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            {!duePayablesLoading ? (
              <DuePayablesCard duePayables={duePayables?.data} />
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={200} />
            )}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}

const CashCard = () => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconUniversity {...props} />}>
      No bank accounts connected
    </EmptyState>
  );

  return (
    <DashboardCard
      title="Cash on accounts"
      renderIcon={(props) => <IconUniversity {...props} />}
    >
      {emptyState}
    </DashboardCard>
  );
};

const RecomendedActionsCard = () => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good!
      <br />
      No recommended actions for you at the moment.
    </EmptyState>
  );

  return (
    <DashboardCard
      title="Recomended actions"
      renderIcon={(props) => <IconBolt {...props} />}
    >
      {emptyState}
    </DashboardCard>
  );
};

const CashFlowCard = () => {
  const emptyState = (
    <EmptyState
      renderIcon={(props) => <IconPresentation {...props} />}
      vertical
    >
      Cash Flow analysis will appear when enough transaction data is available.
    </EmptyState>
  );

  return (
    <DashboardCard
      title="Cash flow"
      renderIcon={(props) => <IconChart {...props} />}
    >
      {emptyState}
    </DashboardCard>
  );
};

const DashboardTable = ({ children }: { children: ReactNode }) => {
  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: '100%',
          '& td, & th': { fontSize: '0.9rem', padding: '4px' },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Invoice #</TableCell>
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

const OutstandingInvoicesCard = ({ overdueInvoices }) => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good! All invoices are collected.
    </EmptyState>
  );
  const totalOverdueInvoices = overdueInvoices?.length;

  return (
    <DashboardCard
      title="Outstanding invoices"
      renderIcon={(props) => <IconReceipt {...props} />}
      iconVariant="success"
    >
      {totalOverdueInvoices ? (
        <div>
          <DashboardTable>
            {overdueInvoices.slice(0, 3).map((receivable) => {
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
                  <TableCell>{receivable.counterpart_id}</TableCell>
                  <TableCell align="right">{receivable.due_date}</TableCell>
                  <TableCell align="right">{receivable.total_amount}</TableCell>
                </TableRow>
              );
            })}
          </DashboardTable>
          <Link
            href={'/receivables'}
            sx={{
              borderRadius: '8px',
              height: `40px`,
              fontSize: `0.9rem`,
              mt: 2,
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

const DuePayablesCard = ({
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
                  <TableCell>{payable.counterpart_id}</TableCell>
                  <TableCell align="right">{payable.due_date}</TableCell>
                  <TableCell align="right">{payable.amount_to_pay}</TableCell>
                </TableRow>
              );
            })}
          </DashboardTable>
          <Link
            href={'/payables'}
            sx={{
              borderRadius: '8px',
              height: `40px`,
              fontSize: `0.9rem`,
              mt: 2,
            }}
          >
            See all ({totalDuePayables})
          </Link>
        </div>
      ) : (
        emptyState
      )}
    </DashboardCard>
  );
};
