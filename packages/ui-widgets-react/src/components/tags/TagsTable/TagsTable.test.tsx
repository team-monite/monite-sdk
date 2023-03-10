import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithClient } from 'utils/test-utils';
import TagsTable from './TagsTable';
import i18n from '../../../core/i18n';

async function waitUntilTableIsLoaded(page: 1 | 2 = 1) {
  return page === 1
    ? await screen.findByText('tag 1')
    : await screen.findByText('tag 11');
}

describe('TagsTable', () => {
  test('should cut tag name if it is so long', async () => {
    renderWithClient(<TagsTable />);

    /** We have to use async find because the list loads asynchronously */
    const cuttedText = await screen.findByText(/tag .../);

    expect(cuttedText).toBeInTheDocument();
  });

  describe('# Pagination', () => {
    test('should fetch only first 10 elements when the `limit` set as 10 (by default)', async () => {
      renderWithClient(<TagsTable />);

      const existsTag = screen.findByText('tag 1');
      const notExists = screen.findByText('tag 11');

      await expect(existsTag).resolves.toBeInTheDocument();
      await expect(notExists).rejects.toThrowError(/Unable to find an element/);
    });

    test('next button should be available for interaction but previous button not', async () => {
      renderWithClient(<TagsTable />);

      /** Wait until table is loaded */
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

      const nextButton = await screen.findByRole('button', {
        name: /next/i,
      });

      /** Wait until table is loaded */
      await waitUntilTableIsLoaded();

      fireEvent.click(nextButton);

      const notExists = screen.findByText('tag 1');
      const existsTag = screen.findByText('tag 11');

      await expect(notExists).rejects.toThrowError(/Unable to find an element/);
      await expect(existsTag).resolves.toBeInTheDocument();
    });

    test('should fetch previous 10 elements when we click on "next" and then on "prev" buttons', async () => {
      renderWithClient(<TagsTable />);

      const nextButton = await screen.findByRole('button', {
        name: /next/i,
      });

      /** Wait until table is loaded */
      await waitUntilTableIsLoaded();

      fireEvent.click(nextButton);

      await waitUntilTableIsLoaded(2);

      const prevButton = await screen.findByRole('button', {
        name: /prev/i,
      });

      fireEvent.click(prevButton);

      const existsTag = screen.findByText('tag 1');
      const notExists = screen.findByText('tag 11');

      await expect(notExists).rejects.toThrowError(/Unable to find an element/);
      await expect(existsTag).resolves.toBeInTheDocument();
    });
  });

  describe('# Sorting', () => {
    test('should sort a table by `created_at` field in ascending order when we click on that field once', async () => {
      renderWithClient(<TagsTable />);

      const createdAtButton = await screen.findByText('Created at');

      let dates = await screen.findAllByText(/.09.2022/);

      fireEvent.click(createdAtButton);

      /** Refetch the data from the table */
      dates = await screen.findAllByText(/.09.2022/);

      expect(dates[0]).toHaveTextContent('01.09.2022');
      expect(dates[9]).toHaveTextContent('07.09.2022');
    });

    test('should sort a table by `created_at` field in descending order when we click on that field twice', async () => {
      renderWithClient(<TagsTable />);

      const createdAtButton = await screen.findByText('Created at');

      let dates = await screen.findAllByText(/.09.2022/);

      fireEvent.click(createdAtButton);
      fireEvent.click(createdAtButton);

      dates = await screen.findAllByText(/.09.2022/);

      /** Position should remain the same because by default we sort all tags by `created_at` field */
      expect(dates[0]).toHaveTextContent('07.09.2022');
      expect(dates[9]).toHaveTextContent('01.09.2022');
    });

    test('should flush sorting by `created_at` field when we click on that field 3 times', async () => {
      renderWithClient(<TagsTable />);

      const createdAtButton = await screen.findByText('Created at');

      let dates = await screen.findAllByText(/.09.2022/);

      expect(dates[0]).toHaveTextContent('07.09.2022');
      expect(dates[1]).toHaveTextContent('06.09.2022');
      expect(dates[2]).toHaveTextContent('05.09.2022');

      fireEvent.click(createdAtButton);
      fireEvent.click(createdAtButton);
      fireEvent.click(createdAtButton);

      dates = await screen.findAllByText(/.09.2022/);

      expect(dates[0]).toHaveTextContent('07.09.2022');
      expect(dates[1]).toHaveTextContent('06.09.2022');
      expect(dates[2]).toHaveTextContent('05.09.2022');
    });

    test('should sort a table by `updated_at` field in ascending order when we click on that field once', async () => {
      renderWithClient(<TagsTable />);

      const updatedAtButton = await screen.findByText('Updated at');

      let dates = await screen.findAllByText(/.10.2023/);

      fireEvent.click(updatedAtButton);

      /** Refetch the data from the table */
      dates = await screen.findAllByText(/.10.2023/);

      expect(dates[0]).toHaveTextContent('06.10.2023');
      expect(dates[9]).toHaveTextContent('25.10.2023');
    });

    test('should sort a table by `updated_at` field in descending order when we click on that field twice', async () => {
      renderWithClient(<TagsTable />);

      const updatedAtButton = await screen.findByText('Updated at');

      let dates = await screen.findAllByText(/.10.2023/);

      fireEvent.click(updatedAtButton);
      fireEvent.click(updatedAtButton);

      dates = await screen.findAllByText(/.10.2023/);

      /** Position should remain the same because by default we sort all tags by `created_at` field */
      expect(dates[0]).toHaveTextContent('25.10.2023');
      expect(dates[9]).toHaveTextContent('06.10.2023');
    });

    test('should flush sorting by `updated_at` field when we click on that field 3 times', async () => {
      renderWithClient(<TagsTable />);

      const updatedAtButton = await screen.findByText('Updated at');

      let dates = await screen.findAllByText(/.10.2023/);

      expect(dates[0]).toHaveTextContent('10.10.2023');
      expect(dates[1]).toHaveTextContent('11.10.2023');
      expect(dates[2]).toHaveTextContent('12.10.2023');

      fireEvent.click(updatedAtButton);
      fireEvent.click(updatedAtButton);
      fireEvent.click(updatedAtButton);

      dates = await screen.findAllByText(/.10.2023/);

      expect(dates[0]).toHaveTextContent('10.10.2023');
      expect(dates[1]).toHaveTextContent('11.10.2023');
      expect(dates[2]).toHaveTextContent('12.10.2023');
    });
  });

  describe('# Actions', () => {
    test('should appear "edit" and "delete" buttons when we click on right action button', async () => {
      renderWithClient(<TagsTable />);

      await waitUntilTableIsLoaded();

      const actionButtons = screen.getAllByRole('button');
      const actionButton = actionButtons[0];

      fireEvent.click(actionButton);

      const editName = i18n.t('tags:actions.edit');
      const deleteName = i18n.t('tags:actions.delete');

      const editButton = screen.getByText(editName);
      const deleteButton = screen.getByText(deleteName);

      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    test('should appear an edit modal when we click on "edit" button', async () => {
      renderWithClient(<TagsTable />);

      await waitUntilTableIsLoaded();

      const actionButtons = screen.getAllByRole('button');
      const actionButton = actionButtons[0];

      fireEvent.click(actionButton);

      const editName = i18n.t('tags:actions.edit');
      const editButton = screen.getByText(editName);

      fireEvent.click(editButton);

      const editTitle = screen.getByText(/Edit tag/);
      const editSave = screen.getByRole('button', {
        name: i18n.t('common:save'),
      });

      expect(editTitle).toBeInTheDocument();
      expect(editSave).toBeInTheDocument();
    });

    test('should appear an delete modal when we click on "delete" button', async () => {
      renderWithClient(<TagsTable />);

      await waitUntilTableIsLoaded();

      const actionButtons = screen.getAllByRole('button');
      const actionButton = actionButtons[0];

      fireEvent.click(actionButton);

      const deleteName = i18n.t('tags:actions.delete');
      const deleteButton = screen.getByText(deleteName);

      fireEvent.click(deleteButton);

      const deleteTitle = screen.getByText(/Delete /);
      const deleteModalButton = screen.getByRole('button', {
        name: i18n.t('common:delete'),
      });

      expect(deleteTitle).toBeInTheDocument();
      expect(deleteModalButton).toBeInTheDocument();
    });

    test('should trigger a callback with "asc" order when we click on "created_at" button once', async () => {
      const onChangeSortMock = jest.fn();

      renderWithClient(<TagsTable onChangeSort={onChangeSortMock} />);

      await waitUntilTableIsLoaded();

      const createdAtButton = screen.getByText('Created at');

      /**
       * TagsTable initially fires `onChangeSort` callback on mount.
       *  For `created_at` and `updated_at` fields but with no order field
       */
      expect(onChangeSortMock).toHaveBeenNthCalledWith(1, {
        sort: 'created_at',
        order: null,
      });
      expect(onChangeSortMock).toHaveBeenNthCalledWith(2, {
        sort: 'updated_at',
        order: null,
      });

      fireEvent.click(createdAtButton);

      expect(onChangeSortMock).toHaveBeenNthCalledWith(3, {
        sort: 'created_at',
        order: 'asc',
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
        sort: 'created_at',
        order: 'desc',
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

      expect(onChangeSortMock).toHaveBeenLastCalledWith({
        sort: 'created_at',
        order: null,
      });
    });
  });
});
