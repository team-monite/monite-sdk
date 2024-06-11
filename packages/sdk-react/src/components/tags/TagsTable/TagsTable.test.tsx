import React from 'react';

import { createAPIClient } from '@/api/client';
import {
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
  ENTITY_ID_FOR_READONLY_PERMISSIONS,
} from '@/mocks';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { requestFn } from '@openapi-qraft/react';
import {
  fireEvent,
  getByLabelText,
  screen,
  waitFor,
} from '@testing-library/react';

import { TagsTable } from './TagsTable';

const requestFnMock = requestFn as jest.MockedFunction<typeof requestFn>;

const { api } = createAPIClient();

describe('TagsTable', () => {
  test('should cut tag name if it is so long', async () => {
    renderWithClient(<TagsTable />);

    await waitUntilTableIsLoaded();

    /** We have to use async find because the list loads asynchronously */
    const cuttedText = screen.getByText(/tag .../);

    expect(cuttedText).toBeInTheDocument();
  });

  describe('# Pagination', () => {
    test('should fetch only first 10 elements when the `limit` set as 10 (by default)', async () => {
      renderWithClient(<TagsTable />);

      await waitUntilTableIsLoaded();

      const existsTag = screen.findByText('tag 1');
      const notExists = screen.findByText('tag 11', undefined, {
        timeout: 200,
      });

      await expect(existsTag).resolves.toBeInTheDocument();
      await expect(notExists).rejects.toThrowError(/Unable to find an element/);
    });

    test('next button should be available for interaction but previous button not', async () => {
      renderWithClient(<TagsTable />);

      /** Wait until the table is loaded */
      await waitUntilTableIsLoaded();

      const nextButton = screen.getByRole('button', {
        name: /next/i,
      });
      const prevButton = screen.getByRole('button', {
        name: /previous/i,
      });

      const nextDisabled = nextButton.hasAttribute('disabled');
      const prevDisabled = prevButton.hasAttribute('disabled');

      expect(prevDisabled).toBeTruthy();
      expect(nextDisabled).toBeFalsy();
    });

    test('should fetch next 10 elements when we click on "next" button', async () => {
      renderWithClient(<TagsTable />);

      /** Wait until table is loaded */
      await waitUntilTableIsLoaded();

      const nextButton = await screen.findByRole('button', {
        name: /next/i,
      });

      fireEvent.click(nextButton);

      const notExists = screen.findByText('tag 1', undefined, {
        timeout: 200,
      });
      const existsTag = screen.findByText('tag 11', undefined, {
        timeout: 200,
      });

      await expect(notExists).rejects.toThrowError(/Unable to find an element/);
      await expect(existsTag).resolves.toBeInTheDocument();
    });

    test('should fetch previous 10 elements when we click on "next" and then on "prev" buttons', async () => {
      renderWithClient(<TagsTable />);

      /** Wait until table is loaded */
      await waitUntilTableIsLoaded();

      const nextButton = await screen.findByRole('button', {
        name: /next/i,
      });

      fireEvent.click(nextButton);

      await waitUntilTableIsLoaded();

      const prevButton = await screen.findByRole('button', {
        name: /prev/i,
      });

      fireEvent.click(prevButton);

      const existsTag = screen.findByText('tag 1', undefined, {
        timeout: 200,
      });
      const notExists = screen.findByText('tag 11', undefined, {
        timeout: 200,
      });

      await expect(notExists).rejects.toThrowError(/Unable to find an element/);
      await expect(existsTag).resolves.toBeInTheDocument();
    });
  });

  /**
   * i18nProvider doesn't assign `i18n` an object to the context,
   *  and we have no ability to provide `de-DE` locale
   */
  describe('# Sorting', () => {
    test('should sort a table by `created_at` field in ascending order when we click on that field once', async () => {
      renderWithClient(<TagsTable />);

      const createdAtButton = await screen.findByText('Created at');
      fireEvent.click(createdAtButton);

      await waitFor(() =>
        expect(requestFnMock.mock.lastCall?.[1].parameters?.query).toEqual({
          limit: 10,
          order: 'asc',
          sort: 'created_at',
        })
      );
      expect(requestFnMock.mock.lastCall?.[0].url).toEqual(
        api.tags.getTags.schema.url
      );
    });

    test('should sort a table by `created_at` field in descending order when we click on that field twice', async () => {
      renderWithClient(<TagsTable />);

      const createdAtButton = await screen.findByText('Created at');

      // Sort by `created_at` in ascending order
      fireEvent.click(createdAtButton);

      // Sort by `created_at` in descending order
      fireEvent.click(createdAtButton);

      await waitFor(() =>
        expect(requestFnMock.mock.lastCall?.[1].parameters?.query).toEqual({
          limit: 10,
          order: 'desc',
          sort: 'created_at',
        })
      );
      expect(requestFnMock.mock.lastCall?.[0].url).toEqual(
        api.tags.getTags.schema.url
      );
    });

    test('should flush sorting by `created_at` field when we click on that field 3 times', async () => {
      renderWithClient(<TagsTable />);

      const createdAtButton = await screen.findByText('Created at');

      // Sort by `created_at` in ascending order
      fireEvent.click(createdAtButton);
      // Sort by `created_at` in descending order
      fireEvent.click(createdAtButton);
      // Flush sorting
      fireEvent.click(createdAtButton);

      await waitFor(() =>
        expect(requestFnMock.mock.lastCall?.[1].parameters?.query).toEqual({
          limit: 10,
          order: undefined,
          sort: undefined,
        })
      );
      expect(requestFnMock.mock.lastCall?.[0].url).toEqual(
        api.tags.getTags.schema.url
      );
    });

    test('should sort a table by `updated_at` field in ascending order when we click on that field once', async () => {
      renderWithClient(<TagsTable />);

      const updatedAtButton = await screen.findByText('Updated at');

      // Sort by `updated_at` in ascending order
      fireEvent.click(updatedAtButton);

      await waitFor(() =>
        expect(requestFnMock.mock.lastCall?.[1].parameters?.query).toEqual({
          limit: 10,
          order: 'asc',
          sort: 'updated_at',
        })
      );
      expect(requestFnMock.mock.lastCall?.[0].url).toEqual(
        api.tags.getTags.schema.url
      );
    });

    test('should sort a table by `updated_at` field in descending order when we click on that field twice', async () => {
      renderWithClient(<TagsTable />);

      const updatedAtButton = await screen.findByText('Updated at');

      // Sort by `updated_at` in ascending order
      fireEvent.click(updatedAtButton);
      // Sort by `updated_at` in descending order
      fireEvent.click(updatedAtButton);

      await waitFor(() =>
        expect(requestFnMock.mock.lastCall?.[1].parameters?.query).toEqual({
          limit: 10,
          order: 'desc',
          sort: 'updated_at',
        })
      );
      expect(requestFnMock.mock.lastCall?.[0].url).toEqual(
        api.tags.getTags.schema.url
      );
    });

    test('should flush sorting by `updated_at` field when we click on that field 3 times', async () => {
      renderWithClient(<TagsTable />);

      const updatedAtButton = await screen.findByText('Updated at');

      // Sort by `updated_at` in ascending order
      fireEvent.click(updatedAtButton);
      // Sort by `updated_at` in descending order
      fireEvent.click(updatedAtButton);
      // Flush sorting
      fireEvent.click(updatedAtButton);

      await waitFor(() =>
        expect(requestFnMock.mock.lastCall?.[1].parameters?.query).toEqual({
          limit: 10,
          order: undefined,
          sort: undefined,
        })
      );
      expect(requestFnMock.mock.lastCall?.[0].url).toEqual(
        api.tags.getTags.schema.url
      );
    });
  });

  /**
   * @todo: Anashev. MUI Data Grid doesn't render actions buttons because they're calling `renderCell` method
   *  which is not fires during tests
   *
   * @see {link https://github.com/mui/mui-x/issues/1151#issuecomment-1636507565} Stackoverflow discussion
   */
  describe('# Actions', () => {
    test('should appear an edit modal when we click on "edit" button', async () => {
      renderWithClient(<TagsTable />);

      await waitUntilTableIsLoaded();

      const actionButtons = screen.getAllByRole('menuitem', {
        name: 'Edit',
      });
      const actionButton = actionButtons[0];

      fireEvent.click(actionButton);

      const editTitle = await screen.findByText(/Edit tag/);
      const editSave = screen.getByRole('button', {
        name: t`Save`,
      });

      expect(editTitle).toBeInTheDocument();
      expect(editSave).toBeInTheDocument();
    });

    test('should appear a delete modal when we click on "delete" button', async () => {
      renderWithClient(<TagsTable />);

      await waitUntilTableIsLoaded();

      const actionButtons = screen.getAllByRole('menuitem', {
        name: 'Delete',
      });
      const actionButton = actionButtons[0];

      fireEvent.click(actionButton);

      const deleteTitle = screen.getByText(/Delete /);
      const deleteModalButton = screen.getByRole('button', {
        name: t`Delete`,
      });

      expect(deleteTitle).toBeInTheDocument();
      expect(deleteModalButton).toBeInTheDocument();
    });

    test('should trigger a callback with "asc" order when we click on "created_at" button once', async () => {
      const onChangeSortMock = jest.fn();

      renderWithClient(<TagsTable onChangeSort={onChangeSortMock} />);

      await waitUntilTableIsLoaded();

      const createdAtButton = screen.getByText('Created at');

      fireEvent.click(createdAtButton);

      expect(onChangeSortMock).toHaveBeenNthCalledWith(1, {
        field: 'created_at',
        sort: 'asc',
      });
    });

    test('should trigger a callback with "desc" order when we click on "created_at" button twice', async () => {
      const onChangeSortMock = jest.fn();

      renderWithClient(<TagsTable onChangeSort={onChangeSortMock} />);

      await waitUntilTableIsLoaded();

      const createdAtButton = screen.getByText('Created at');

      fireEvent.click(createdAtButton);
      fireEvent.click(createdAtButton);

      expect(onChangeSortMock).toHaveBeenLastCalledWith({
        field: 'created_at',
        sort: 'desc',
      });
    });

    test('should trigger a callback with no order when we click on "created_at" button 3 times', async () => {
      const onChangeSortMock = jest.fn();

      renderWithClient(<TagsTable onChangeSort={onChangeSortMock} />);

      await waitUntilTableIsLoaded();

      const createdAtButton = screen.getByText('Created at');

      fireEvent.click(createdAtButton);
      fireEvent.click(createdAtButton);
      fireEvent.click(createdAtButton);

      expect(onChangeSortMock).toHaveBeenLastCalledWith(undefined);
    });
  });

  describe('# Permissions', () => {
    test('support "update" and "delete" permissions', async () => {
      renderWithClient(<TagsTable />);

      await waitUntilTableIsLoaded();

      const existsTag = screen.findByText('tag 1');

      await expect(existsTag).resolves.toBeInTheDocument();
      const tableRow = (await existsTag).closest('[role=row]');
      if (!(tableRow instanceof HTMLElement))
        throw new Error('Table row not found');

      const editButton = getByLabelText(tableRow, t`Edit`);
      expect(editButton).toBeInTheDocument();
      expect(editButton).not.toBeDisabled();

      const deleteButton = getByLabelText(tableRow, t`Delete`);
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).not.toBeDisabled();
    });

    test('support no "update" and no "delete" permissions', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_READONLY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      });

      renderWithClient(<TagsTable />, monite);

      await waitUntilTableIsLoaded();

      const existsTag = screen.findByText('tag 1');

      await expect(existsTag).resolves.toBeInTheDocument();
      const tableRow = (await existsTag).closest('[role=row]');
      if (!(tableRow instanceof HTMLElement))
        throw new Error('Table row not found');

      const editButton = getByLabelText(tableRow, t`Edit`);
      expect(editButton).toBeInTheDocument();
      expect(editButton).toBeDisabled();

      const deleteButton = getByLabelText(tableRow, t`Delete`);
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toBeDisabled();
    });

    test('support "allowed_for_own" access for "update" and "delete" permissions', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      });

      renderWithClient(<TagsTable />, monite);

      await waitUntilTableIsLoaded();

      const existsTag = screen.findByText('tag 1');

      await expect(existsTag).resolves.toBeInTheDocument();
      const tableRow = (await existsTag).closest('[role=row]');
      if (!(tableRow instanceof HTMLElement))
        throw new Error('Table row not found');

      const editButton = getByLabelText(tableRow, t`Edit`);
      expect(editButton).toBeInTheDocument();
      expect(editButton).not.toBeDisabled();

      const deleteButton = getByLabelText(tableRow, t`Delete`);
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).not.toBeDisabled();
    });
  });
});
