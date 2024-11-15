'use client';

import React from 'react';

import Image from 'next/image';

import { Box, Stack } from '@mui/material';

import DashboardCard from '@/components/DashboardCard';
import {
  IconUniversity,
  IconBolt,
  IconReceipt,
  IconPayable,
  IconChart,
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
  return <DashboardCard title="Cash on accounts" icon={<IconUniversity />} />;
};

const RecomendedActionsCard = () => {
  return <DashboardCard title="Recomended actions" icon={<IconBolt />} />;
};

const CashFlowCard = () => {
  return <DashboardCard title="Cash flow" icon={<IconChart />} />;
};

const OutstandingInvoicesCard = () => {
  return <DashboardCard title="Outstanding invoices" icon={<IconReceipt />} />;
};

const DuePayablesCard = () => {
  return <DashboardCard title="Due payables" icon={<IconPayable />} />;
};
