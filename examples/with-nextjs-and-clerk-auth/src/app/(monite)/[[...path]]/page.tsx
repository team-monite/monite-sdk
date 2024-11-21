'use client';

import { useEffect, useState, SyntheticEvent } from 'react';

import Image from 'next/image';

import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';

import { CashCard } from '@/components/CashCard';
import DashboardCard from '@/components/DashboardCard';
import EmptyState from '@/components/EmptyState';
import {
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
  const [useMockup, setUseMockup] = useState(true);

  useEffect(() => {
    const showNewDashboard =
      localStorage.getItem('showNewDashboard') === 'true';

    setUseMockup(!showNewDashboard);
  }, []);

  return (
    <Box className="Monite-PageContainer Monite-Dashboard">
      {useMockup ? <DashboardMockup /> : <Dashboard />}
    </Box>
  );
}

const DashboardMockup = () => {
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="center">
      <Image priority src={dashboardHeader} alt="" />
      <Image priority src={dashboardBalance} alt="" />
      <Image priority src={dashboardCashflow} alt="" />
    </Stack>
  );
};

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState<number>(1);
  const changeTab = (_event: SyntheticEvent, newTab: number) =>
    setCurrentTab(newTab);

  return (
    <>
      <Typography variant="h2">Dashboard</Typography>
      <Tabs
        value={currentTab}
        onChange={changeTab}
        sx={{ mt: 4 }}
        textColor="secondary"
      >
        <Tab label="Overview" value={1} />
        <Tab label="Xue’s view" value={2} disabled />
      </Tabs>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ mt: 3 }}
      >
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
            <OutstandingInvoicesCard />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DuePayablesCard />
          </Box>
        </Stack>
      </Stack>
    </>
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

const OutstandingInvoicesCard = () => {
  const emptyState = (
    <EmptyState renderIcon={(props) => <IconSmilyFace {...props} />}>
      All looks good! All invoices are collected.
    </EmptyState>
  );

  return (
    <DashboardCard
      title="Outstanding invoices"
      renderIcon={(props) => <IconReceipt {...props} />}
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
      renderIcon={(props) => <IconPayable {...props} />}
      iconVariant="critical"
    >
      {emptyState}
    </DashboardCard>
  );
};
