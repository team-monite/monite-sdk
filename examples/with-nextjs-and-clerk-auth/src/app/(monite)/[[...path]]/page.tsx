'use client';

import React from 'react';

import { useMoniteContext } from '@monite/sdk-react';
import { Box, Stack, Skeleton, Container } from '@mui/material';

import { CashFlowCard } from '@/components/Dashboard/Cashflow';
import { CreateInvoiceCard } from '@/components/Dashboard/CreateInvoiceCard';
import { DuePayablesCard } from '@/components/Dashboard/DuePayables';
import { OutstandingInvoicesCard } from '@/components/Dashboard/OutstandingInvoices';

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
    <Container className="" sx={{ pt: '24px', pb: '24px' }}>
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
        </Stack>
        <Stack
          direction="row"
          spacing={3}
          useFlexGap={true}
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Box sx={{ flex: 1 }}>
            <CreateInvoiceCard />
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
              <Skeleton variant="rounded" width={'100%'} height={269} />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            {!duePayablesLoading ? (
              <DuePayablesCard duePayables={duePayables?.data} />
            ) : (
              <Skeleton variant="rounded" width={'100%'} height={269} />
            )}
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
