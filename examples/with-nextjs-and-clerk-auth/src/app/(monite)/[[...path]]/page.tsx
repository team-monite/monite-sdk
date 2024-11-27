'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { useMoniteContext } from '@monite/sdk-react';
import { Box, Stack, Skeleton } from '@mui/material';

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

import dashboardBalanceUS from './balance.svg';
import dashboardCashflowUS from './cashflow.svg';
import dashboardBalanceEU from './dashboard-widgets-1-eur.svg';
import dashboardBalanceUK from './dashboard-widgets-1-gbp.svg';
import dashboardCashflowEU from './dashboard-widgets-2-eur.svg';
import dashboardCashflowUK from './dashboard-widgets-2-gbp.svg';
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
  const dashboardBalanceImages: { [key: string]: string } = {
    US: dashboardBalanceUS, // US
    GB: dashboardBalanceUK, // UK
    AT: dashboardBalanceEU, // Austria
    BE: dashboardBalanceEU, // Belgium
    CY: dashboardBalanceEU, // Cyprus
    EE: dashboardBalanceEU, // Estonia
    FI: dashboardBalanceEU, // Finland
    FR: dashboardBalanceEU, // France
    DE: dashboardBalanceEU, // Germany
    GR: dashboardBalanceEU, // Greece
    IE: dashboardBalanceEU, // Ireland
    IT: dashboardBalanceEU, // Italy
    LV: dashboardBalanceEU, // Latvia
    LT: dashboardBalanceEU, // Lithuania
    LU: dashboardBalanceEU, // Luxembourg
    MT: dashboardBalanceEU, // Malta
    NL: dashboardBalanceEU, // Netherlands
    PT: dashboardBalanceEU, // Portugal
    SK: dashboardBalanceEU, // Slovakia
    SI: dashboardBalanceEU, // Slovenia
    ES: dashboardBalanceEU, // Spain
  };
  const dashboardCashflowImages: { [key: string]: string } = {
    US: dashboardCashflowUS, // US
    GB: dashboardCashflowUK, // UK
    AT: dashboardCashflowEU, // Austria
    BE: dashboardCashflowEU, // Belgium
    CY: dashboardCashflowEU, // Cyprus
    EE: dashboardCashflowEU, // Estonia
    FI: dashboardCashflowEU, // Finland
    FR: dashboardCashflowEU, // France
    DE: dashboardCashflowEU, // Germany
    GR: dashboardCashflowEU, // Greece
    IE: dashboardCashflowEU, // Ireland
    IT: dashboardCashflowEU, // Italy
    LV: dashboardCashflowEU, // Latvia
    LT: dashboardCashflowEU, // Lithuania
    LU: dashboardCashflowEU, // Luxembourg
    MT: dashboardCashflowEU, // Malta
    NL: dashboardCashflowEU, // Netherlands
    PT: dashboardCashflowEU, // Portugal
    SK: dashboardCashflowEU, // Slovakia
    SI: dashboardCashflowEU, // Slovenia
    ES: dashboardCashflowEU, // Spain
  };

  const { api } = useMoniteContext();
  const { data: entity, isLoading } =
    api.entityUsers.getEntityUsersMyEntity.useQuery();
  const getDashboardCashFlowImage = (countryCode?: string) =>
    countryCode && countryCode in dashboardCashflowImages
      ? dashboardCashflowImages[countryCode]
      : dashboardCashflowUS;

  const getDashboardBalanceImage = (countryCode?: string) =>
    countryCode && countryCode in dashboardBalanceImages
      ? dashboardBalanceImages[countryCode]
      : dashboardBalanceUS;

  const currentCountry = entity?.address.country;

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="center">
      {isLoading ? (
        <>
          <p>
            <Skeleton variant="rounded" width={1127} height={150} />
          </p>
          <p>
            <Skeleton variant="rounded" width={1127} height={400} />
          </p>
          <p>
            <Skeleton variant="rounded" width={1127} height={150} />
          </p>
          <p>
            <Skeleton variant="rounded" width={1127} height={150} />
          </p>
        </>
      ) : (
        <>
          <Image priority src={dashboardHeader} alt="" />
          <Image
            priority
            alt=""
            src={getDashboardBalanceImage(currentCountry)}
          />
          <Image
            priority
            src={getDashboardCashFlowImage(currentCountry)}
            alt=""
          />
        </>
      )}
    </Stack>
  );
};

const Dashboard = () => {
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
  );
};

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
