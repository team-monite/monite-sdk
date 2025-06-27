import { ReactNode } from 'react';

import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { productsListFixture } from '@/mocks/products';
import {
  checkPermissionQueriesLoaded,
  renderWithClient,
  testQueryClient,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';

import { describe, test, expect, vi } from 'vitest';

import { Products } from './Products';

interface DialogProps {
  open: boolean;
  children: ReactNode;
}

vi.mock('@/components/Dialog', () => ({
  Dialog: ({ children }: DialogProps) => <>{children}</>,
  useDialog: vi.fn(() => ({
    openDialog: vi.fn(),
    closeDialog: vi.fn(),
  })),
}));

describe.skip('Products', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      renderWithClient(<Products />);

      await waitUntilTableIsLoaded();

      const createProductButtons = await screen.findAllByRole('button', {
        name: /create new/i,
      });
      expect(createProductButtons[0]).toBeInTheDocument();

      expect(createProductButtons[0]).not.toBeDisabled();

      const productCells = await screen.findAllByText(
        productsListFixture[0].name
      );
      expect(productCells.length).toBeGreaterThan(0);
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

      renderWithClient(<Products />, monite);

      await waitFor(() => checkPermissionQueriesLoaded(testQueryClient));

      const createProductButton = screen.findByRole('button', {
        name: /create new/i,
      });
      await expect(createProductButton).resolves.toBeInTheDocument();
      await expect(createProductButton).resolves.toBeDisabled();

      await expect(
        screen.findByText(/Access Restricted/i, { selector: 'h3' })
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

      renderWithClient(<Products />, monite);

      /** Wait until title loader disappears */
      await waitUntilTableIsLoaded();

      /** Wait until table loader disappears */
      await waitUntilTableIsLoaded();

      const createProductButton = screen.findByRole('button', {
        name: /create new/i,
      });

      await expect(createProductButton).resolves.toBeInTheDocument();
      await expect(createProductButton).resolves.not.toBeDisabled();

      const productCells = screen.findAllByText(productsListFixture[0].name);
      await expect(productCells).resolves.toBeDefined();
    });
  });

  describe('# Actions', () => {
    test('should open the details modal when a row is clicked', async () => {
      renderWithClient(<Products />);

      /** Wait until title loader disappears */
      await waitUntilTableIsLoaded();

      /** Wait until table loader disappears */
      await waitUntilTableIsLoaded();

      const rows = screen.getAllByRole('row');
      const firstProductRow = rows[1];

      fireEvent.click(firstProductRow);

      const detailsTitle = /history/i;
      const detailsTitleElement = await screen.findByText(detailsTitle);

      expect(detailsTitleElement).toBeInTheDocument();
    });

    test('should open the create modal when the "create" button is clicked', async () => {
      renderWithClient(<Products />);

      /** Wait until title loader disappears */
      await waitUntilTableIsLoaded();

      /** Wait until table loader disappears */
      await waitUntilTableIsLoaded();

      const createButton = screen.getByRole('button', {
        name: /create new/i,
      });

      fireEvent.click(createButton);

      const createTitleElements = await screen.findAllByRole('heading', {
        name: /create new product or service/i,
      });

      expect(createTitleElements[0]).toBeInTheDocument();
    });

    test('should appear "edit" and "delete" buttons when we click on right action button', async () => {
      renderWithClient(<Products />);

      /** Wait until title loader disappears */
      await waitUntilTableIsLoaded();

      /** Wait until table loader disappears */
      await waitUntilTableIsLoaded();

      const actionButtons = screen.getAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[0];

      fireEvent.click(actionButton);

      const editName = t`Edit`;
      const deleteName = t`Delete`;

      const editButton = screen.getByText(editName);
      const deleteButton = screen.getByText(deleteName);

      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
    //TODO: fix this test after we solve problem with multiple spinners on waitUntilTableIsLoaded
    test.skip('should appear delete modal when we click on "delete" button', async () => {
      renderWithClient(<Products />);

      /** Wait until title loader disappears */
      await waitUntilTableIsLoaded();

      /** Wait until table loader disappears */
      await waitUntilTableIsLoaded();

      const itemIndex = 0;

      const actionButtons = screen.getAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[itemIndex];

      fireEvent.click(actionButton);

      const deleteName = t`Delete`;
      const deleteButton = screen.getByText(deleteName);

      fireEvent.click(deleteButton);

      const deleteTitle = await screen.findByText(/delete product/i);
      const deleteModalButton = screen.getByRole('button', {
        name: /delete/i,
      });

      expect(deleteTitle).toBeInTheDocument();
      expect(deleteModalButton).toBeInTheDocument();
    });

    test('should close modal after deletion', async () => {
      renderWithClient(<Products />);

      /** Wait until title loader disappears */
      await waitUntilTableIsLoaded();

      /** Wait until table loader disappears */
      await waitUntilTableIsLoaded();

      const itemIndex = 0;

      const actionButtons = screen.getAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[itemIndex];

      fireEvent.click(actionButton);

      const deleteName = t`Delete`;
      const deleteButton = screen.getByText(deleteName);

      await act(() => fireEvent.click(deleteButton));

      const deleteDialog = await screen.findByLabelText(
        'Products delete confirmation'
      );
      const deleteModalButton = await within(deleteDialog).findByRole(
        'button',
        {
          name: /delete/i,
        }
      );
      fireEvent.click(deleteModalButton);

      await waitForElementToBeRemoved(deleteDialog, { timeout: 5_000 });
    });

    test('should appear edit modal when we click on "edit" button', async () => {
      renderWithClient(<Products />);

      /** Wait until title loader disappears */
      await waitUntilTableIsLoaded();

      /** Wait until table loader disappears */
      await waitUntilTableIsLoaded();

      const itemIndex = 0;

      const actionButtons = screen.getAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[itemIndex];

      fireEvent.click(actionButton);

      const editName = t`Edit`;
      const editButton = await screen.findByText(editName);

      fireEvent.click(editButton);

      const editTitle = await screen.findByText(/edit product|edit service/i);
      const updateModalButton = screen.getByRole('button', {
        name: /update/i,
      });

      expect(editTitle).toBeInTheDocument();
      expect(updateModalButton).toBeInTheDocument();
    });
  });
});
