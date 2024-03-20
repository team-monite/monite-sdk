import React from 'react';

import { ApprovalPolicies } from '@/components';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { checkPermissionQueriesLoaded, Provider } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { Permissions } from './Permissions';

describe('Permissions', () => {
  describe('# Permissions', () => {
    test('support "read" permissions for User Roles', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Permissions />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));
      await waitFor(() => checkRoleQueriesLoaded(queryClient));

      const roleCell = await screen.findByText(t`Read only permission role`);

      expect(roleCell).toBeInTheDocument();
    });

    test('support "read" permissions for Approval Policies', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Permissions />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));

      const approvalPolicyTab = await screen.findByRole('tab', {
        name: t`Approval Policies`,
      });

      approvalPolicyTab.click();

      await waitFor(() => checkApprovalPolicyQueriesLoaded(queryClient));

      const approvalPolicyCell = await screen.findByText(
        t`Users from the list`
      );

      expect(approvalPolicyCell).toBeInTheDocument();
    });

    test('support empty permissions', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Permissions />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));

      await expect(
        screen.findByText(t`Access Restricted`, { selector: 'h3' })
      ).resolves.toBeInTheDocument();
    });

    test('support "allowed_for_own"access for "read" permissions for User Roles', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Permissions />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));
      await waitFor(() => checkRoleQueriesLoaded(queryClient));

      const roleCell = await screen.findByText(t`Read only permission role`);

      expect(roleCell).toBeInTheDocument();
    });

    test('support "allowed_for_own" access for "read" permissions for Approval Policies', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Permissions />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));

      const approvalPolicyTab = await screen.findByRole('tab', {
        name: t`Approval Policies`,
      });

      approvalPolicyTab.click();

      await waitFor(() => checkApprovalPolicyQueriesLoaded(queryClient));

      const approvalPolicyCell = await screen.findByText(
        t`Users from the list`
      );

      expect(approvalPolicyCell).toBeInTheDocument();
    });
  });
});

function checkRoleQueriesLoaded(queryClient: QueryClient) {
  if (
    !queryClient.getQueryState(['roles'], {
      exact: false,
    })
  )
    throw new Error('Roles query is not executed');

  if (
    queryClient.getQueryState(['roles'], { exact: false })?.status !== 'success'
  )
    throw new Error('Roles query failed');
}

function checkApprovalPolicyQueriesLoaded(queryClient: QueryClient) {
  if (
    !queryClient.getQueryState(['approval_policies'], {
      exact: false,
    })
  )
    throw new Error('Approval Policies query is not executed');

  if (
    queryClient.getQueryState(['approval_policies'], { exact: false })
      ?.status !== 'success'
  )
    throw new Error('Approval Policies query failed');
}
