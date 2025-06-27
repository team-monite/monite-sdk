'use client';

import React from 'react';

import dynamic from 'next/dynamic';

import { useUser } from '@clerk/nextjs';
import { Box, Stack, Skeleton } from '@mui/material';

const MoniteComponents = dynamic(
  () => import('@/components/MoniteClientComponents'),
  {
    ssr: false,
    loading: () => (
      <Stack spacing={3} sx={{ width: '100%' }}>
        <Skeleton variant="rounded" width={'100%'} height={200} />
        <Skeleton variant="rounded" width={'100%'} height={300} />
        <Stack direction="row" spacing={3}>
          <Skeleton variant="rounded" width={'100%'} height={269} />
          <Skeleton variant="rounded" width={'100%'} height={269} />
        </Stack>
      </Stack>
    ),
  }
);

export default function DefaultPage() {
  const { user } = useUser();

  return (
    <Box className="Monite-PageContainer Monite-Dashboard">
      <Stack direction="column" justifyContent="flex-start" alignItems="center">
        <Stack
          direction="row"
          spacing={3}
          useFlexGap={true}
          justifyContent="space-between"
          alignItems={'center'}
          sx={{ width: '100%', mb: '24px' }}
        >
          <h1 style={{ fontSize: '24px', lineHeight: '40px' }}>
            Welcome{user?.firstName ? `, ${user?.firstName}` : ''}!
          </h1>
        </Stack>
        <MoniteComponents />
      </Stack>
    </Box>
  );
}
