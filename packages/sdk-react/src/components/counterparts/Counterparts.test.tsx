import {
  counterpartOrganizationFixture,
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { Provider, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { Counterparts } from './Counterparts';

describe.skip('Counterparts', () => {
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

      await waitUntilTableIsLoaded();

      const createCounterpartButton = await screen.findByText(t`Create New`);

      expect(createCounterpartButton).toBeInTheDocument();
      expect(createCounterpartButton).not.toBeDisabled();

      const invoiceCells = screen.findAllByText(
        counterpartOrganizationFixture.organization.legal_name
      );

      await expect(invoiceCells).resolves.toBeDefined();
    });

    test('support empty permissions', async () => {
      const monite = {
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      };

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Counterparts />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} monite={monite} children={children} />
        ),
      });

      await waitUntilTableIsLoaded();

      const createCounterpartButton = await screen.findByText(t`Create New`);

      expect(createCounterpartButton).toBeInTheDocument();
      expect(createCounterpartButton).toBeDisabled();

      await expect(
        screen.findByText(t`Access Restricted`, { selector: 'h3' })
      ).resolves.toBeInTheDocument();
    });

    test('support "allowed_for_own" access for "read" and "create" permissions', async () => {
      const monite = {
        entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      };

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Counterparts />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} monite={monite} children={children} />
        ),
      });

      await waitUntilTableIsLoaded();

      const createCounterpartButton = await screen.findByText(t`Create New`);

      expect(createCounterpartButton).toBeInTheDocument();
      expect(createCounterpartButton).not.toBeDisabled();

      const invoiceCells = await screen.findAllByText(
        counterpartOrganizationFixture.organization.legal_name
      );

      expect(invoiceCells).toBeDefined();
    });
  });
});
