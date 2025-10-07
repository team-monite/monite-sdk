import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceStatusChip } from '@/components/receivables/components/InvoiceStatusChip';
import { ReceivableFilters } from '@/components/receivables/components/ReceivableFilters';
import { useReceivablesFilters } from '@/components/receivables/hooks';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAreCounterpartsLoading,
  useAutosizeGridColumns,
} from '@/core/hooks/useAutosizeGridColumns';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useGetReceivables } from '@/components/receivables/hooks/useGetReceivables';
import { ReceivableCursorFields } from '@/enums/ReceivableCursorFields';
import { CounterpartNameCellById } from '@/ui/CounterpartCell';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { DueDateCell } from '@/ui/DueDateCell';
import { TablePagination } from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Typography, Box, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';
import { useMemo, useState } from 'react';

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

  /**
   * The query to be used for the Table
   */
  query?: ReceivablesTabFilter;

  /** Filters to be applied to the table */
  filters?: Array<keyof ReceivableFilterType>;
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
  query,
  filters: filtersProp,
}: QuotesTableProps) => {
  const { i18n } = useLingui();
  const { locale, componentSettings } = useMoniteContext();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    componentSettings.receivables.pageSizeOptions?.[0] ?? 15
  );

  const [sortModel, setSortModel] = useState<QuotesTableSortModel>({
    field: query?.sort ?? 'created_at',
    sort: query?.order ?? 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const { onChangeFilter, filters, filtersQuery } = useReceivablesFilters(
    (['document_id__contains', 'status', 'counterpart_id'] as const).filter(
      (filter) => filtersProp?.includes(filter) ?? true
    ),
    query
  );

  const {
    data: quotes,
    isLoading,
    isError,
    refetch,
  } = useGetReceivables({
    ...filtersQuery,
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
  const isSearching =
    !!filters['document_id__contains' as keyof typeof filters];

  const areCounterpartsLoading = useAreCounterpartsLoading(quotes?.data);

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'document_id',
        headerName: t(i18n)`Number`,
        width: 100,
        display: 'flex',
        renderCell: ({ value }) => (
          <Stack
            direction="column"
            alignItems="flex-start"
            gap={0.5}
            sx={{ maxWidth: '100%', '& > *': { maxWidth: '100%' } }}
          >
            <Typography
              variant="body1"
              className="Monite-TextOverflowContainer"
            >
              {value || t(i18n)`INV-auto`}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'status',
        headerName: t(i18n)`Status`,
        width: 140,
        renderCell: (params) => (
          <InvoiceStatusChip status={params.value} />
        ),
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        width: 140,
        valueFormatter: (value) =>
          value ? i18n.date(value, locale.dateFormat) : '—',
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Issue Date`,
        width: 120,
        valueFormatter: (value) => value && i18n.date(value, locale.dateFormat),
      },
      {
        field: 'counterpart_name',
        sortable: ReceivableCursorFields.includes('counterpart_name'),
        headerName: t(i18n)`Customer`,
        width: defaultCounterpartColumnWidth,
        display: 'flex',
        renderCell: (params) => (
          <CounterpartNameCellById counterpartId={params.row.counterpart_id} />
        ),
      },
      {
        field: 'expiry_date',
        sortable: false,
        headerName: t(i18n)`Due date`,
        width: 120,
        valueFormatter: (value) => value && i18n.date(value, locale.dateFormat),
        renderCell: (params) => <DueDateCell data={params.row} />,
      },
      {
        field: 'amount',
        headerName: t(i18n)`Amount`,
        headerAlign: 'right',
        align: 'right',
        sortable: ReceivableCursorFields.includes('amount'),
        width: 120,
        valueGetter: (_, row) => {
          const value = row.total_amount;

          return value ? formatCurrencyToDisplay(value, row.currency) : '';
        },
      },
    ];
  }, [locale.dateFormat, formatCurrencyToDisplay, i18n]);

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
        actionButtonLabel={t(i18n)`Create Quote`}
        actionOptions={[t(i18n)`Invoice`]}
        onAction={(action) => {
          if (action === t(i18n)`Invoice`) {
            setIsCreateInvoiceDialogOpen?.(true);
          }
        }}
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
        minHeight: '500px',
        paddingTop: 2,
      }}
    >
      <ReceivableFilters onChange={onChangeFilter} filters={filters} />
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
        onRowClick={(params) => {
          if (!hasSelectedText()) {
            onRowClick?.(params.row.id);
          }
        }}
        slots={{
          pagination: () => (
            <TablePagination
              pageSizeOptions={componentSettings.receivables.pageSizeOptions}
              paginationLayout={componentSettings.receivables.paginationLayout}
              navigationPosition={componentSettings.receivables.navigationPosition}
              pageSizePosition={componentSettings.receivables.pageSizePosition}
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
              actionButtonLabel={t(i18n)`Create Quote`}
              actionOptions={[t(i18n)`Invoice`]}
              onCreate={(type) => {
                if (type === t(i18n)`Invoice`) {
                  setIsCreateInvoiceDialogOpen?.(true);
                }
              }}
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
