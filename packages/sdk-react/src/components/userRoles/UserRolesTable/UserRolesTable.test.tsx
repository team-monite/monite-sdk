import React from 'react';

import { UserRolesTable } from '@/components/userRoles';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { fireEvent, screen, waitFor, act } from '@testing-library/react';

describe('UserRolesTable', () => {
  test('should trigger "onFilterChangedMock" with "field: search" when the user is filtering roles', async () => {
    const onFilterChangedMock = jest.fn();

    renderWithClient(<UserRolesTable onFilterChanged={onFilterChangedMock} />);

    await waitUntilTableIsLoaded();

    const search = screen.getByLabelText('Search');

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
