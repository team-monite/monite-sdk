import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { renderWithClient } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { screen, waitFor } from '@testing-library/react';

import { ApprovalPolicies } from './ApprovalPolicies';

describe.skip('ApprovalPolicies', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      renderWithClient(<ApprovalPolicies />);

      const createApprovalPolicyButton = screen.findByRole('button', {
        name: t`Create`,
      });

      await expect(createApprovalPolicyButton).resolves.toBeInTheDocument();
      await waitFor(() =>
        expect(createApprovalPolicyButton).resolves.not.toBeDisabled()
      );

      const approvalPolicyCell = await screen.findAllByText(
        t`Users from the list`
      );

      expect(approvalPolicyCell.length).toBeGreaterThanOrEqual(1);
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

      renderWithClient(<ApprovalPolicies />, monite);

      const createTagButton = screen.findByRole('button', {
        name: t`Create`,
      });

      await expect(createTagButton).resolves.toBeInTheDocument();
      await expect(
        screen.findByText(t`Access Restricted`, { selector: 'h3' })
      ).resolves.toBeInTheDocument();
      await expect(createTagButton).resolves.toBeDisabled();
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

      renderWithClient(<ApprovalPolicies />, monite);

      const createApprovalPolicyButton = screen.findByRole('button', {
        name: t`Create`,
      });

      await expect(createApprovalPolicyButton).resolves.toBeInTheDocument();
      await waitFor(() =>
        expect(createApprovalPolicyButton).resolves.not.toBeDisabled()
      );

      const approvalPolicyCell = await screen.findAllByText(
        t`Users from the list`
      );

      expect(approvalPolicyCell.length).toBeGreaterThanOrEqual(1);
    });
  });
});
