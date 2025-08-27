import { cn } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Button } from '@/ui/components/button';
import { Skeleton } from '@/ui/components/skeleton';
import { plural, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Table as ReactTableTable,
  ColumnFiltersState,
  getFilteredRowModel,
  PaginationState,
  OnChangeFn,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';

const PAGES_SIZES: number[] = [20, 50, 100];
const DEFAULT_PAGE_SIZE: number = 20;

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  canHideColumn?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  canHideColumn = true,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { i18n } = useLingui();

  if (!column.getCanSort()) {
    return <span className={cn('mtw:font-bold', className)}>{title}</span>;
  }

  return (
    <div className={cn('mtw:flex mtw:items-center mtw:gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="mtw:data-[state=open]:bg-accent mtw:h-8 mtw:font-bold"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            {t(i18n)`Ascending`}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            {t(i18n)`Descending`}
          </DropdownMenuItem>
          {canHideColumn && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff />
                {t(i18n)`Hide`}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: ReactTableTable<TData>;
  isControlledPagination?: boolean;
}

export function DataTablePagination<TData>({
  table,
  isControlledPagination,
}: DataTablePaginationProps<TData>) {
  const { i18n } = useLingui();

  return (
    <div className="mtw:flex mtw:items-center mtw:justify-between mtw:px-2">
      <div className="mtw:max-w-[80%] mtw:flex-1">
        {isControlledPagination ? (
          <div></div>
        ) : (
          <p className="mtw:text-muted-foreground mtw:text-sm">{t(
            i18n
          )`${table.getFilteredRowModel().rows.length} ${plural(
            table.getFilteredRowModel().rows.length,
            {
              one: 'result',
              other: 'results',
            }
          )}`}</p>
        )}
      </div>
      <div className="mtw:flex mtw:items-center mtw:space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="mtw:hidden mtw:size-8 lg:mtw:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="mtw:sr-only">{t(i18n)`Go to first page`}</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="mtw:size-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="mtw:sr-only">{t(i18n)`Go to previous page`}</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="mtw:size-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="mtw:sr-only">{t(i18n)`Go to next page`}</span>
          <ChevronRight />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="mtw:hidden mtw:size-8 lg:mtw:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="mtw:sr-only">{t(i18n)`Go to last page`}</span>
          <ChevronsRight />
        </Button>
      </div>
      <div className="mtw:flex mtw:items-center mtw:space-x-2 mtw:max-w-[80%] mtw:flex-1 mtw:justify-end">
        <p className="mtw:text-muted-foreground mtw:text-sm">{t(
          i18n
        )`Results per page`}</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="mtw:h-8 mtw:w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {PAGES_SIZES.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Loading state
  loading?: boolean;
  // Controlled pagination state
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  // Manual pagination props
  pageCount?: number;
  // Controlled sorting state
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  // Controlled column filters state
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  // Row click handler
  onRowClick?: (row: TData) => void;
  // Custom no rows overlay component
  noRowsOverlay?: React.ComponentType;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  pagination: controlledPagination,
  onPaginationChange: controlledOnPaginationChange,
  pageCount,
  sorting: controlledSorting,
  onSortingChange: controlledOnSortingChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange: controlledOnColumnFiltersChange,
  onRowClick,
  noRowsOverlay: NoRowsOverlay,
}: DataTableProps<TData, TValue>) {
  const { i18n } = useLingui();

  // Internal state (fallback when controlled state is not provided)
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);

  // Use controlled state if provided, otherwise use internal state
  const pagination = controlledPagination ?? internalPagination;
  const onPaginationChange =
    controlledOnPaginationChange ?? setInternalPagination;
  const sorting = controlledSorting ?? internalSorting;
  const onSortingChange = controlledOnSortingChange ?? setInternalSorting;
  const columnFilters = controlledColumnFilters ?? internalColumnFilters;
  const onColumnFiltersChange =
    controlledOnColumnFiltersChange ?? setInternalColumnFilters;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange,
    manualPagination: !!controlledPagination, // Use manual pagination when state is controlled
    pageCount: pageCount ?? -1, // -1 means unknown page count for manual pagination
    state: {
      columnFilters,
      sorting,
      pagination,
    },
  });

  return (
    <div className="mtw:flex mtw:flex-col mtw:h-full">
      <div className="mtw:flex mtw:flex-col mtw:flex-1 mtw:min-h-0">
        <div className="mtw:relative mtw:overflow-auto mtw:flex-1 mtw:h-full">
          <table className="mtw:w-full mtw:caption-bottom mtw:text-sm mtw:border-collapse mtw:separate mtw:border-spacing-0">
            <thead className="mtw:[&_tr]:border-b mtw:[&_tr]:border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="mtw:hover:bg-muted/50 mtw:data-[state=selected]:bg-muted mtw:border-b mtw:border-border mtw:transition-colors"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="mtw:sticky mtw:top-0 mtw:z-10 mtw:bg-background mtw:text-foreground mtw:h-10 mtw:px-3 mtw:text-left mtw:align-middle mtw:whitespace-nowrap mtw:border-b mtw:border-border mtw:after:content-[''] mtw:after:absolute mtw:after:bottom-0 mtw:after:left-0 mtw:after:right-0 mtw:after:border-b mtw:after:border-border"
                      >
                        {header.isPlaceholder ? null : (
                          <DataTableColumnHeader
                            column={header.column}
                            title={header.column.columnDef.header as string}
                          />
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="mtw:[&_tr:last-child]:border-0">
              {loading ? (
                Array.from({ length: pagination.pageSize }).map((_, index) => (
                  <tr
                    key={`loading-row-${index}`}
                    className="mtw:border-b mtw:border-border"
                  >
                    {Array.from({ length: columns.length }).map(
                      (_, cellIndex) => (
                        <td
                          key={`loading-cell-${index}-${cellIndex}`}
                          className="mtw:p-3 mtw:align-middle mtw:whitespace-nowrap"
                        >
                          <Skeleton className="mtw:h-4 mtw:w-full" />
                        </td>
                      )
                    )}
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="mtw:hover:bg-muted/50 mtw:data-[state=selected]:bg-muted mtw:border-b mtw:border-border mtw:transition-colors"
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="mtw:p-3 mtw:align-middle mtw:whitespace-nowrap mtw:font-normal"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="mtw:p-3 mtw:align-middle mtw:whitespace-nowrap mtw:font-normal mtw:text-center"
                  >
                    {NoRowsOverlay ? <NoRowsOverlay /> : t(i18n)`No results.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mtw:flex-shrink-0 mtw:mt-4">
        <DataTablePagination
          table={table}
          isControlledPagination={!!controlledPagination}
        />
      </div>
    </div>
  );
}
