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
        pageSize={PAGE_LIMITS[0]}
        onPageSizeChange={() => {}}
        isNextAvailable={true}
        onNext={() => {}}
        isPreviousAvailable={true}
        onPrevious={onPrevious}
      />
    );

    const previousPageButton = screen.getByRole('button', {
      name: /Previous page/i,
    });

    act(() => {
      fireEvent.click(previousPageButton);
    });
    expect(onPrevious).toHaveBeenCalled();
  });

  it('calls onNext when the next button is clicked', () => {
    const onNext = jest.fn();

    renderWithClient(
      <TablePagination
        pageSizeOptions={PAGE_LIMITS}
        pageSize={PAGE_LIMITS[0]}
        onPageSizeChange={() => {}}
        isNextAvailable={true}
        onNext={onNext}
        isPreviousAvailable={true}
        onPrevious={() => {}}
      />
    );

    const nextPageButton = screen.getByRole('button', { name: /Next page/i });

    act(() => {
      fireEvent.click(nextPageButton);
    });
    expect(onNext).toHaveBeenCalled();
  });

  it('calls onPageSizeChange when the rows per page is changed', async () => {
    const onRowsPerPageChange = jest.fn();
    renderWithClient(
      <TablePagination
        pageSizeOptions={PAGE_LIMITS}
        pageSize={PAGE_LIMITS[0]}
        onPageSizeChange={onRowsPerPageChange}
        isNextAvailable={true}
        onNext={() => {}}
        isPreviousAvailable={true}
        onPrevious={() => {}}
      />
    );

    fireEvent.mouseDown(
      screen.getByRole('button', {
        name: PAGE_LIMITS[0].toString(),
      })
    );

    const dropdown = screen.getByRole('listbox', { name: '' });
    const { getByRole } = within(dropdown);
    const option = getByRole('option', {
      name: PAGE_LIMITS[1].toString(),
    });

    fireEvent.click(option);

    expect(onRowsPerPageChange).toHaveBeenCalled();
  });
});
