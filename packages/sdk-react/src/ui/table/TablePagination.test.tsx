import { renderWithClient } from '@/utils/test-utils';
import { screen, fireEvent, act, within } from '@testing-library/react';

import { TablePagination } from './TablePagination';

describe('TablePagination', () => {
  it('calls onPrevious when the previous button is clicked', () => {
    const onPrevious = jest.fn();

    renderWithClient(
      <TablePagination
        nextPage="next"
        prevPage="previous"
        paginationModel={{
          pageSize: 10,
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
        nextPage="next"
        prevPage="previous"
        paginationModel={{
          pageSize: 10,
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

    fireEvent.mouseDown(screen.getByRole('combobox'));

    const dropdown = screen.getByRole('listbox', { name: '' });
    const { getByRole } = within(dropdown);
    const option = getByRole('option', {
      name: customPageSizeOptions[1].toString(),
    });

    fireEvent.click(option);

    expect(onRowsPerPageChange).toHaveBeenCalledWith(customPageSizeOptions[1]);
  });

  it('does not show page size Select if there are less than two options', async () => {
    renderWithClient(
      <TablePagination
        pageSizeOptions={[111]}
        nextPage="next"
        prevPage="previous"
        paginationModel={{
          pageSize: 111,
          page: 'current',
        }}
        onPaginationModelChange={() => {}}
      />
    );

    expect(
      screen.queryByRole('button', {
        name: '111',
      })
    ).not.toBeInTheDocument();
  });

  it('does not show page size Select by default', async () => {
    renderWithClient(
      <TablePagination
        nextPage="next"
        prevPage="previous"
        paginationModel={{
          pageSize: 111,
          page: 'current',
        }}
        onPaginationModelChange={() => {}}
      />
    );

    expect(
      screen.queryByRole('button', {
        name: '111',
      })
    ).not.toBeInTheDocument();
  });

  describe('Layout customization', () => {
    it('renders with default layout', () => {
      const { container } = renderWithClient(
        <TablePagination
          pageSizeOptions={[10, 20, 50]}
          nextPage="next"
          prevPage="previous"
          paginationModel={{
            pageSize: 10,
            page: 'current',
          }}
          onPaginationModelChange={() => {}}
        />
      );

      const grid = container.querySelector('.MuiGrid-root > .MuiGrid-item');
      expect(grid).toHaveStyle({ justifyContent: 'space-between' });
    });

    it('renders with reversed layout', () => {
      const { container } = renderWithClient(
        <TablePagination
          paginationLayout="reversed"
          pageSizeOptions={[10, 20, 50]}
          nextPage="next"
          prevPage="previous"
          paginationModel={{
            pageSize: 10,
            page: 'current',
          }}
          onPaginationModelChange={() => {}}
        />
      );

      const grid = container.querySelector('.MuiGrid-root > .MuiGrid-item');
      expect(grid).toHaveStyle({
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
      });
    });

    it('renders with centered layout', () => {
      const { container } = renderWithClient(
        <TablePagination
          paginationLayout="centered"
          pageSizeOptions={[10, 20, 50]}
          nextPage="next"
          prevPage="previous"
          paginationModel={{
            pageSize: 10,
            page: 'current',
          }}
          onPaginationModelChange={() => {}}
        />
      );

      const grid = container.querySelector('.MuiGrid-root > .MuiGrid-item');
      expect(grid).toHaveStyle({ justifyContent: 'center' });
    });

    it('centers navigation when no page size selector is shown', () => {
      const { container } = renderWithClient(
        <TablePagination
          paginationLayout="reversed" // Should be ignored
          nextPage="next"
          prevPage="previous"
          paginationModel={{
            pageSize: 10,
            page: 'current',
          }}
          onPaginationModelChange={() => {}}
        />
      );

      const grid = container.querySelector('.MuiGrid-root > .MuiGrid-item');
      expect(grid).toHaveStyle({ justifyContent: 'center' });
    });

    it('renders custom layout with navigation right and pageSize left', () => {
      const { container } = renderWithClient(
        <TablePagination
          paginationLayout="custom"
          navigationPosition="right"
          pageSizePosition="left"
          pageSizeOptions={[10, 20, 50]}
          nextPage="next"
          prevPage="previous"
          paginationModel={{
            pageSize: 10,
            page: 'current',
          }}
          onPaginationModelChange={() => {}}
        />
      );

      const grid = container.querySelector('.MuiGrid-root > .MuiGrid-item');
      expect(grid).toHaveStyle({
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
      });
    });

    it('renders custom layout with both centered', () => {
      const { container } = renderWithClient(
        <TablePagination
          paginationLayout="custom"
          navigationPosition="center"
          pageSizePosition="center"
          pageSizeOptions={[10, 20, 50]}
          nextPage="next"
          prevPage="previous"
          paginationModel={{
            pageSize: 10,
            page: 'current',
          }}
          onPaginationModelChange={() => {}}
        />
      );

      const grid = container.querySelector('.MuiGrid-root > .MuiGrid-item');
      expect(grid).toHaveStyle({ justifyContent: 'center' });
    });

    it('renders custom layout with both on left', () => {
      const { container } = renderWithClient(
        <TablePagination
          paginationLayout="custom"
          navigationPosition="left"
          pageSizePosition="left"
          pageSizeOptions={[10, 20, 50]}
          nextPage="next"
          prevPage="previous"
          paginationModel={{
            pageSize: 10,
            page: 'current',
          }}
          onPaginationModelChange={() => {}}
        />
      );

      const grid = container.querySelector('.MuiGrid-root > .MuiGrid-item');
      expect(grid).toHaveStyle({ justifyContent: 'flex-start' });
    });
  });
});
