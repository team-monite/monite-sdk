import { CounterpartDataTestId } from '@/components/counterparts/Counterpart.types';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
} from '@/mocks';
import { organizationId } from '@/mocks/counterparts/counterpart.mocks.types';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { screen, within } from '@testing-library/react';

import { CounterpartView } from './CounterpartView';

describe('CounterpartView', () => {
  new MoniteSDK({
    entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
    fetchToken: () =>
      Promise.resolve({
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 3600,
      }),
  });
  const sdkWithReadPermissions = new MoniteSDK({
    entityId: ENTITY_ID_FOR_READONLY_PERMISSIONS,
    fetchToken: () =>
      Promise.resolve({
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: 3600,
      }),
  });

  describe('# Interface', () => {
    describe('# Organization information actions', () => {
      test('should show "Edit" button if the user has permissions to update counterpart information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} />
          </MoniteScopedProviders>
        );

        await waitUntilTableIsLoaded();

        const contactInformation = screen.getByTestId(
          CounterpartDataTestId.OrganizationView
        );

        const editButton = within(contactInformation).getByRole('button', {
          name: /edit/i,
        });

        expect(editButton).toBeInTheDocument();
      });

      test('should show "Delete" button if the user has permissions to delete counterpart information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} />
          </MoniteScopedProviders>
        );

        await waitUntilTableIsLoaded();

        const contactInformation = screen.getByTestId(
          CounterpartDataTestId.OrganizationView
        );

        const deleteButton = within(contactInformation).getByRole('button', {
          name: /delete/i,
        });

        expect(deleteButton).toBeInTheDocument();
      });

      test('should show "Access restricted" view if the user has no permissions to see the page', async () => {
        const monite = new MoniteSDK({
          entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
          fetchToken: () =>
            Promise.resolve({
              access_token: 'token',
              token_type: 'Bearer',
              expires_in: 3600,
            }),
        });

        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} />
          </MoniteScopedProviders>,
          monite
        );

        await waitUntilTableIsLoaded();

        const accessRestricted = await screen.findByText(/Access restricted/i);

        expect(accessRestricted).toBeInTheDocument();
      });
    });

    describe('# Bank accounts actions', () => {
      test('should show "Edit" button if the user has permissions to update bank account information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} showBankAccounts />
          </MoniteScopedProviders>
        );

        await waitUntilTableIsLoaded();

        const bankAccount = screen.getByTestId(
          CounterpartDataTestId.BankAccount
        );

        const editButtons = within(bankAccount).getAllByRole('button', {
          name: /edit/i,
        });

        expect(editButtons.length).toBeGreaterThanOrEqual(1);
      });

      test('should show "Delete" button if the user has permissions to delete bank account information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} showBankAccounts />
          </MoniteScopedProviders>
        );

        await waitUntilTableIsLoaded();

        const bankAccount = screen.getByTestId(
          CounterpartDataTestId.BankAccount
        );

        const deleteButtons = within(bankAccount).getAllByRole('button', {
          name: /delete/i,
        });

        expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
      });

      test('should NOT show "Edit" button if the user has NO permissions to update bank account information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} showBankAccounts />
          </MoniteScopedProviders>,
          sdkWithReadPermissions
        );

        await waitUntilTableIsLoaded();

        const bankAccount = screen.getByTestId(
          CounterpartDataTestId.BankAccount
        );

        const editButtons = within(bankAccount).queryAllByRole('button', {
          name: /edit/i,
        });

        expect(editButtons.length).toBe(0);
      });

      test('should NOT show "Delete" button if the user has NO permissions to delete bank account information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} showBankAccounts />
          </MoniteScopedProviders>,
          sdkWithReadPermissions
        );

        await waitUntilTableIsLoaded();

        const bankAccount = screen.getByTestId(
          CounterpartDataTestId.BankAccount
        );

        const deleteButtons = within(bankAccount).queryAllByRole('button', {
          name: /delete/i,
        });

        expect(deleteButtons.length).toBe(0);
      });
    });

    describe('# Contact persons actions', () => {
      test('should show "Edit" button if the user has permissions to update contact persons information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} />
          </MoniteScopedProviders>
        );

        await waitUntilTableIsLoaded();

        const bankAccount = screen.getByTestId(
          CounterpartDataTestId.ContactPerson
        );

        const editButtons = within(bankAccount).getAllByRole('button', {
          name: /edit/i,
        });

        expect(editButtons.length).toBeGreaterThanOrEqual(1);
      });

      test('should show "Delete" button if the user has permissions to delete contact persons information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} />
          </MoniteScopedProviders>
        );

        await waitUntilTableIsLoaded();

        const bankAccount = screen.getByTestId(
          CounterpartDataTestId.ContactPerson
        );

        const deleteButtons = within(bankAccount).getAllByRole('button', {
          name: /delete/i,
        });

        expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
      });

      test('should NOT show "Edit" button if the user has NO permissions to update contact persons information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} />
          </MoniteScopedProviders>,
          sdkWithReadPermissions
        );

        await waitUntilTableIsLoaded();

        const bankAccount = screen.getByTestId(
          CounterpartDataTestId.ContactPerson
        );

        const editButtons = within(bankAccount).queryAllByRole('button', {
          name: /edit/i,
        });

        expect(editButtons.length).toBe(0);
      });

      test('should NOT show "Delete" button if the user has NO permissions to delete contact persons information', async () => {
        renderWithClient(
          <MoniteScopedProviders>
            <CounterpartView id={organizationId} />
          </MoniteScopedProviders>,
          sdkWithReadPermissions
        );

        await waitUntilTableIsLoaded();

        const bankAccount = screen.getByTestId(
          CounterpartDataTestId.ContactPerson
        );

        const deleteButtons = within(bankAccount).queryAllByRole('button', {
          name: /delete/i,
        });

        expect(deleteButtons.length).toBe(0);
      });
    });
  });
});
