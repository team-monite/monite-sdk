import { useState, useCallback, useMemo, useRef } from 'react';

interface ResponsiveGridStateOptions<
  TFilters extends Record<string, any> = Record<
    string,
    string | number | boolean | null
  >,
> {
  filters?: {
    initialValue?: TFilters;
  };
}

interface ResponsiveGridStateReturn<
  TFilters extends Record<string, any> = Record<
    string,
    string | number | boolean | null
  >,
> {
  // Filter functionality (includes search)
  filters: TFilters;
  onFilterChange: <TField extends keyof TFilters>(
    field: TField,
    value: TFilters[TField]
  ) => void;
  onFiltersChange: (filters: Partial<TFilters>) => void;
  resetFilters: () => void;
}

/**
 * Custom hook for managing ResponsiveGrid state with infinite scroll functionality.
 *
 * This hook provides filter management for infinite queries with automatic
 * reset when filters change.
 * Search is treated as a filter type and managed through the filters state.
 *
 * @example
 * ```tsx
 * const {
 *   filters,
 *   onFilterChange,
 *   onFiltersChange,
 *   resetFilters,
 * } = useResponsiveGridState({
 *   filters: { initialValue: { search: '', status: null } },
 * });
 *
 * // Use in infinite query
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 *   isLoading,
 *   error,
 * } = api.getData.useInfiniteQuery(
 *   {
 *     query: {
 *       limit: 12,
 *       search: filters.search || undefined,
 *       status: filters.status || undefined,
 *     },
 *   },
 *   {
 *     getNextPageParam: (lastPage) => lastPage.next_pagination_token,
 *     enabled: true,
 *   }
 * );
 *
 * // Flatten data for display
 * const allData = data?.pages.flatMap(page => page.data) || [];
 *
 * // Use with ResponsiveGrid component
 * <ResponsiveGrid
 *   data={allData}
 *   hasNextPage={hasNextPage}
 *   isFetchingNextPage={isFetchingNextPage}
 *   fetchNextPage={fetchNextPage}
 *   error={error}
 *   loading={isLoading}
 *   renderItem={(item) => <ItemCard item={item} />}
 * />
 * ```
 */

export function useResponsiveGridState<
  TFilters extends Record<string, any> = Record<
    string,
    string | number | boolean | null
  >,
>({
  filters,
}: ResponsiveGridStateOptions<TFilters>): ResponsiveGridStateReturn<TFilters> {
  // Filter state management (includes search)
  const [filtersState, setFiltersState] = useState<TFilters>(
    filters?.initialValue ?? ({} as TFilters)
  );

  // Store initial filters for reset functionality
  const initialFilters = useRef<TFilters>(
    filters?.initialValue ?? ({} as TFilters)
  );

  // Handle filter changes (including search)
  const handleFilterChange = useCallback(
    <TField extends keyof TFilters>(field: TField, value: TFilters[TField]) => {
      setFiltersState((prev: TFilters) => {
        if (prev[field] === value) {
          return prev;
        }
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    []
  );

  // Handle multiple filter changes
  const handleFiltersChange = useCallback((newFilters: Partial<TFilters>) => {
    setFiltersState((prev: TFilters) => {
      const hasChanges = Object.keys(newFilters).some(
        (key) =>
          prev[key as keyof TFilters] !== newFilters[key as keyof TFilters]
      );

      if (!hasChanges) {
        return prev;
      }

      return {
        ...prev,
        ...newFilters,
      };
    });
  }, []);

  // Reset filters to initial values
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters.current);
  }, []);

  return useMemo(
    () => ({
      // Filter functionality (includes search)
      filters: filtersState,
      onFilterChange: handleFilterChange,
      onFiltersChange: handleFiltersChange,
      resetFilters,
    }),
    [filtersState, handleFilterChange, handleFiltersChange, resetFilters]
  );
}
