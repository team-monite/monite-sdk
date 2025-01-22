import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { InvoiceRecurrenceStatusChip } from '@/components/receivables/InvoiceRecurrenceStatusChip';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { ReceivableFilters } from '@/components/receivables/ReceivableFilters/ReceivableFilters';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/ReceivablesTable/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
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
import { DueDateCell } from '@/ui/DueDateCell';
import { TablePagination } from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Sync } from '@mui/icons-material';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid';

import { FinanceBanner } from '../Financing/FinanceBanner/FinanceBanner';
import { useReceivablesFilters } from '../ReceivableFilters/useReceivablesFilters';
import {
  useInvoiceRowActionMenuCell,
  type UseInvoiceRowActionMenuCellProps,
} from './useInvoiceRowActionMenuCell';

interface InvoicesTableBaseProps {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;

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
}

export type InvoicesTableProps =
  | InvoicesTableBaseProps
  | (UseInvoiceRowActionMenuCellProps & InvoicesTableBaseProps);

export interface ReceivableGridSortModel {
  field: components['schemas']['ReceivableCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

export const InvoicesTable = (props: InvoicesTableProps) => (
  <MoniteScopedProviders>
    <InvoicesTableBase {...props} />
  </MoniteScopedProviders>
);

const InvoicesTableBase = ({
  onRowClick,
  setIsCreateInvoiceDialogOpen,
  query,
  filters: filtersProp,
  ...restProps
}: InvoicesTableProps) => {
  const { locale, componentSettings } = useMoniteContext();
  const { i18n } = useLingui();

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );

  const [pageSize, setPageSize] = useState<number>(
    componentSettings.receivables.pageSizeOptions?.[0] ?? 15
  );

  const [sortModel, setSortModel] = useState<ReceivableGridSortModel>({
    field: query?.sort ?? 'created_at',
    sort: query?.order ?? 'desc',
  });

  const { formatCurrencyToDisplay } = useCurrencies();
  const { filtersQuery, filters, onChangeFilter } = useReceivablesFilters(
    (
      [
        'document_id__contains',
        'status',
        'counterpart_id',
        'due_date__lte',
      ] as const
    ).filter((filter) => filtersProp?.includes(filter) ?? true),
    query
  );

  const {
    data: invoices,
    isLoading,
    isError,
    refetch,
  } = useReceivables({
    ...filtersQuery,
    sort: sortModel?.field,
    order: sortModel?.sort,
    limit: pageSize,
    pagination_token: paginationToken,
    type: 'invoice',
  });

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as ReceivableGridSortModel);
    setPaginationToken(undefined);
  };

  const invoiceActionCell = useInvoiceRowActionMenuCell({
    rowActions: 'rowActions' in restProps ? restProps.rowActions : undefined,
    onRowActionClick:
      'onRowActionClick' in restProps ? restProps.onRowActionClick : undefined,
  });

  const areCounterpartsLoading = useAreCounterpartsLoading(invoices?.data);

  const columns = useMemo<
    GridColDef<components['schemas']['ReceivableResponse']>[]
  >(() => {
    return [
      {
        field: 'document_id',
        headerName: t(i18n)`Number`,
        sortable: false,
        width: 150,
        display: 'flex',
        renderCell: ({ value, row }) => (
          <Stack
            direction="column"
            alignItems="flex-start"
            gap={0.5}
            sx={{ maxWidth: '100%', '& > *': { maxWidth: '100%' } }}
          >
            <Box sx={{ display: 'flex' }}>
              {(() => {
                if (row.status === 'recurring') {
                  return (
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        verticalAlign: 'middle',
                        fontSize: 'inherit',
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ display: 'flex' }}
                        className=""
                      >
                        <>
                          <Sync
                            fontSize="small"
                            sx={{ marginRight: '4px' }}
                            color="inherit"
                          />
                          {t(i18n)`Recurring`}
                        </>
                      </Typography>
                    </Box>
                  );
                }

                if (!value) {
                  return (
                    <Box
                      color="text.secondary"
                      sx={{
                        alignItems: 'center',
                        display: 'inline-flex',
                        verticalAlign: 'middle',
                        fontSize: 'inherit',
                        marginRight: '4px',
                      }}
                    >
                      <Typography
                        variant="body1"
                        className="Monite-TextOverflowContainer"
                      >
                        {t(i18n)`INV-auto`}
                      </Typography>
                    </Box>
                  );
                }

                return value;
              })()}
              {row.type === 'invoice' && row.recurrence_id ? (
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                    verticalAlign: 'middle',
                    marginLeft: '4px',
                  }}
                >
                  <InvoiceRecurrenceStatusChipLoader
                    recurrenceId={row.recurrence_id}
                  />
                </Box>
              ) : (
                <></>
              )}
            </Box>
          </Stack>
        ),
      },
      {
        field: 'status',
        headerName: t(i18n)`Status`,
        sortable: false,
        display: 'flex',
        width: 40,
        renderCell: (params) => (
          <Box
            sx={{
              alignItems: 'center',
              display: 'inline-flex',
              verticalAlign: 'middle',
              marginLeft: '4px',
            }}
          >
            <InvoiceStatusChip status={params.value} size="small" />
          </Box>
        ),
      },
      {
        field: 'counterpart_name',
        headerName: t(i18n)`Customer`,
        sortable: ReceivableCursorFields.includes('counterpart_name'),
        display: 'flex',
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <CounterpartCellById counterpartId={params.row.counterpart_id} />
        ),
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        sortable: false,
        width: 140,
        valueFormatter: (value) =>
          value ? i18n.date(value, locale.dateFormat) : '—',
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Issue date`,
        sortable: false,
        width: 120,
        valueFormatter: (value) =>
          value ? i18n.date(value, locale.dateFormat) : '—',
      },
      {
        field: 'total_amount',
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
      {
        field: 'due_date',
        headerName: t(i18n)`Due date`,
        sortable: false,
        width: 120,
        valueFormatter: (value) =>
          value ? i18n.date(value, locale.dateFormat) : '—',
        renderCell: (params) => <DueDateCell data={params.row} />,
      },
      ...(invoiceActionCell ? [invoiceActionCell] : []),
    ];
  }, [formatCurrencyToDisplay, i18n, invoiceActionCell, locale.dateFormat]);

  const gridApiRef = useAutosizeGridColumns(
    invoices?.data,
    columns,
    areCounterpartsLoading,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'InvoicesTable'
  );

  const isFiltering = Object.keys(filters).some(
    (key) =>
      filters[key as keyof typeof filters] !== null &&
      filters[key as keyof typeof filters] !== undefined
  );

  const isSearching =
    !!filters['document_id__contains' as keyof typeof filters];

  if (
    !isLoading &&
    invoices?.data.length === 0 &&
    !isFiltering &&
    !isSearching
  ) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No Receivables`}
        descriptionLine1={t(i18n)`You don’t have any invoices yet.`}
        descriptionLine2={t(i18n)`You can create your first invoice.`}
        actionButtonLabel={t(i18n)`Create Invoice`}
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

  const className = 'Monite-InvoicesTable';

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
      <Box>
        <FinanceBanner />
      </Box>

      <ReceivableFilters
        filters={filters}
        onChange={(field, value) => {
          setPaginationToken(undefined);
          onChangeFilter(field, value);
        }}
      />

      <DataGrid
        initialState={{
          sorting: {
            sortModel: sortModel && [sortModel],
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
              nextPage={invoices?.next_pagination_token}
              prevPage={invoices?.prev_pagination_token}
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
              dataLength={invoices?.data.length || 0}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              onCreate={() => setIsCreateInvoiceDialogOpen?.(true)}
              refetch={refetch}
              entityName={t(i18n)`Invoices`}
              actionButtonLabel={t(i18n)`Create Invoice`}
              actionOptions={[t(i18n)`Invoice`]}
              type="no-data"
            />
          ),
        }}
        columns={columns}
        rows={invoices?.data ?? []}
      />
    </Box>
  );
};

const InvoiceRecurrenceStatusChipLoader = ({
  recurrenceId,
}: {
  recurrenceId: string;
}) => {
  const { api } = useMoniteContext();

  const { data: recurrence, isLoading } =
    api.recurrences.getRecurrencesId.useQuery({
      path: { recurrence_id: recurrenceId },
    });

  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        width="100%"
        sx={{ display: 'inline-block' }}
      />
    );
  }

  if (!recurrence?.status) return null;

  return (
    <InvoiceRecurrenceStatusChip status={recurrence.status} size="small" />
  );
};
