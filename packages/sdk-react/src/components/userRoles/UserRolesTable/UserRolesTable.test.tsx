import React from 'react';

import { UserRolesTable } from '@/components/userRoles';
import { MoniteProvider } from '@/core/context/MoniteProvider';
import { ENTITY_ID_FOR_EMPTY_PERMISSIONS } from '@/mocks';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { fireEvent, screen, waitFor } from '@testing-library/react';

describe('UserRolesTable', () => {
  test('should render access restricted message when user does not have access to products', async () => {
    const monite = new MoniteSDK({
      entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
      fetchToken: () =>
        Promise.resolve({
          access_token: 'token',
          token_type: 'Bearer',
          expires_in: 10_000,
        }),
    });

    renderWithClient(
      <MoniteProvider monite={monite}>
        <UserRolesTable />
      </MoniteProvider>
    );

    await waitUntilTableIsLoaded();

    expect(await screen.findByText(/Access Restricted/)).toBeInTheDocument();
  });

  test('should trigger "onFilterChangedMock" with "field: search" when the user is filtering roles', async () => {
    const onFilterChangedMock = jest.fn();

    renderWithClient(<UserRolesTable onFilterChanged={onFilterChangedMock} />);

    await waitUntilTableIsLoaded();

    const search = await screen.findByLabelText('Search');

    const searchValue = 'Acme';
    fireEvent.change(search, {
      target: { value: searchValue },
    });

    await waitFor(() => {
      expect(onFilterChangedMock).toHaveBeenCalledWith({
        field: 'search',
        value: searchValue,
      });
    });
  });

  test('should trigger "onFilterChangedMock" with "created_at" and changing "value" when the user is filtering roles', async () => {
    const onFilterChangedMock = jest.fn();

    renderWithClient(<UserRolesTable onFilterChanged={onFilterChangedMock} />);

    await waitUntilTableIsLoaded();

    const createdAtDatePickerBtn = screen.getByLabelText('Choose date');
    fireEvent.click(createdAtDatePickerBtn);

    const todayBtn = screen.getByRole('button', { name: 'Today' });
    fireEvent.click(todayBtn);

    const expectedDate = new Date();
    expectedDate.setHours(0, 0, 0, 0);

    await waitFor(() => {
      expect(onFilterChangedMock).toHaveBeenCalledWith({
        field: 'created_at',
        value: expectedDate,
      });
    });
  });
});
