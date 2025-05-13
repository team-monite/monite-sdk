'use client';

import React from 'react';

import dynamic from 'next/dynamic';

import { Box } from '@mui/material';

const SignedIn = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.SignedIn),
  { ssr: false }
);

const UserButton = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.UserButton),
  { ssr: false }
);

const OrganizationSwitcher = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.OrganizationSwitcher),
  { ssr: false }
);

export function UserMenu() {
  return (
    <Box display="flex" flexDirection="row" gap={2} mt={4} mx={3} mb={3}>
      <SignedIn>
        <UserButton />
        <OrganizationSwitcher hidePersonal={true} />
      </SignedIn>
    </Box>
  );
}
