import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  approvalRequestsListFixture,
} from '@/mocks';
import { renderWithClient } from '@/utils/test-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ApprovalRequestsTable } from './ApprovalRequestsTable';

describe.skip('ApprovalRequestTable', () => {
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

      expect(await screen.findByText(/Access Restricted/)).toBeInTheDocument();
    });
  });

  describe('# Pagination', () => {
    test('should fetch only first 10 elements when the page limit is 10 (by default)', async () => {
      renderWithClient(<ApprovalRequestsTable />);

      await waitFor(() => {
        // remove the header row
        const items = screen.getAllByRole('row').slice(1);

        expect(items.length).toBe(10);
      });
    });

    test('next button should be available for interaction but previous button not', async () => {
      renderWithClient(<ApprovalRequestsTable />);

      await waitFor(() =>
        expect(
          screen.findByRole('button', {
            name: /next/i,
          })
        ).resolves.toBeEnabled()
      );

      expect(
        screen.getByRole('button', {
          name: /previous/i,
        })
      ).toBeDisabled();
    });
  });

  describe('# Public API', () => {
    test('should trigger a `onRowClick` callback when click on a row', async () => {
      const onRowClickMock = jest.fn();

      renderWithClient(<ApprovalRequestsTable onRowClick={onRowClickMock} />);

      const firstApproval = approvalRequestsListFixture[0];
      expect(firstApproval.id).toBeDefined();

      const firstRow = await waitFor(async () => {
        const rows = await screen.findAllByRole('row');
        expect(rows.length).toBeGreaterThan(1);
        return rows[1]; // skip the header row
      });

      fireEvent.click(firstRow);

      expect(onRowClickMock).toHaveBeenCalledWith(firstApproval.id);
    });
  });
});
