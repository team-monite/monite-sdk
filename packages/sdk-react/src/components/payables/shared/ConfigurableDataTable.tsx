import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import { TablePagination } from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridSortDirection,
  GridSortModel,
  GridRenderCellParams,
  GridColDef,
  GridRowParams,
  GridRowSelectionModel,
  GridCallbackDetails,
} from '@mui/x-data-grid';
import { useMemo, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

export interface TableColumnConfig<T extends { id: string } = { id: string }> {
  field: string;
  headerName: string;
  width?: number;
  sortable?: boolean;
  type?: string;
  cellClassName?: string;
  headerAlign?: 'left' | 'center' | 'right';
  align?: 'left' | 'center' | 'right';
  renderCell?: (params: GridRenderCellParams<T>) => ReactNode;
  valueFormatter?: (value: unknown, row: T) => string | null;
  valueGetter?: (row: T) => unknown;
}

export interface TableConfig<T extends { id: string } = { id: string }> {
  columns: TableColumnConfig<T>[];
  defaultSort: {
    field: string;
    sort: GridSortDirection;
  };
  defaultPageSize: number;
  fieldOrder: string[];
  checkboxSelection?: boolean;
}

export interface ConfigurableDataTableProps<
  T extends { id: string } = { id: string },
> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error:
    | Error
    | { error: { message: string } }
    | components['schemas']['HTTPValidationError']
    | null;
  refetch: () => void;
  config: TableConfig<T>;

  nextPage?: string;
  prevPage?: string;
  currentPage?: string | null;
  pageSize: number;
  selectedRows?: string[];

  filters?: ReactNode;
  isFiltering?: boolean;
  isSearching?: boolean;

  noDataTitle?: string;
  noDataDescription1?: string;
  noDataDescription2?: string;
  filterTitle?: string;
  actionButtonLabel?: string;
  actionOptions?: string[];
  entityName?: string;

  isReadAllowed?: boolean;
  isReadAllowedLoading?: boolean;

  className?: string;
  pageSizeOptions?: number[];

  onPaginationChange: (params: {
    page: string | null;
    pageSize: number;
  }) => void;
  onSortChange?: (model: GridSortModel) => void;
  onRowClick?: (id: string) => void;
  onSelectionChange?: (selection: string[]) => void;
  onCreate?: (type: string) => void;
}

export const ConfigurableDataTable = <T extends { id: string }>(
  props: ConfigurableDataTableProps<T>
) => (
  <MoniteScopedProviders>
    <ConfigurableDataTableBase {...props} />
  </MoniteScopedProviders>
);

const ConfigurableDataTableBase = <T extends { id: string }>({
  data,
  isLoading,
  isError,
  error,
  config,
  nextPage,
  prevPage,
  currentPage,
  pageSize,
  selectedRows = [],
  filters,
  isFiltering = false,
  isSearching = false,
  noDataTitle,
  noDataDescription1,
  noDataDescription2,
  filterTitle,
  actionButtonLabel,
  actionOptions,
  entityName,
  isReadAllowed = true,
  isReadAllowedLoading = false,
  className = 'Monite-ConfigurableDataTable',
  pageSizeOptions,
  refetch,
  onCreate,
  onSelectionChange,
  onPaginationChange,
  onSortChange,
  onRowClick,
}: ConfigurableDataTableProps<T>) => {
  const { i18n } = useLingui();

  const finalNoDataTitle = noDataTitle || t(i18n)`No data yet`;
  const finalNoDataDescription1 =
    noDataDescription1 || t(i18n)`You don't have any data yet`;
  const finalNoDataDescription2 =
    noDataDescription2 || t(i18n)`Create your first item to get started`;
  const finalFilterTitle = filterTitle || t(i18n)`No data found`;
  const finalEntityName = entityName || t(i18n)`Item`;

  useEffect(() => {
    if (isError && error) {
      toast.error(getAPIErrorMessage(i18n, error));
    }
  }, [isError, error, i18n]);

  const columns = useMemo(() => {
    const baseColumns = config.columns.map((col) => ({
      field: col.field,
      headerName: col.headerName,
      width: col.width || 120,
      sortable: col.sortable ?? true,
      ...(col.type && { type: col.type as GridColDef['type'] }),
      ...(col.cellClassName && { cellClassName: col.cellClassName }),
      ...(col.headerAlign && { headerAlign: col.headerAlign }),
      ...(col.align && { align: col.align }),
      ...(col.renderCell && { renderCell: col.renderCell }),
      ...(col.valueFormatter && {
        valueFormatter: (_value: unknown, row: T) =>
          col.valueFormatter?.(row[col.field as keyof T], row),
      }),
      ...(col.valueGetter && {
        valueGetter: (_value: unknown, row: T) => col.valueGetter?.(row),
      }),
      ...(col.field === '__check__' && {
        disableColumnMenu: true,
        disableReorder: true,
      }),
    }));

    return baseColumns.sort((a, b) => {
      const aIndex = config.fieldOrder.indexOf(a.field);
      const bIndex = config.fieldOrder.indexOf(b.field);
      return aIndex === -1 || bIndex === -1 ? 0 : aIndex - bIndex;
    }) as GridColDef<T>[];
  }, [config]);

  if (isReadAllowedLoading) {
    return <LoadingPage />;
  }

  if (!isReadAllowed) {
    return <AccessRestriction />;
  }

  return (
    <Box
      className={classNames(ScopedCssBaselineContainerClassName, className)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        minHeight: '500px',
        position: 'relative',
      }}
    >
      {filters}
      {isLoading && data?.length === 0 ? (
        <LoadingPage />
      ) : (
        <DataGrid
          initialState={{
            sorting: {
              sortModel: [config.defaultSort],
            },
          }}
          checkboxSelection={config.checkboxSelection}
          rowSelection={config.checkboxSelection}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={(
            rowSelectionModel: GridRowSelectionModel,
            _details: GridCallbackDetails
          ) => {
            onSelectionChange?.(rowSelectionModel.map((id) => String(id)));
          }}
          disableColumnFilter={true}
          loading={isLoading && data?.length > 0}
          onSortModelChange={onSortChange}
          onRowClick={(params: GridRowParams<T>) => {
            const item = params.row;
            if (!hasSelectedText()) {
              onRowClick?.(item.id);
            }
          }}
          sx={{
            '& .MuiDataGrid-withBorderColor': {
              borderColor: 'divider',
            },
            '&.MuiDataGrid-withBorderColor': {
              borderColor: 'divider',
            },
          }}
          slots={{
            pagination: () => (
              <TablePagination
                pageSizeOptions={pageSizeOptions}
                nextPage={nextPage}
                prevPage={prevPage}
                paginationModel={{
                  pageSize,
                  page: currentPage || null,
                }}
                onPaginationModelChange={({ page, pageSize }) => {
                  onPaginationChange({ page, pageSize });
                }}
              />
            ),
            noRowsOverlay: () => (
              <GetNoRowsOverlay
                noDataTitle={finalNoDataTitle}
                noDataDescription1={finalNoDataDescription1}
                noDataDescription2={finalNoDataDescription2}
                filterTitle={finalFilterTitle}
                actionButtonLabel={
                  !isFiltering && !isSearching ? actionButtonLabel : undefined
                }
                actionOptions={
                  !isFiltering && !isSearching ? actionOptions : undefined
                }
                isLoading={isLoading}
                isFiltering={isFiltering}
                isSearching={isSearching}
                isError={isError}
                dataLength={data?.length || 0}
                onCreate={(type) => {
                  onCreate?.(type);
                }}
                refetch={refetch}
                entityName={finalEntityName}
                type="no-data"
              />
            ),
          }}
          columns={columns}
          rows={data || []}
        />
      )}
    </Box>
  );
};
