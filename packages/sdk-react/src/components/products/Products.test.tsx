import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';

import { Products } from './Products';

describe('Products', () => {
  test('when user has full permissions', async () => {
    renderWithClient(<Products />);

    await waitUntilTableIsLoaded();

    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  describe('#Actions', () => {
    test('should open the details modal when a row is clicked', async () => {
      renderWithClient(<Products />);

      await waitUntilTableIsLoaded();

      const rows = screen.getAllByRole('row');
      const firstProductRow = rows[1];

      fireEvent.click(firstProductRow);

      const detailsTitle = /product details/i;
      const detailsTitleElement = await screen.findByText(detailsTitle);

      expect(detailsTitleElement).toBeInTheDocument();
    });

    test('should open the create modal when the "create" button is clicked', async () => {
      renderWithClient(<Products />);

      await waitUntilTableIsLoaded();

      const createButton = screen.getByRole('button', {
        name: /create new/i,
      });

      fireEvent.click(createButton);

      const createTitle = /create new product/i;
      const createTitleElement = screen.getByRole('heading', {
        name: createTitle,
      });

      expect(createTitleElement).toBeInTheDocument();
    });

    test('should appear "edit" and "delete" buttons when we click on right action button', async () => {
      renderWithClient(<Products />);

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

    test('should appear delete modal when we click on "delete" button', async () => {
      renderWithClient(<Products />);

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

      await waitForElementToBeRemoved(deleteDialog);
    });

    test('should appear edit modal when we click on "edit" button', async () => {
      renderWithClient(<Products />);

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

      const editTitle = await screen.findByText(/edit product/i);
      const updateModalButton = screen.getByRole('button', {
        name: /update/i,
      });

      expect(editTitle).toBeInTheDocument();
      expect(updateModalButton).toBeInTheDocument();
    });
  });
});
