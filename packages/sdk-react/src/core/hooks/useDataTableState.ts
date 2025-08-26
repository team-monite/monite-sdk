import {
  PaginationState,
  SortingState,
  OnChangeFn,
} from '@tanstack/react-table';
import { useState, useCallback, useMemo } from 'react';

interface DataTableStateOptions<
  TSortField extends string = string,
  TFilters extends Record<string, any> = Record<string, any>,
> {
  /** Initial page size */
  initialPageSize: number;
  /** Initial sort configuration */
  initialSort: {
    field: TSortField;
    direction: 'asc' | 'desc';
  };
  /** Optional filters configuration */
  filters?: {
    initialValue?: TFilters;
  };
}

interface DataTableApiResponse {
  /** Current API response data */
  apiResponse?: {
    next_pagination_token?: string | null;
    prev_pagination_token?: string | null;
  };
}

interface DataTableStateReturn<
  TSortField extends string = string,
  TFilters extends Record<string, any> = Record<string, any>,
> {
  // TanStack Table state
  pagination: PaginationState;
  sorting: SortingState;

  // TanStack Table handlers
  onPaginationChange: OnChangeFn<PaginationState>;
  onSortingChange: OnChangeFn<SortingState>;

  // Filter functionality (includes search)
  filters: TFilters;
  onFilterChange: (field: keyof TFilters, value: any) => void;
  onFiltersChange: (filters: Partial<TFilters>) => void;

  // Computed values for API
  sortModel: {
    field: TSortField;
    sort: 'asc' | 'desc';
  };
  currentPaginationToken: string | null;
  pageCount: number;

  // Page navigation state
  currentPageIndex: number;
  pageTokens: (string | null)[];

  // Update function for API response data
  updateApiResponse: (
    apiResponse?: DataTableApiResponse['apiResponse']
  ) => void;
}

/**
 * Custom hook for managing data table state including cursor-based pagination,
 * sorting, and filtering (including search) functionality for use with TanStack Table.
 *
 * This hook provides a complete state management solution for server-side
 * data tables with automatic pagination reset when sorting or filters change.
 * Search is treated as a filter type and managed through the filters state.
 *
 * @example
 * ```tsx
 * const {
 *   pagination,
 *   sorting,
 *   filters,
 *   onPaginationChange,
 *   onSortingChange,
 *   onFilterChange,
 *   sortModel,
 *   currentPaginationToken,
 *   pageCount,
 *   updateApiResponse,
 * } = useDataTableState({
 *   initialPageSize: 20,
 *   initialSort: { field: 'created_at', direction: 'desc' },
 *   filters: { initialValue: { search: '', status: null, date: null } },
 * });
 *
 * // Use in API query
 * const { data } = api.getData.useQuery({
 *   query: {
 *     sort: sortModel.field,
 *     order: sortModel.sort,
 *     limit: pagination.pageSize,
 *     pagination_token: currentPaginationToken || undefined,
 *     search: filters.search || undefined,
 *     status: filters.status || undefined,
 *     date: filters.date || undefined,
 *   },
 * });
 *
 * // Update with API response when available
 * React.useEffect(() => {
 *   updateApiResponse(data);
 * }, [data, updateApiResponse]);
 * ```
 */
export function useDataTableState<
  TSortField extends string = string,
  TFilters extends Record<string, any> = Record<string, any>,
>({
  initialPageSize,
  initialSort,
  filters,
}: DataTableStateOptions<TSortField, TFilters>): DataTableStateReturn<
  TSortField,
  TFilters
> {
  // API response state
  const [apiResponse, setApiResponse] =
    useState<DataTableApiResponse['apiResponse']>();

  // Cursor token management for API pagination
  const [pageTokens, setPageTokens] = useState<(string | null)[]>([null]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // TanStack Table compatible pagination state
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // TanStack Table compatible sorting state
  const [sorting, setSortingState] = useState<SortingState>([
    {
      id: initialSort.field,
      desc: initialSort.direction === 'desc',
    },
  ]);

  // Filter state management (includes search)
  const [filtersState, setFiltersState] = useState<TFilters>(
    filters?.initialValue ?? ({} as TFilters)
  );

  // Convert TanStack Table sorting to API sort model
  const sortModel = useMemo(() => {
    if (sorting.length === 0) {
      return {
        field: initialSort.field,
        sort: initialSort.direction,
      };
    }
    const firstSort = sorting[0];
    return {
      field: firstSort.id as TSortField,
      sort: firstSort.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [sorting, initialSort]);

  // Get current pagination token
  const currentPaginationToken = pageTokens[currentPageIndex];

  // Handle pagination changes from TanStack Table
  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;

      // If page size changed, reset to first page
      if (newPagination.pageSize !== pagination.pageSize) {
        setPageTokens([null]);
        setCurrentPageIndex(0);
        setPaginationState({ pageIndex: 0, pageSize: newPagination.pageSize });
        setApiResponse(undefined);
        return;
      }

      // Handle page navigation
      if (newPagination.pageIndex !== pagination.pageIndex) {
        const targetPageIndex = newPagination.pageIndex;

        // If going forward and we don't have the token yet, we need to store it
        if (
          targetPageIndex > currentPageIndex &&
          targetPageIndex === pageTokens.length
        ) {
          // We're going to the next page - store the next_pagination_token from current response
          if (apiResponse?.next_pagination_token) {
            setPageTokens((prev) => [
              ...prev,
              apiResponse.next_pagination_token!,
            ]);
          }
        }

        setCurrentPageIndex(targetPageIndex);
        setPaginationState(newPagination);
      }
    },
    [
      pagination,
      currentPageIndex,
      pageTokens,
      apiResponse?.next_pagination_token,
    ]
  );

  // Handle sorting changes from TanStack Table
  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater;
      setSortingState(newSorting);

      // Reset pagination when sorting changes
      setPageTokens([null]);
      setCurrentPageIndex(0);
      setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
      setApiResponse(undefined);
    },
    [sorting]
  );

  // Handle filter changes (including search)
  const handleFilterChange = useCallback(
    (field: keyof TFilters, value: any) => {
      setFiltersState((prev: TFilters) => ({
        ...prev,
        [field]: value,
      }));

      // Reset pagination when filters change
      setPageTokens([null]);
      setCurrentPageIndex(0);
      setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
      setApiResponse(undefined);
    },
    []
  );

  // Handle multiple filter changes
  const handleFiltersChange = useCallback((newFilters: Partial<TFilters>) => {
    setFiltersState((prev: TFilters) => ({
      ...prev,
      ...newFilters,
    }));

    // Reset pagination when filters change
    setPageTokens([null]);
    setCurrentPageIndex(0);
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
    setApiResponse(undefined);
  }, []);

  // Calculate page count for TanStack Table
  // With cursor pagination, we can only know if there's a next page, not the total count
  const pageCount = useMemo(() => {
    if (!apiResponse) return -1; // Unknown page count while loading

    // If there's a next page token, we know there's at least one more page
    if (apiResponse.next_pagination_token) {
      return Math.max(pagination.pageIndex + 2, pageTokens.length + 1);
    }

    // If there's no next page token, current page is the last page
    return pagination.pageIndex + 1;
  }, [apiResponse, pagination.pageIndex, pageTokens.length]);

  // Update function for API response data
  const updateApiResponse = useCallback(
    (newApiResponse?: DataTableApiResponse['apiResponse']) => {
      setApiResponse(newApiResponse);
    },
    []
  );

  return {
    // TanStack Table state
    pagination,
    sorting,

    // TanStack Table handlers
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,

    // Filter functionality (includes search)
    filters: filtersState,
    onFilterChange: handleFilterChange,
    onFiltersChange: handleFiltersChange,

    // Computed values for API
    sortModel,
    currentPaginationToken,
    pageCount,

    // Page navigation state
    currentPageIndex,
    pageTokens,

    // Update function for API response
    updateApiResponse,
  };
}
