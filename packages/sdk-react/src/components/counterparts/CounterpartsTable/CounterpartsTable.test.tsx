import { components } from '@/api';
import { counterpartListFixture } from '@/mocks/counterparts/counterpart';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
} from '@/mocks/entityUsers';
import { DEBOUNCE_SEARCH_TIMEOUT } from '@/ui/SearchField';
import {
  renderWithClient,
  waitUntilTableIsLoaded,
  triggerClickOnSelectOption,
  triggerChangeInput,
  cachedMoniteSDK,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { requestFn } from '@openapi-qraft/react';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { CounterpartsTable } from './CounterpartsTable';

/** Returns `next` button on the page */
function getNextButton() {
  return screen.getByRole('button', { name: 'Next page' });
}

/** Returns `previous` button on the page */
function getPrevButton() {
  return screen.getByRole('button', { name: /Previous page/i });
}

function getFirstOrganization(): components['schemas']['CounterpartOrganizationRootResponse'] {
  const organization = counterpartListFixture.find(
    (counterpart) => counterpart.type === 'organization'
  ) as components['schemas']['CounterpartOrganizationRootResponse'] | undefined;

  if (!organization) {
    throw new Error('Could not find any organization in the fixtures list');
  }

  return organization;
}

describe('CounterpartsTable', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('# UI', () => {
    test('should render access restricted message when user does not have access to counterparts', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 10_000,
          }),
      });

      renderWithClient(<CounterpartsTable />, monite);

      await waitUntilTableIsLoaded();

      expect(await screen.findByText(/Access Restricted/)).toBeInTheDocument();
    });

    test('should not render action button on row when user does not have update and delete access to counterparts', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_READONLY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 10_000,
          }),
      });

      renderWithClient(<CounterpartsTable />, monite);

      await waitUntilTableIsLoaded();

      expect(screen.queryByRole('button', { name: /actions/i })).toBeNull();
    });
  });

  describe('# Actions', () => {
    test('should trigger a `onRowClick` callback when click on a row', async () => {
      const onRowClickMock = jest.fn();

      renderWithClient(<CounterpartsTable onRowClick={onRowClickMock} />);

      await waitUntilTableIsLoaded();

      const firstOrganization = getFirstOrganization();
      const company = await screen.findByText(
        firstOrganization.organization.legal_name
      );

      fireEvent.click(company);

      expect(onRowClickMock).toHaveBeenCalledWith(firstOrganization.id);
    });

    test('should trigger a `onChangeSort` callback with ascending order parameter when click on "name, country, city" sorting field once', async () => {
      const onChangeSortMock = jest.fn();

      renderWithClient(<CounterpartsTable onChangeSort={onChangeSortMock} />);

      await waitUntilTableIsLoaded();

      const sortField = screen.getByText(/Name, country/);

      /** Set `asc` order */
      fireEvent.click(sortField);

      expect(onChangeSortMock).toHaveBeenCalledWith({
        field: 'counterpart_name',
        sort: 'asc',
      });
    });

    test('should trigger a `onChangeSort` callback with descending order parameter when click on "name, country, city" sorting field twice', async () => {
      const onChangeSortMock = jest.fn();

      renderWithClient(<CounterpartsTable onChangeSort={onChangeSortMock} />);

      await waitUntilTableIsLoaded();

      const sortField = screen.getByText(/Name, country/);

      /** Set `asc` order */
      fireEvent.click(sortField);

      /** Set `desc` order */
      fireEvent.click(sortField);

      expect(onChangeSortMock).toHaveBeenCalledWith({
        field: 'counterpart_name',
        sort: 'desc',
      });
    });

    test('should trigger a `onChangeSort` callback with NO order parameter when click on "name, country, city" sorting field 3 times', async () => {
      const onChangeSortMock = jest.fn();

      renderWithClient(<CounterpartsTable onChangeSort={onChangeSortMock} />);

      await waitUntilTableIsLoaded();

      const sortField = screen.getByText(/Name, country/);

      /** Set `asc` order */
      fireEvent.click(sortField);

      /** Set `desc` order */
      fireEvent.click(sortField);

      /** Remove order */
      fireEvent.click(sortField);

      expect(onChangeSortMock).toHaveBeenCalledWith(undefined);
    });

    test('should trigger "onChangeFilterMock" with "is_customer = false" when we are filtering vendors', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(
        <CounterpartsTable onChangeFilter={onChangeFilterMock} />
      );

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption(/category/i, 'Vendors');

      await waitUntilTableIsLoaded();

      expect(onChangeFilterMock).toHaveBeenCalledWith({
        field: 'is_customer',
        value: 'false',
      });
    });

    test('should trigger "onChangeFilterMock" with "is_customer = true" when we are filtering customers', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(
        <CounterpartsTable onChangeFilter={onChangeFilterMock} />
      );

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption(/category/i, 'Customers');

      await waitUntilTableIsLoaded();

      expect(onChangeFilterMock).toHaveBeenCalledWith({
        field: 'is_customer',
        value: 'true',
      });
    });

    test('should trigger "onChangeFilterMock" with "type = individuals" when we are filtering individuals', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(
        <CounterpartsTable onChangeFilter={onChangeFilterMock} />
      );

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption(/type/i, 'Individuals');

      await waitUntilTableIsLoaded();

      expect(onChangeFilterMock).toHaveBeenCalledWith({
        field: 'type',
        value: 'individual',
      });
    });

    test('should trigger "onChangeFilterMock" with "type = organization" when we are filtering companies', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(
        <CounterpartsTable onChangeFilter={onChangeFilterMock} />
      );

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption(/type/i, 'Companies');

      await waitUntilTableIsLoaded();

      expect(onChangeFilterMock).toHaveBeenCalledWith({
        field: 'type',
        value: 'organization',
      });
    });

    test('should appear "edit" and "delete" buttons when we click on right action button', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      const actionButtons = await screen.findAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[0];

      fireEvent.click(actionButton);

      const editName = t`Edit`;
      const deleteName = t`Delete`;

      const editButton = screen.getByText(editName);
      const deleteButton = screen.getByText(deleteName);

      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    test('should trigger "onEdit" callback when we click on "edit" button', async () => {
      const onEditMock = jest.fn();

      renderWithClient(<CounterpartsTable onEdit={onEditMock} />);

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

      expect(onEditMock).toHaveBeenCalledWith(
        counterpartListFixture[itemIndex].id
      );
    });

    test('should appear delete modal when we click on "delete" button', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      const itemIndex = 0;

      const actionButtons = await screen.findAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[itemIndex];

      fireEvent.click(actionButton);

      const deleteName = t`Delete`;
      const deleteButton = screen.getByText(deleteName);

      fireEvent.click(deleteButton);

      const deleteTitle = screen.getByText(/delete counterpart/i);
      const deleteModalButton = screen.getByRole('button', {
        name: /delete/i,
      });

      expect(deleteTitle).toBeInTheDocument();
      expect(deleteModalButton).toBeInTheDocument();
    });

    test('should trigger "onDelete" callback when we click on "delete" button', async () => {
      const onDeleteMock = jest.fn();

      renderWithClient(<CounterpartsTable onDelete={onDeleteMock} />);

      await waitUntilTableIsLoaded();

      const itemIndex = 0;

      const actionButtons = await screen.findAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[itemIndex];

      fireEvent.click(actionButton);

      const deleteName = t`Delete`;
      const deleteButton = screen.getByText(deleteName);

      fireEvent.click(deleteButton);

      const deleteModalButton = screen.getByRole('button', {
        name: /delete/i,
      });

      fireEvent.click(deleteModalButton);

      await waitFor(() => {
        expect(onDeleteMock).toHaveBeenCalledWith(
          counterpartListFixture[itemIndex].id
        );
      });
    });

    test('should close modal after deletion', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      const itemIndex = 0;

      const actionButtons = await screen.findAllByRole('button', {
        name: 'actions-menu-button',
      });
      const actionButton = actionButtons[itemIndex];

      fireEvent.click(actionButton);

      const deleteName = t`Delete`;
      const deleteButton = screen.getByText(deleteName);

      fireEvent.click(deleteButton);

      const deleteModalButton = screen.getByRole('button', {
        name: /delete/i,
      });

      fireEvent.click(deleteModalButton);

      await waitForElementToBeRemoved(deleteModalButton);
    });
  });

  describe('# Sorting', () => {
    // TODO: find a new way to test sorting because the name column contains more data than just the name
    test.skip('should sort a table by company name or user name in ascending order when we click on that field once', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      const sortField = screen.getByText(/Name, country/);

      /** Set `asc` order */
      fireEvent.click(sortField);

      await waitUntilTableIsLoaded();

      /** We need `slice` to remove the first row which is a header row */
      const tableRowsBeforeSort = screen.getAllByRole('row').slice(1);
      const texts = tableRowsBeforeSort.map((t) => t.textContent as string);

      expect(texts[0] < texts[texts.length - 1]).toBeTruthy();
    });

    test.skip('should sort a table by company name or user name in descending order when we click on that field twice', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      const sortField = screen.getByText(/Name, country/);

      /** Set `asc` order */
      fireEvent.click(sortField);
      await waitUntilTableIsLoaded();

      fireEvent.click(sortField);
      await waitUntilTableIsLoaded();

      /** We need `slice` to remove the first row which is a header row */
      const tableRowsBeforeSort = screen.getAllByRole('row').slice(1);
      const texts = tableRowsBeforeSort.map((t) => t.textContent as string);

      expect(texts[0] > texts[texts.length - 1]).toBeTruthy();
    });

    test('should flush sorting a table when we click on that field 3 times', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      /** We need `slice` to remove the first row, which is a header row */
      const tableRowsBeforeSort = screen.getAllByRole('row').slice(1);
      const initialTexts = tableRowsBeforeSort.map(
        (t) => t.textContent as string
      );

      const sortField = screen.getByText(/Name, country/);

      /** Set `asc` order and wait when the table to be loaded */
      fireEvent.click(sortField);
      await waitUntilTableIsLoaded();

      /** Set `desc` order and wait when the table to be loaded */
      fireEvent.click(sortField);
      await waitUntilTableIsLoaded();

      /** Remove order and wait when the table to be loaded */
      fireEvent.click(sortField);

      const tableRowsAfterSort = screen.getAllByRole('row').slice(1);
      const afterTexts = tableRowsAfterSort.map((t) => t.textContent as string);

      await waitFor(
        () => {
          expect(initialTexts).toEqual(afterTexts);
        },
        {
          timeout: 2_000,
        }
      );
    });
  });

  describe('# Filters', () => {
    test('should filter items by name when we fill information in "Search by name"', async () => {
      const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

      renderWithClient(<CounterpartsTable />, cachedMoniteSDK);

      await waitUntilTableIsLoaded();

      const value = 'Acme';
      await act(() => {
        jest.useFakeTimers();

        triggerChangeInput(/Search by name/i, value);

        jest.advanceTimersByTime(DEBOUNCE_SEARCH_TIMEOUT);
      });

      const lastCallArguments =
        requestFnMock?.mock?.lastCall?.[1]?.parameters?.query
          ?.counterpart_name__icontains;

      await waitFor(() => {
        expect(lastCallArguments).toContain(value);
      });
    });

    test('should filter items by "Customers" when we click on "Customers" filter', async () => {
      const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

      renderWithClient(<CounterpartsTable />, cachedMoniteSDK);

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption(/category/i, 'Customers');

      await waitFor(() => {
        const lastCall = requestFnMock.mock.lastCall;

        if (!lastCall) {
          throw new Error('api.counterparts never been called');
        }

        expect(lastCall?.[1].parameters?.query?.is_customer).toBe(true);
      });
    });

    test('should filter items by "Vendors" when we click on "Vendors" filter', async () => {
      const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

      renderWithClient(<CounterpartsTable />, cachedMoniteSDK);

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption(/category/i, 'Vendors');

      await waitFor(() => {
        const lastCallArguments = requestFnMock.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('api.counterparts never been called');
        }

        expect(lastCallArguments[1].parameters?.query?.is_vendor).toBe(true);
      });
    });

    test('should filter items by "Individuals" when we click on "Individuals" filter', async () => {
      const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

      renderWithClient(<CounterpartsTable />, cachedMoniteSDK);

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption(/type/i, 'Individuals');

      await waitFor(() => {
        const lastCallArguments = requestFnMock.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('api.counterparts never been called');
        }

        expect(lastCallArguments[1].parameters?.query?.type).toBe('individual');
      });
    });

    test('should filter items by "Companies" when we click on "Companies" filter', async () => {
      const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

      renderWithClient(<CounterpartsTable />, cachedMoniteSDK);

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption(/type/i, 'Companies');

      await waitFor(() => {
        const lastCallArguments = requestFnMock.mock.lastCall;

        if (!lastCallArguments) {
          throw new Error('api.counterparts never been called');
        }

        expect(lastCallArguments[1].parameters?.query?.type).toBe(
          'organization'
        );
      });
    });
  });

  describe('# Pagination', () => {
    test('should fetch items on the page when we provide default "10" items (but we may have less)', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      // We have to exclude the header row
      await waitFor(async () => {
        const items = await screen.findAllByRole('row');

        expect(items.splice(1).length).toBeGreaterThanOrEqual(5);
      });
    });

    test('should next page be available when we render first page', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      await waitFor(() => {
        expect(getNextButton()).not.toBeDisabled();
      });
      await waitFor(() => {
        expect(getPrevButton()).toBeDisabled();
      });
    });

    test('should fetch next items when we click on "next" button', async () => {
      const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

      renderWithClient(<CounterpartsTable />, cachedMoniteSDK);

      await waitUntilTableIsLoaded();

      const paginationTokenOnLoad =
        requestFnMock.mock.lastCall?.[1].parameters?.query?.pagination_token;

      expect(paginationTokenOnLoad).toBeUndefined();

      await waitFor(() => {
        expect(getNextButton()).not.toBeDisabled();
      });

      await act(() => fireEvent.click(getNextButton()));

      const lastCallArguments = requestFnMock.mock.lastCall;
      if (!lastCallArguments) {
        throw new Error('api.counterparts never been called');
      }
      const paginationToken =
        lastCallArguments[1].parameters?.query?.pagination_token;

      await waitFor(() => {
        expect(paginationToken).toBe('1');
      });
    });

    // ToDo: This test is failing because of the logic implemented for waiting data to be loaded
    test.skip('should fetch previous elements when we click on "prev" button', async () => {
      const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

      renderWithClient(<CounterpartsTable />, cachedMoniteSDK);

      await waitUntilTableIsLoaded();

      await waitFor(() => {
        expect(getNextButton()).not.toBeDisabled();
      });

      await act(() => fireEvent.click(getNextButton()));
      await waitUntilTableIsLoaded();

      await waitFor(() => {
        expect(getPrevButton()).not.toBeDisabled();
      });

      await act(() => fireEvent.click(getPrevButton()));

      const lastCallArguments = requestFnMock.mock.lastCall;
      if (!lastCallArguments) {
        throw new Error('api.counterparts never been called');
      }
      const paginationToken =
        lastCallArguments[1].parameters?.query?.pagination_token;

      expect(paginationToken).toBe('0');
    });

    test('should display category when `showCategories` in not provided', async () => {
      renderWithClient(<CounterpartsTable />);

      await waitUntilTableIsLoaded();

      const categorySections = screen.getAllByText(/Category/i);

      expect(categorySections.length).toBeGreaterThanOrEqual(1);
    });

    test('should display category when we provided `showCategories` as `true`', async () => {
      renderWithClient(<CounterpartsTable showCategories={true} />);

      await waitUntilTableIsLoaded();

      const categorySections = screen.getAllByText(/Category/i);

      expect(categorySections.length).toBeGreaterThanOrEqual(1);
    });

    test('should NOT display category when we provided `showCategories` as `false`', async () => {
      renderWithClient(<CounterpartsTable showCategories={false} />);

      await waitUntilTableIsLoaded();

      const categorySection = screen.queryByText(/Category/i);

      expect(categorySection).toBeNull();
    });
  });
});
