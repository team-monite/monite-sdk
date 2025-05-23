import { fullPermissionRole } from '@/mocks/roles';
import {
  renderWithClient,
  triggerChangeInput,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { screen } from '@testing-library/react';

import { UserRoleEditDialog } from './UserRoleEditDialog';

jest.mock('@/components/Dialog', () => ({
  useDialog: jest.fn(() => ({
    openDialog: jest.fn(),
    closeDialog: vi.fn(),
  })),
}));

describe('UserRoleEditDialog', () => {
  it('renders the dialog with the correct title for creating a role', async () => {
    renderWithClient(
      <UserRoleEditDialog
        onCreated={jest.fn()}
        onUpdated={jest.fn()}
        onClickDeleteRole={vi.fn()}
      />
    );

    expect(screen.getByText('Create User Role')).toBeInTheDocument();
  });

  it.skip('renders the dialog with the correct title for editing a role', async () => {
    renderWithClient(
      <UserRoleEditDialog
        id={fullPermissionRole.id}
        onCreated={jest.fn()}
        onUpdated={jest.fn()}
        onClickDeleteRole={vi.fn()}
      />
    );

    await waitUntilTableIsLoaded();

    expect(screen.getByText('Edit User Role')).toBeInTheDocument();
  });

  it.skip('disables the save button when the form is not dirty', async () => {
    renderWithClient(
      <UserRoleEditDialog
        id={fullPermissionRole.id}
        onCreated={jest.fn()}
        onUpdated={jest.fn()}
        onClickDeleteRole={vi.fn()}
      />
    );

    await waitUntilTableIsLoaded();

    expect(screen.getByText('Save')).toBeDisabled();
  });

  it.skip('enables the save button when the form is dirty', async () => {
    renderWithClient(
      <UserRoleEditDialog
        id={fullPermissionRole.id}
        onCreated={jest.fn()}
        onUpdated={jest.fn()}
        onClickDeleteRole={vi.fn()}
      />
    );

    await waitUntilTableIsLoaded();

    triggerChangeInput(/name/i, 'new role name');

    expect(screen.getByText('Save')).not.toBeDisabled();
  });
});
