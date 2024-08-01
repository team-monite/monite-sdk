import { fullPermissionRole } from '@/mocks/roles';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { UserRoleDetails } from './UserRoleDetails';

describe('User Role Details', () => {
  test('should render user role details when user has full permissions', async () => {
    renderWithClient(<UserRoleDetails id={fullPermissionRole.id} />);

    await waitUntilTableIsLoaded();

    expect(screen.getByText(fullPermissionRole.name)).toBeInTheDocument();
  });

  test('should render "Not Found" message component if the user role is not found', async () => {
    renderWithClient(<UserRoleDetails id="not-found-id" />);

    await waitUntilTableIsLoaded();

    expect(await screen.findByText(/Role not found/)).toBeInTheDocument();
  });

  describe('#Actions', () => {
    test('should trigger "onUpdated" callback with role when we click on "Update" button in details', async () => {
      const onUpdatedMock = jest.fn();

      renderWithClient(
        <UserRoleDetails id={fullPermissionRole.id} onUpdated={onUpdatedMock} />
      );

      await waitUntilTableIsLoaded();

      const editButton = await screen.findByRole('button', {
        name: t`Edit`,
      });

      fireEvent.click(editButton);

      const updatedName = 'Updated Role Name';
      const nameInput = screen.getByLabelText(t`Name *`);

      fireEvent.change(nameInput, { target: { value: updatedName } });

      const updateButton = await screen.findByRole('button', {
        name: t`Update`,
      });

      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(onUpdatedMock).toHaveBeenCalledWith({
          ...fullPermissionRole,
          name: updatedName,
        });
      });
    });

    test('should trigger "onCreated" callback with role when we click on "Create" button in details', async () => {
      const onCreatedMock = jest.fn();

      renderWithClient(<UserRoleDetails onCreated={onCreatedMock} />);

      const createdName = 'Created Role Name';
      const nameInput = screen.getByLabelText(t`Name *`);

      fireEvent.change(nameInput, { target: { value: createdName } });

      const createButton = await screen.findByRole('button', {
        name: t`Create`,
      });

      fireEvent.click(createButton);

      await waitFor(() => {
        expect(onCreatedMock).toHaveBeenCalledWith(
          expect.objectContaining({
            name: createdName,
          })
        );
      });
    });
  });
});
