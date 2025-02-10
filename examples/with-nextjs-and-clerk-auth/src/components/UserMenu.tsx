'use client';

import React from 'react';

import { OrganizationSwitcher, SignedIn, UserButton } from '@clerk/nextjs';
import { Box } from '@mui/material';

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
