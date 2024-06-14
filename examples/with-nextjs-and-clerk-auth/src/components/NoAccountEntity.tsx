'use client';

import React, { useEffect } from 'react';
import { useTimeout } from 'react-use';

import { useRouter } from 'next/navigation';

import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { Alert, Box, CircularProgress, Fade } from '@mui/material';

import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { UserButton } from '@/components/UserButton';

export const NoAccountEntity = ({
  entity_user_id,
  entity_id,
}: Record<'entity_user_id' | 'entity_id', string | null | undefined>) => {
  const { userMemberships } = useOrganizationList({
    userMemberships: true,
  });

  const {
    organization,
    defaultOrganizationId,
    setActiveOrganization,
    isLoading: switchToDefaultOrganizationIsLoading,
    isLoaded,
  } = useSwitchToDefaultOrganization();

  const isLoading =
    userMemberships.isLoading || switchToDefaultOrganizationIsLoading;

  useEffect(() => {
    if (organization) return;
    if (defaultOrganizationId)
      setActiveOrganization?.({
        organization: defaultOrganizationId,
      });
  }, [defaultOrganizationId, organization, setActiveOrganization]);

  useRouterRefreshInterval({
    enabled: isLoaded ? !(entity_id && entity_user_id) : false,
  });

  const [
    getShowAdditionalAlert,
    cancelAlertTimeout,
    resetShowAdditionalAlertTimeout,
  ] = useTimeout(30_000);

  useEffect(() => {
    if (entity_id && entity_user_id) return resetShowAdditionalAlertTimeout();
    resetShowAdditionalAlertTimeout();
  }, [entity_id, entity_user_id, resetShowAdditionalAlertTimeout]);

  useEffect(() => cancelAlertTimeout, [cancelAlertTimeout]);

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexFlow: 'column',
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          padding: 2,
          gap: 2,
          alignItems: 'flex-start',
          boxSizing: 'border-box',
          zIndex: 10,
        }}
      >
        <UserButton />
        <OrganizationSwitcher />
      </Box>

      <Box
        sx={{
          display: 'flex',
          boxSizing: 'border-box',
          flexFlow: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            marginBottom: 4,
            '& > *': {
              pointerEvents: 'auto',
            },
          }}
        >
          <CircularProgress size={32} />
        </Box>
        <Box
          sx={{
            visibility: isLoading ? 'hidden' : 'visible',
            opacity: isLoading ? 0 : 1,
            transition: '0.3s',
            transitionProperty: 'opacity, visibility',
          }}
        >
          {!entity_id ? (
            <>
              {!!userMemberships.count && (
                <>
                  <Alert severity="info" sx={{ opacity: 0.4 }}>
                    <code>entity_id</code> is not found in{' '}
                    <strong>organization</strong> private metadata
                  </Alert>
                  <Alert
                    severity="info"
                    sx={{
                      mt: 2,
                      opacity: getShowAdditionalAlert() ? 0.4 : 1,
                      transition: '0.3s',
                    }}
                  >
                    Creating Entity for Organization...{' '}
                  </Alert>
                </>
              )}
              {!userMemberships.count && !userMemberships.isLoading && (
                <Alert
                  severity="info"
                  sx={{
                    opacity: getShowAdditionalAlert() ? 0.4 : 1,
                    transition: '0.3s',
                  }}
                >
                  You are not a member of any organization
                </Alert>
              )}
            </>
          ) : !entity_user_id ? (
            <>
              <Alert severity="info" sx={{ opacity: 0.4 }}>
                <code>entity_user_id</code> is not found in{' '}
                <strong>user</strong> private metadata
              </Alert>
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  opacity: getShowAdditionalAlert() ? 0.4 : 1,
                  transition: '0.3s',
                }}
              >
                Creating Entity User...{' '}
              </Alert>
            </>
          ) : null}

          {!(entity_user_id && entity_id) && (
            <Fade in={getShowAdditionalAlert() ?? false}>
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please ask your organization Admin to add you to the
                organization <em>again</em>
              </Alert>
            </Fade>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const useRouterRefreshInterval = ({
  enabled = false,
  interval = 1000,
}) => {
  const { refresh } = useRouter();

  useEffect(() => {
    if (!enabled) return;
    const refreshInterval = setInterval(() => refresh(), interval);
    return () => clearInterval(refreshInterval);
  }, [interval, refresh, enabled]);
};

export const useSwitchToDefaultOrganization = () => {
  const { organization, isLoaded: isOrganizationLoaded } = useOrganization({
    membershipRequests: true,
  });

  const {
    userMemberships,
    setActive,
    isLoaded: isUserMembershipsLoaded,
  } = useOrganizationList({
    userMemberships: organization?.id ? undefined : true,
  });

  const isOrganizationLoading = !isOrganizationLoaded && !organization;
  const isUserMembershipsLoading = !isUserMembershipsLoaded && !userMemberships;

  return {
    organization,
    setActiveOrganization: setActive,
    isLoading: isOrganizationLoading || isUserMembershipsLoading,
    isLoaded: isOrganizationLoaded && isUserMembershipsLoaded,
    defaultOrganizationId: userMemberships.data?.at(0)?.organization.id,
  };
};
