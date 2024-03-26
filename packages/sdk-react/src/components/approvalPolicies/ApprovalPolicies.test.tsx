import React from 'react';

import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { checkPermissionQueriesLoaded, Provider } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { ApprovalPolicies } from './ApprovalPolicies';

describe('ApprovalPolicies', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<ApprovalPolicies />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));
      await waitFor(() => checkApprovalPolicyQueriesLoaded(queryClient));

      const createApprovalPolicyButton = screen.findByRole('button', {
        name: t`Create`,
      });

      await expect(createApprovalPolicyButton).resolves.toBeInTheDocument();
      await expect(createApprovalPolicyButton).resolves.not.toBeDisabled();

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
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<ApprovalPolicies />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));

      const createTagButton = screen.findByRole('button', {
        name: t`Create`,
      });

      await expect(createTagButton).resolves.toBeInTheDocument();
      await expect(createTagButton).resolves.toBeDisabled();
      await expect(
        screen.findByText(t`Access Restricted`, { selector: 'h3' })
      ).resolves.toBeInTheDocument();
    });

    test('support "allowed_for_own" access for "read" and "create" permissions', async () => {
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
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<ApprovalPolicies />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));
      await waitFor(() => checkApprovalPolicyQueriesLoaded(queryClient));

      const createApprovalPolicyButton = screen.findByRole('button', {
        name: t`Create`,
      });

      await expect(createApprovalPolicyButton).resolves.toBeInTheDocument();
      await expect(createApprovalPolicyButton).resolves.not.toBeDisabled();

      const approvalPolicyCell = screen.findByText(t`Users from the list`);
      await expect(approvalPolicyCell).resolves.toBeInTheDocument();
    });
  });
});

function checkApprovalPolicyQueriesLoaded(queryClient: QueryClient) {
  if (!queryClient.getQueryState(['approval_policies']))
    throw new Error('Approval Policies query is not executed');

  if (queryClient.getQueryState(['approval_policies'])?.status !== 'success')
    throw new Error('Approval Policies query failed');
}
