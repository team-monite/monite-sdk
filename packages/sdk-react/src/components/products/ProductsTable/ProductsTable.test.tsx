import { MoniteProvider } from '@/core/context/MoniteProvider';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
  measureUnitsListFixture,
} from '@/mocks';
import { productsListFixture } from '@/mocks/products';
import { DEBOUNCE_SEARCH_TIMEOUT } from '@/ui/SearchField';
import {
  renderWithClient,
  selectAsyncDropdownOption,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { requestFn } from '@openapi-qraft/react';
import {
  fireEvent,
  screen,
  waitFor,
  within,
  act,
} from '@testing-library/react';

import { ProductsTable } from './ProductsTable';

const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

describe('ProductsTable', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('# UI', () => {
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
          <ProductsTable />
        </MoniteProvider>
      );

      await waitUntilTableIsLoaded();

      expect(await screen.findByText(/Access Restricted/)).toBeInTheDocument();
    });

    test('should not render action button on row when user does not have update and delete access to products', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_READONLY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 10_000,
          }),
      });

      renderWithClient(<ProductsTable />, monite);

      await waitUntilTableIsLoaded();

      expect(screen.queryByRole('button', { name: /actions/i })).toBeNull();
    });
  });

  describe('# Filters', () => {
    test('should trigger "onChangeFilterMock" with "field: search" when we are filtering items', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(<ProductsTable onFilterChanged={onChangeFilterMock} />);

      const search = await screen.findByLabelText('Search');

      const searchValue = 'Some search value';

      jest.useFakeTimers();
      await act(() =>
        fireEvent.change(search, {
          target: { value: searchValue },
        })
      );
      jest.advanceTimersByTime(DEBOUNCE_SEARCH_TIMEOUT);

      await waitFor(
        () => {
          expect(onChangeFilterMock).toHaveBeenCalledWith({
            field: 'search',
            value: searchValue,
          });
        },
        { timeout: 5_000 }
      );
    }, 10_000);

    test('should trigger "onChangeFilterMock" with "type" and changing "value" when we are filtering products by type', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(<ProductsTable onFilterChanged={onChangeFilterMock} />);

      await waitUntilTableIsLoaded();

      fireEvent.mouseDown(
        screen.getByRole('combobox', {
          name: /type/i,
        })
      );

      const unitDropdown = await screen.findByRole('listbox', {
        name: /type/i,
      });
      const { getByRole } = within(unitDropdown);

      const unitOption = getByRole('option', {
        name: 'Products',
      });
      fireEvent.click(unitOption);

      await waitFor(() => {
        expect(onChangeFilterMock).toHaveBeenCalledWith({
          field: 'type',
          value: 'product',
        });
      });
    });

    test('should trigger "onChangeFilterMock" with "units" and changing "value" when we are filtering products by units', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(<ProductsTable onFilterChanged={onChangeFilterMock} />);

      await waitUntilTableIsLoaded();

      const dropdownButton = await screen.findByRole('combobox', {
        name: /units/i,
      });

      await waitFor(() => {
        expect(dropdownButton).not.toBeDisabled();
      });

      const measureUnit = measureUnitsListFixture.data[0];
      await selectAsyncDropdownOption(/units/i, measureUnit.name);
      await waitFor(() => {
        expect(onChangeFilterMock).toHaveBeenCalledWith({
          field: 'units',
          value: measureUnit.id,
        });
      });
    });
  });

  describe('# Sorting', () => {
    test('should trigger "onChangeSortMock" when we sort a table by "name" field in ascending order when we click on that field once', async () => {
      const onChangeSortMock = jest.fn();

      renderWithClient(<ProductsTable onSortChanged={onChangeSortMock} />);

      await waitUntilTableIsLoaded();

      const nameButton = screen.getByText('Name, description');

      fireEvent.click(nameButton);

      await waitFor(() => {
        expect(onChangeSortMock).toHaveBeenCalledWith({
          field: 'name',
          sort: 'asc',
        });
      });
    });
  });

  describe('# Pagination', () => {
    test('should fetch only first 10 elements when the "limit" set as 10 (by default)', async () => {
      renderWithClient(<ProductsTable />);

      await waitUntilTableIsLoaded();

      const items = screen.getAllByRole('row').slice(1);

      await waitFor(() => {
        expect(items.length).toBe(10);
      });
    });

    test('next button should be available for interaction but previous button not', async () => {
      renderWithClient(<ProductsTable />);

      await waitUntilTableIsLoaded();

      const nextButton = getNextButton();
      const prevButton = getPrevButton();

      await waitFor(() => {
        expect(nextButton).not.toBeDisabled();
      });
      await waitFor(() => {
        expect(prevButton).toBeDisabled();
      });
    });

    test('should fetch next data when we click on "next" button', async () => {
      renderWithClient(<ProductsTable />);

      await waitUntilTableIsLoaded();

      const nextButton = getNextButton();

      fireEvent.click(nextButton);

      await waitFor(() =>
        expect(
          requestFnMock.mock.lastCall?.[1].parameters?.query?.pagination_token
        ).toEqual('1')
      );
    });
  });

  describe('# Actions', () => {
    test('should trigger "onEdit" callback when we click on "edit" button', async () => {
      const productRowFixture = productsListFixture[0];
      const onEditMock = jest.fn();

      renderWithClient(<ProductsTable onEdit={onEditMock} />);

      const productNameCell = await screen.findByText(productRowFixture.name);
      const productRow = productNameCell.closest('[role="row"]');
      if (!(productRow instanceof HTMLElement))
        throw new Error('Could not find product row');

      const actionButton = await within(productRow).findByRole('button', {
        name: 'actions-menu-button',
      });

      fireEvent.click(actionButton);

      const editName = t`Edit`;
      const editButton = screen.getByText(editName);

      fireEvent.click(editButton);

      expect(onEditMock).toHaveBeenCalledWith(productRowFixture);
    });

    test('should trigger "onDelete" callback when we click on "delete" button', async () => {
      const onDeleteMock = jest.fn();

      renderWithClient(<ProductsTable onDeleted={onDeleteMock} />);

      await waitUntilTableIsLoaded();

      const itemIndex = 0;

      const actionButtons = await screen.findAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[itemIndex];

      fireEvent.click(actionButton);

      const deleteName = t`Delete`;
      const deleteButton = screen.getByText(deleteName);

      await waitFor(() => {
        expect(deleteButton).not.toBeDisabled();
      });

      fireEvent.click(deleteButton);

      const deleteDialog = await screen.findByLabelText(
        'Products delete confirmation'
      );
      const innerDeleteButton = await within(deleteDialog).findByRole(
        'button',
        {
          name: /delete/i,
        }
      );

      await waitFor(() => {
        expect(innerDeleteButton).not.toBeDisabled();
      });

      fireEvent.click(innerDeleteButton);

      await waitFor(() => {
        expect(onDeleteMock).toHaveBeenCalledWith(
          productsListFixture[itemIndex].id
        );
      });
    });
  });

  describe('# Public API', () => {
    describe('# Filters', () => {
      test('should send correct request when we are filtering items by name', async () => {
        renderWithClient(<ProductsTable />);

        await waitUntilTableIsLoaded();

        const search = screen.getByLabelText('Search');

        const searchValue = 'Some search value';

        await act(() => {
          jest.useFakeTimers();

          fireEvent.change(search, {
            target: { value: searchValue },
          });

          jest.advanceTimersByTime(DEBOUNCE_SEARCH_TIMEOUT);
        });

        expect(
          requestFnMock.mock.lastCall?.[1].parameters?.query?.name__icontains
        ).toBe(searchValue);
      });

      test('should send correct request when we are filtering items by type', async () => {
        renderWithClient(<ProductsTable />);

        await waitUntilTableIsLoaded();

        fireEvent.mouseDown(
          screen.getByRole('combobox', {
            name: /type/i,
          })
        );

        const unitDropdown = await screen.findByRole('listbox', {
          name: /type/i,
        });
        const { getByRole } = within(unitDropdown);

        const unitOption = getByRole('option', {
          name: 'Products',
        });
        fireEvent.click(unitOption);

        await waitFor(() => {
          expect(requestFnMock.mock.lastCall?.[1].parameters?.query?.type).toBe(
            'product'
          );
        });
      });

      test('should send correct request when we are filtering items by measure unit', async () => {
        renderWithClient(<ProductsTable />);

        await waitUntilTableIsLoaded();

        fireEvent.mouseDown(
          screen.getByRole('combobox', {
            name: /units/i,
          })
        );

        const dropdownButton = await screen.findByRole('combobox', {
          name: /units/i,
        });

        await waitFor(() => {
          expect(dropdownButton).not.toBeDisabled();
        });

        const unit = measureUnitsListFixture.data[0];
        await selectAsyncDropdownOption(/units/i, unit.name);

        await waitFor(() => {
          expect(
            requestFnMock.mock.lastCall?.[1].parameters?.query?.measure_unit_id
          ).toBe(unit.id);
        });
      });
    });

    describe('# Sorting', () => {
      test('should send correct request when we sort a table by "name" field in ascending order and when we click on that field once', async () => {
        renderWithClient(<ProductsTable />);

        await waitUntilTableIsLoaded();

        const nameButton = screen.getByText('Name, description');

        fireEvent.click(nameButton);

        await waitFor(() => {
          expect(requestFnMock.mock.lastCall?.[1].parameters?.query?.sort).toBe(
            'name'
          );
          expect(
            requestFnMock.mock.lastCall?.[1].parameters?.query?.order
          ).toBe('asc');
        });
      });

      test('should send correct request when we sort a table by "name" field in descending order and when we click on that field twice', async () => {
        renderWithClient(<ProductsTable />);

        const nameButton = screen.findByText('Name, description');

        fireEvent.click(await nameButton);

        await waitFor(() =>
          expect(requestFnMock.mock.lastCall?.[1].parameters?.query?.sort).toBe(
            'name'
          )
        );

        fireEvent.click(await nameButton);

        await waitFor(() =>
          expect(
            requestFnMock.mock.lastCall?.[1].parameters?.query?.order
          ).toBe('desc')
        );
      });

      test('should send correct request and flush sorting by "name" field when we click on that field 3 times', async () => {
        renderWithClient(<ProductsTable />);

        await waitUntilTableIsLoaded();

        const nameButton = screen.getByText('Name, description');

        fireEvent.click(nameButton);
        fireEvent.click(nameButton);
        fireEvent.click(nameButton);

        expect(
          requestFnMock.mock.lastCall?.[1].parameters?.query?.sort
        ).toBeUndefined();
        expect(
          requestFnMock.mock.lastCall?.[1].parameters?.query?.order
        ).toBeUndefined();
      });
    });
  });
});

/** Returns `next` button on the page */
function getNextButton() {
  return screen.getByRole('button', { name: /next/i });
}

/** Returns `previous` button on the page */
function getPrevButton() {
  return screen.getByRole('button', { name: /previous/i });
}
