import React from 'react';

import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  approvalRequestsListFixture,
} from '@/mocks';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ApprovalRequestsTable } from './ApprovalRequestsTable';

describe('ApprovalRequestTable', () => {
  describe('# Permissions', () => {
    test('should render access restricted message when user does not have access to approval requests', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 10_000,
          }),
      });

      renderWithClient(<ApprovalRequestsTable />, monite);

      await waitUntilTableIsLoaded();

      expect(await screen.findByText(/Access Restricted/)).toBeInTheDocument();
    });
  });

  describe('# Pagination', () => {
    test('should fetch only first 10 elements when the page limit is 10 (by default)', async () => {
      renderWithClient(<ApprovalRequestsTable />);

      await waitUntilTableIsLoaded();

      await waitFor(() => {
        // remove the header row
        const items = screen.getAllByRole('row').slice(1);

        expect(items.length).toBe(10);
      });
    });

    test('next button should be available for interaction but previous button not', async () => {
      renderWithClient(<ApprovalRequestsTable />);

      await waitUntilTableIsLoaded();

      const nextButton = screen.getByRole('button', {
        name: /next/i,
      });
      const prevButton = screen.getByRole('button', {
        name: /previous/i,
      });

      const nextDisabled = nextButton.hasAttribute('disabled');
      const prevDisabled = prevButton.hasAttribute('disabled');

      expect(prevDisabled).toBeTruthy();
      expect(nextDisabled).toBeFalsy();
    });
  });

  describe('# Public API', () => {
    test('should trigger a `onRowClick` callback when click on a row', async () => {
      const onRowClickMock = jest.fn();

      renderWithClient(<ApprovalRequestsTable onRowClick={onRowClickMock} />);

      const firstApproval = approvalRequestsListFixture[0];

      if (!firstApproval)
        throw new Error('Could not find any approval in the fixtures list');

      const rows = await screen.findAllByRole('row');
      const firstRow = rows[1]; // skip the header row

      fireEvent.click(firstRow);

      expect(firstApproval.id).toBeDefined();
      expect(onRowClickMock).toHaveBeenCalledWith(firstApproval.id);
    });
  });
});
