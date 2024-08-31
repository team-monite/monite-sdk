import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAreCounterpartsLoading,
  useAutosizeGridColumns,
} from '@/core/hooks/useAutosizeGridColumns';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useReceivables } from '@/core/queries/useReceivables';
import { ReceivableCursorFields } from '@/enums/ReceivableCursorFields';
import { CounterpartCellById } from '@/ui/CounterpartCell';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { useDateFormat } from '@/utils/MoniteOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ReceivableFilters } from '../ReceivableFilters';
import { useReceivablesFilters } from '../ReceivableFilters/useReceivablesFilters';

export interface QuotesTableSortModel {
  field: components['schemas']['ReceivableCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

type QuotesTableProps = {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;

  /**
   * The event handler for a sort change.
   *
   * @param {QuotesTableSortModel} params - The sort model.
   */
  onChangeSort?: (params: QuotesTableSortModel) => void;

  /**
   * The event handler for the creation new invoice for no data state
   *
   @param {boolean} isOpen - A boolean value indicating whether the dialog should be open (true) or closed (false).
   */
  setIsCreateInvoiceDialogOpen?: (isOpen: boolean) => void;
};

export const QuotesTable = (props: QuotesTableProps) => (
  <MoniteScopedProviders>
    <QuotesTableBase {...props} />
  </MoniteScopedProviders>
);

const QuotesTableBase = ({
  onRowClick,
  onChangeSort: onChangeSortCallback,
  setIsCreateInvoiceDialogOpen,
}: QuotesTableProps) => {
  const { i18n } = useLingui();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );

  const [sortModel, setSortModel] = useState<QuotesTableSortModel>({
    field: 'created_at',
    sort: 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const { onChangeFilter, filters } = useReceivablesFilters();

  const {
    data: quotes,
    isLoading,
    isError,
    refetch,
  } = useReceivables({
    ...filters,
    sort: sortModel?.field,
    order: sortModel?.sort,
    limit: pageSize,
    pagination_token: paginationToken,
    type: 'quote',
  });

  const onChangeSort = (models: GridSortModel) => {
    const model = models[0] as QuotesTableSortModel;

    setSortModel(model);
    setPaginationToken(undefined);

    onChangeSortCallback?.(model);
  };

  const isFiltering = Object.keys(filters).some(
    (key) =>
      filters[key as keyof typeof filters] !== null &&
      filters[key as keyof typeof filters] !== undefined
  );
  const isSearching = !!filters['document_id__contains'];

  const areCounterpartsLoading = useAreCounterpartsLoading(quotes?.data);
  const dateFormat = useDateFormat();

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'document_id',
        headerName: t(i18n)`Number`,
        width: 100,
        renderCell: ({ value }) => {
          if (!value) {
            return t(i18n)`INV-auto`;
          }

          return <span className="Monite-TextOverflowContainer">{value}</span>;
        },
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        width: 140,
        valueFormatter: (value) => (value ? i18n.date(value, dateFormat) : '—'),
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Issue Date`,
        width: 120,
        valueFormatter: (value) => value && i18n.date(value, dateFormat),
      },
      {
        field: 'counterpart_name',
        sortable: ReceivableCursorFields.includes('counterpart_name'),
        headerName: t(i18n)`Customer`,
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <CounterpartCellById counterpartId={params.row.counterpart_id} />
        ),
      },
      {
        field: 'expiry_date',
        sortable: false,
        headerName: t(i18n)`Due date`,
        width: 120,
        valueFormatter: (value) => value && i18n.date(value, dateFormat),
      },
      {
        field: 'status',
        sortable: ReceivableCursorFields.includes('status'),
        headerName: t(i18n)`Status`,
        width: 80,
        renderCell: (params) => {
          const status = params.value;

          return <InvoiceStatusChip status={status} />;
        },
      },
      {
        field: 'amount',
        headerName: t(i18n)`Amount`,
        sortable: ReceivableCursorFields.includes('amount'),
        width: 120,
        valueGetter: (_, row) => {
          const value = row.total_amount;

          return value ? formatCurrencyToDisplay(value, row.currency) : '';
        },
      },
    ];
  }, [dateFormat, formatCurrencyToDisplay, i18n]);

  const gridApiRef = useAutosizeGridColumns(
    quotes?.data,
    columns,
    areCounterpartsLoading,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'QuotesTable'
  );

  if (!isLoading && quotes?.data.length === 0 && !isFiltering && !isSearching) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No Quotes`}
        descriptionLine1={t(i18n)`You don’t have any quotes yet.`}
        descriptionLine2={t(i18n)`You can create your first quote.`}
        type="no-data"
      />
    );
  }

  const className = 'Monite-QuotesTable';

  return (
    <Box
      className={classNames(ScopedCssBaselineContainerClassName, className)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        pt: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <ReceivableFilters
          onChange={onChangeFilter}
          filters={['document_id__contains', 'status', 'counterpart_id']}
        />
      </Box>
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [sortModel],
          },
        }}
        apiRef={gridApiRef}
        rowSelection={false}
        disableColumnFilter={true}
        loading={isLoading}
        onSortModelChange={onChangeSort}
        sx={{
          '& .MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
          '&.MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
        }}
        onRowClick={(params) => onRowClick?.(params.row.id)}
        slots={{
          pagination: () => (
            <TablePagination
              nextPage={quotes?.next_pagination_token}
              prevPage={quotes?.prev_pagination_token}
              paginationModel={{
                pageSize,
                page: paginationToken,
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                setPageSize(pageSize);
                setPaginationToken(page ?? undefined);
              }}
            />
          ),
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={quotes?.data.length || 0}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              refetch={refetch}
              entityName={t(i18n)`Quotes`}
              type="no-data"
            />
          ),
        }}
        columns={columns}
        rows={quotes?.data || []}
      />
    </Box>
  );
};
