'use client';

import React, { useEffect, Suspense, useState } from 'react';

import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';

import { Box } from '@mui/material';

import LoadingFallback from '@/components/LoadingFallback';

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

function UserMenuContentInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle reload parameter
  useEffect(() => {
    if (!isClient) return;

    const reloadParam = searchParams.get('reload');
    if (reloadParam) {
      // Remove the reload parameter from the URL
      const newUrl =
        pathname +
        (searchParams.toString()
          ? '?' +
            new URLSearchParams(
              Array.from(searchParams.entries()).filter(
                ([key]) => key !== 'reload'
              )
            ).toString()
          : '');

      // Replace the current URL without the reload parameter
      window.history.replaceState({}, '', newUrl);

      // Force a full page reload
      window.location.reload();
    }
  }, [pathname, searchParams, isClient]);

  if (!isClient) {
    return <LoadingFallback text="Loading menu..." />;
  }

  return (
    <Box display="flex" flexDirection="row" gap={2} mt={4} mx={3} mb={3}>
      <SignedIn>
        <UserButton />
        <OrganizationSwitcher
          hidePersonal={true}
          afterSelectOrganizationUrl={`${pathname}?reload=${Date.now()}`}
          afterLeaveOrganizationUrl="/?reload=true"
        />
      </SignedIn>
    </Box>
  );
}

export function UserMenuContent() {
  return (
    <Suspense fallback={<LoadingFallback text="Loading menu..." />}>
      <UserMenuContentInner />
    </Suspense>
  );
}

export function UserMenu() {
  return <UserMenuContent />;
}
