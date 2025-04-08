import { fullPermissionRole } from '@/mocks/roles';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { screen } from '@testing-library/react';

import { UserRoleDetailsDialog } from './UserRoleDetailsDialog';

jest.mock('@/components/Dialog', () => ({
  useDialog: jest.fn(() => ({
    openDialog: jest.fn(),
    closeDialog: jest.fn(),
  })),
}));

describe('User Role Details', () => {
  test('should render user role details when user has full permissions', async () => {
    const onClickMock = jest.fn();
    renderWithClient(
      <UserRoleDetailsDialog
        id={fullPermissionRole.id}
        onClickEditRole={onClickMock}
        onClickDeleteRole={jest.fn()}
      />
    );

    await waitUntilTableIsLoaded();

    expect(screen.getByText(fullPermissionRole.name)).toBeInTheDocument();
  });

  test('should render "Not Found" message component if the user role is not found', async () => {
    const onClickMock = jest.fn();
    renderWithClient(
      <UserRoleDetailsDialog
        id="not-found-id"
        onClickEditRole={onClickMock}
        onClickDeleteRole={jest.fn()}
      />
    );

    await waitUntilTableIsLoaded();

    expect(await screen.findByText(/Role not found/)).toBeInTheDocument();
  });

  test('should call onClickEditRole when edit button is clicked', async () => {
    const onClickMock = jest.fn();
    renderWithClient(
      <UserRoleDetailsDialog
        id={fullPermissionRole.id}
        onClickEditRole={onClickMock}
        onClickDeleteRole={jest.fn()}
      />
    );

    await waitUntilTableIsLoaded();

    const editButton = screen.getByRole('button', { name: /edit/i });
    editButton.click();

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
