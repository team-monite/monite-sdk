import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  approvalRequestsListFixture,
} from '@/mocks';
import { renderWithClient } from '@/utils/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { vi } from 'vitest';

import { ApprovalRequestsTable } from './ApprovalRequestsTable';

describe.skip('ApprovalRequestTable', () => {
  describe('# Permissions', () => {
    test('should render access restricted message when user does not have access to approval requests', async () => {
      const monite = {
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 10_000,
          }),
      };

      renderWithClient(<ApprovalRequestsTable />, monite);

      expect(await screen.findByText(/Access Restricted/)).toBeInTheDocument();
    });
  });

  describe('# Pagination', () => {
    test('should fetch only first 15 elements when the page limit is 15 (by default)', async () => {
      renderWithClient(<ApprovalRequestsTable />);

      await waitFor(() => {
        // remove the header row
        const items = screen.getAllByRole('row').slice(1);

        expect(items.length).toBe(15);
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
    test.skip('should trigger an `onRowClick` callback when clicking on a row', async () => {
      const onRowClickMock = vi.fn();

      renderWithClient(<ApprovalRequestsTable onRowClick={onRowClickMock} />);

      const firstApproval = approvalRequestsListFixture[0];
      expect(firstApproval.id).toBeDefined();

      const rows = await waitFor(async () => {
        const tableRows = await screen.findAllByRole('row');
        expect(tableRows.length).toBeGreaterThan(1); // Ensure data rows are loaded
        return tableRows;
      });

      const firstDataRow = rows[1];
      fireEvent.click(firstDataRow);

      expect(onRowClickMock).toHaveBeenCalledWith(firstApproval.id);
    });
  });
});
