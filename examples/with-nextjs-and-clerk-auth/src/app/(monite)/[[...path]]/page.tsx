'use client';

import React from 'react';

import Image from 'next/image';

import { Box, Stack } from '@mui/material';

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
      <Image priority src={dashboardBalance} alt="" />
      <Image priority src={dashboardCashflow} alt="" />
    </Stack>
  );
};
