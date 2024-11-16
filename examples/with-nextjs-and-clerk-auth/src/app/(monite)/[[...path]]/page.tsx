'use client';

import React from 'react';

import Image from 'next/image';

import { Box, Stack } from '@mui/material';

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

import dashboardBalance from './balance.svg';
import dashboardCashflow from './cashflow.svg';
import dashboardHeader from './header.svg';

export default function DefaultPage() {
  return (
    <Box className="Monite-PageContainer Monite-Dashboard">
      <DashboardMockup />
    </Box>
  );
}

const DashboardMockup = () => {
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="center">
      <Image priority src={dashboardHeader} alt="" />
      <Stack
        direction="row"
        spacing={3}
        useFlexGap={true}
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        <Box sx={{ width: '50%' }}>
          <CashCard />
        </Box>
        <Box sx={{ width: '50%' }}>
          <RecomendedActionsCard />
        </Box>
      </Stack>
      <Stack sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ width: '100%' }}>
          <CashFlowCard />
        </Box>
      </Stack>
      <Stack
        direction="row"
        spacing={3}
        useFlexGap={true}
        justifyContent="space-between"
        sx={{ width: '100%', mt: 3 }}
      >
        <Box sx={{ width: '50%' }}>
          <OutstandingInvoicesCard />
        </Box>
        <Box sx={{ width: '50%' }}>
          <DuePayablesCard />
        </Box>
      </Stack>

      {/* <Image priority src={dashboardBalance} alt="" />
      <Image priority src={dashboardCashflow} alt="" /> */}
    </Stack>
  );
};

const CashCard = () => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconUniversity {...props} />}>
      No bank accounts connected
    </EmptyState>
  );

  return (
    <DashboardCard title="Cash on accounts" icon={<IconUniversity />}>
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
    <DashboardCard title="Recomended actions" icon={<IconBolt />}>
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
    <DashboardCard title="Cash flow" icon={<IconChart />}>
      {emptyState}
    </DashboardCard>
  );
};

const OutstandingInvoicesCard = () => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good! All invoices are collected.
    </EmptyState>
  );

  return (
    <DashboardCard
      title="Outstanding invoices"
      icon={<IconReceipt />}
      iconVariant="success"
    >
      {emptyState}
    </DashboardCard>
  );
};

const DuePayablesCard = () => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good! All bills are paid.
    </EmptyState>
  );

  return (
    <DashboardCard
      title="Due payables"
      icon={<IconPayable />}
      iconVariant="critical"
    >
      {emptyState}
    </DashboardCard>
  );
};
