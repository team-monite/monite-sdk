import React from 'react';

import {
  counterpartOrganizationFixture,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { checkPermissionQueriesLoaded, Provider } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { Counterparts } from './Counterparts';

describe('Counterparts', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Counterparts />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));
      await waitFor(() => checkCounterpartQueriesLoaded(queryClient), {
        timeout: 5_000,
      });

      const createCounterpartButton = screen.findByText(t`Create New`);

      await expect(createCounterpartButton).resolves.toBeInTheDocument();
      await expect(createCounterpartButton).resolves.not.toBeDisabled();

      const invoiceCells = screen.findAllByText(
        counterpartOrganizationFixture.organization.legal_name
      );

      await expect(invoiceCells).resolves.toBeDefined();
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

      render(<Counterparts />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));

      const createCounterpartButton = screen.findByText(t`Create New`);

      await expect(createCounterpartButton).resolves.toBeInTheDocument();
      await expect(createCounterpartButton).resolves.toBeDisabled();

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

      render(<Counterparts />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));
      await waitFor(() => checkCounterpartQueriesLoaded(queryClient), {
        timeout: 5_000,
      });

      const createCounterpartButton = screen.findByText(t`Create New`);

      await expect(createCounterpartButton).resolves.toBeInTheDocument();
      await expect(createCounterpartButton).resolves.not.toBeDisabled();

      const invoiceCells = screen.findAllByText(
        counterpartOrganizationFixture.organization.legal_name
      );

      await expect(invoiceCells).resolves.toBeDefined();
    });
  });
});

function checkCounterpartQueriesLoaded(queryClient: QueryClient) {
  if (!queryClient.getQueryState(['counterparts', 'list']))
    throw new Error('Counterparts query is not executed');

  if (queryClient.getQueryState(['counterparts', 'list'])?.status !== 'success')
    throw new Error('Counterparts query failed');
}
