import { MoniteProvider } from '@/core/context/MoniteProvider';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
  measureUnitsListFixture,
} from '@/mocks';
import { productsListFixture } from '@/mocks/products';
import { DEBOUNCE_SEARCH_TIMEOUT } from '@/ui/SearchField';
import {
  cachedMoniteSDK,
  renderWithClient,
  selectAsyncDropdownOption,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import {
  fireEvent,
  screen,
  waitFor,
  within,
  act,
} from '@testing-library/react';

import { ProductsTable } from './ProductsTable';

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

      await waitFor(() => {
        expect(onChangeFilterMock).toHaveBeenCalledWith({
          field: 'search',
          value: searchValue,
        });
      });
    });

    test('should trigger "onChangeFilterMock" with "type" and changing "value" when we are filtering products by type', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(<ProductsTable onFilterChanged={onChangeFilterMock} />);

      await waitUntilTableIsLoaded();

      fireEvent.mouseDown(
        screen.getByRole('button', {
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

      const dropdownButton = await screen.findByRole('button', {
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
      const getListSpy = jest.spyOn(cachedMoniteSDK.api.products, 'getAll');

      renderWithClient(<ProductsTable />);

      await waitUntilTableIsLoaded();

      const nextButton = getNextButton();

      fireEvent.click(nextButton);

      await waitUntilTableIsLoaded();

      /** Get all provided parameters into the last call */
      const lastCallArguments = getListSpy.mock.lastCall;

      if (!lastCallArguments) {
        throw new Error('monite.api.products.getAll never has been called');
      }

      const callParams = lastCallArguments[0];

      await waitFor(() => {
        expect(callParams.paginationToken).toBe('1');
      });
    });
  });

  describe('# Actions', () => {
    test('should trigger "onEdit" callback when we click on "edit" button', async () => {
      const onEditMock = jest.fn();

      renderWithClient(<ProductsTable onEdit={onEditMock} />);

      await waitUntilTableIsLoaded();

      const itemIndex = 0;

      const actionButtons = await screen.findAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[itemIndex];

      fireEvent.click(actionButton);

      const editName = t`Edit`;
      const editButton = screen.getByText(editName);

      fireEvent.click(editButton);

      expect(onEditMock).toHaveBeenCalledWith(productsListFixture[itemIndex]);
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
        const getListSpy = jest.spyOn(cachedMoniteSDK.api.products, 'getAll');

        renderWithClient(<ProductsTable />, cachedMoniteSDK);

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

        /** Get all provided parameters into the last call */
        const lastCallArguments = getListSpy.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('monite.api.products.getAll never has been called');
        }

        const name = lastCallArguments[0].nameIcontains;

        expect(name).toBe(searchValue);
      });

      test('should send correct request when we are filtering items by type', async () => {
        const getListSpy = jest.spyOn(cachedMoniteSDK.api.products, 'getAll');

        renderWithClient(<ProductsTable />, cachedMoniteSDK);

        await waitUntilTableIsLoaded();

        fireEvent.mouseDown(
          screen.getByRole('button', {
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

        /** Get all provided parameters into the last call */
        const lastCallArguments = getListSpy.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('monite.api.products.getAll never has been called');
        }

        const type = lastCallArguments[0].type;

        expect(type).toBe('product');
      });

      test('should send correct request when we are filtering items by measure unit', async () => {
        const getListSpy = jest.spyOn(cachedMoniteSDK.api.products, 'getAll');

        renderWithClient(<ProductsTable />, cachedMoniteSDK);

        await waitUntilTableIsLoaded();

        fireEvent.mouseDown(
          screen.getByRole('button', {
            name: /units/i,
          })
        );

        const dropdownButton = await screen.findByRole('button', {
          name: /units/i,
        });

        await waitFor(() => {
          expect(dropdownButton).not.toBeDisabled();
        });

        const unit = measureUnitsListFixture.data[0];
        await selectAsyncDropdownOption(/units/i, unit.name);

        /** Get all provided parameters into the last call */
        const lastCallArguments = getListSpy.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('monite.api.products.getAll never has been called');
        }

        const measureUnit = lastCallArguments[0].measureUnitId;

        expect(measureUnit).toBe(unit.id);
      });
    });

    describe('# Sorting', () => {
      test('should send correct request when we sort a table by "name" field in ascending order and when we click on that field once', async () => {
        const getListSpy = jest.spyOn(cachedMoniteSDK.api.products, 'getAll');

        renderWithClient(<ProductsTable />, cachedMoniteSDK);

        await waitUntilTableIsLoaded();

        const nameButton = screen.getByText('Name, description');

        fireEvent.click(nameButton);

        await waitUntilTableIsLoaded();

        /** Get all provided parameters into the last call */
        const lastCallArguments = getListSpy.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('monite.api.products.getAll never has been called');
        }

        const order = lastCallArguments[0].order;
        const sort = lastCallArguments[0].sort;

        expect(order).toBe('asc');
        expect(sort).toBe('name');
      });

      test('should send correct request when we sort a table by "name" field in descending order and when we click on that field twice', async () => {
        const getListSpy = jest.spyOn(cachedMoniteSDK.api.products, 'getAll');

        renderWithClient(<ProductsTable />, cachedMoniteSDK);

        await waitUntilTableIsLoaded();

        const nameButton = screen.getByText('Name, description');

        fireEvent.click(nameButton);
        await waitUntilTableIsLoaded();

        fireEvent.click(nameButton);
        await waitUntilTableIsLoaded();

        /** Get all provided parameters into the last call */
        const lastCallArguments = getListSpy.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('monite.api.tag.getList never has been called');
        }

        const order = lastCallArguments[0].order;
        const sort = lastCallArguments[0].sort;

        expect(order).toBe('desc');
        expect(sort).toBe('name');
      });

      test('should send correct request and flush sorting by "name" field when we click on that field 3 times', async () => {
        const getListSpy = jest.spyOn(cachedMoniteSDK.api.products, 'getAll');

        renderWithClient(<ProductsTable />, cachedMoniteSDK);

        await waitUntilTableIsLoaded();

        const nameButton = screen.getByText('Name, description');

        fireEvent.click(nameButton);
        fireEvent.click(nameButton);
        fireEvent.click(nameButton);

        /** Get all provided parameters into the last call */
        const lastCallArguments = getListSpy.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('monite.api.tag.getList never has been called');
        }

        const order = lastCallArguments[0].order;
        const sort = lastCallArguments[0].sort;

        expect(order).toBeUndefined();
        expect(sort).toBeUndefined();
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
