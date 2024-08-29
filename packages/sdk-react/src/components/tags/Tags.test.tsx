import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { screen, waitFor } from '@testing-library/react';

import { Tags } from './Tags';

describe('Tags', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      renderWithClient(<Tags />);

      const createTagButton = screen.findByRole('button', {
        name: t`Create new tag`,
      });

      await expect(createTagButton).resolves.toBeInTheDocument();
      await waitFor(() => expect(createTagButton).resolves.not.toBeDisabled());

      const tableRowTag = screen.findByText('tag 1');
      await expect(tableRowTag).resolves.toBeInTheDocument();
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

      renderWithClient(<Tags />, monite);

      const createTagButton = screen.findByRole('button', {
        name: t`Create new tag`,
      });

      await expect(
        screen.findByText(/Access Restricted/i, { selector: 'h3' })
      ).resolves.toBeInTheDocument();
      await expect(createTagButton).resolves.toBeInTheDocument();
      await expect(createTagButton).resolves.toBeDisabled();
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

      renderWithClient(<Tags />, monite);

      const createTagButton = screen.findByRole('button', {
        name: t`Create new tag`,
      });

      await expect(createTagButton).resolves.toBeInTheDocument();
      await waitFor(() => expect(createTagButton).resolves.not.toBeDisabled());

      const tableRowTag = screen.findByText('tag 1');
      await expect(tableRowTag).resolves.toBeInTheDocument();
    });

    test('displays loading spinner while permissions are loading', async () => {
      renderWithClient(<Tags />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});
