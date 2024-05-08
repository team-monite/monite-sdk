import React from 'react';

import { PAGE_LIMITS } from '@/constants';
import { renderWithClient } from '@/utils/test-utils';
import { screen, fireEvent, act, within } from '@testing-library/react';

import { TablePagination } from './TablePagination';

describe('TablePagination', () => {
  it('calls onPrevious when the previous button is clicked', () => {
    const onPrevious = jest.fn();

    renderWithClient(
      <TablePagination
        pageSizeOptions={PAGE_LIMITS}
        nextPage="next"
        prevPage="previous"
        paginationModel={{
          pageSize: PAGE_LIMITS[0],
          page: 'current',
        }}
        onPaginationModelChange={({ page }) => {
          onPrevious(page);
        }}
      />
    );

    const previousPageButton = screen.getByRole('button', {
      name: /Previous page/i,
    });

    act(() => {
      fireEvent.click(previousPageButton);
    });
    expect(onPrevious).toHaveBeenCalledWith('previous');
  });

  it('calls onNext when the next button is clicked', () => {
    const onNext = jest.fn();

    renderWithClient(
      <TablePagination
        pageSizeOptions={PAGE_LIMITS}
        nextPage="next"
        prevPage="previous"
        paginationModel={{
          pageSize: PAGE_LIMITS[0],
          page: 'current',
        }}
        onPaginationModelChange={({ page }) => {
          onNext(page);
        }}
      />
    );

    const nextPageButton = screen.getByRole('button', { name: /Next page/i });

    act(() => {
      fireEvent.click(nextPageButton);
    });
    expect(onNext).toHaveBeenCalledWith('next');
  });

  it('calls onPaginationModelChange when the rows per page is changed', async () => {
    const customPageSizeOptions = [1, 2, 3, 4, 5];

    const onRowsPerPageChange = jest.fn();
    renderWithClient(
      <TablePagination
        pageSizeOptions={customPageSizeOptions}
        nextPage="next"
        prevPage="previous"
        paginationModel={{
          pageSize: customPageSizeOptions[0],
          page: 'current',
        }}
        onPaginationModelChange={({ pageSize }) => {
          onRowsPerPageChange(pageSize);
        }}
      />
    );

    fireEvent.mouseDown(
      screen.getByRole('button', {
        name: customPageSizeOptions[0].toString(),
      })
    );

    const dropdown = screen.getByRole('listbox', { name: '' });
    const { getByRole } = within(dropdown);
    const option = getByRole('option', {
      name: customPageSizeOptions[1].toString(),
    });

    fireEvent.click(option);

    expect(onRowsPerPageChange).toHaveBeenCalledWith(customPageSizeOptions[1]);
  });
});
