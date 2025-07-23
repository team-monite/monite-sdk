import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { FinanceBanner } from '@/components/financing/components/FinanceBanner';
import {
  useFinanceAnInvoice,
  useGetFinancedInvoices,
  useGetFinanceOffers,
} from '@/components/financing/hooks';
import { InvoiceRecurrenceStatusChip } from '@/components/receivables/components/InvoiceRecurrenceStatusChip';
import { InvoiceStatusChip } from '@/components/receivables/components/InvoiceStatusChip';
import { ReceivableFilters } from '@/components/receivables/components/ReceivableFilters';
import { useReceivablesFilters } from '@/components/receivables/hooks';
import {
  useInvoiceRowActionMenuCell,
  type UseInvoiceRowActionMenuCellProps,
} from '@/components/receivables/hooks';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/types';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAreCounterpartsLoading,
  useAutosizeGridColumns,
} from '@/core/hooks/useAutosizeGridColumns';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useMyEntity } from '@/core/queries';
import { useReceivables } from '@/core/queries/useReceivables';
import { ReceivableCursorFields } from '@/enums/ReceivableCursorFields';
import { CounterpartNameCellById } from '@/ui/CounterpartCell';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { DueDateCell } from '@/ui/DueDateCell';
import { TablePagination } from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Sync } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';

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
  const { startFinanceSession } = useKanmonContext();
  const { data: financeData } = useGetFinanceOffers();
  const { data: financedInvoices } = useGetFinancedInvoices({});
  const { isUSEntity } = useMyEntity();
  const { i18n } = useLingui();
  const isServicing =
    financeData?.business_status === 'ONBOARDED' &&
    financeData?.offers?.[0]?.status === 'CURRENT';

  const [paginationToken, setPaginationToken] = useState<string | undefined>(
    undefined
  );
  const [isFinancingAnInvoice, setIsFinancingAnInvoice] = useState(false);

  const [pageSize, setPageSize] = useState<number>(
    componentSettings.receivables.pageSizeOptions?.[0] ?? 15
  );

  const [sortModel, setSortModel] = useState<ReceivableGridSortModel>({
    field: query?.sort ?? 'created_at',
    sort: query?.order ?? 'desc',
  });

  const financeInvoiceMutation = useFinanceAnInvoice();
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

  const financeInvoice = useCallback(
    async (invoiceId: string) => {
      if (isFinancingAnInvoice) return;

      try {
        setIsFinancingAnInvoice(true);
        financeInvoiceMutation.mutate(
          {
            invoices: [
              {
                id: invoiceId,
                type: 'receivable',
              },
            ],
          },
          {
            onError: () => {
              setIsFinancingAnInvoice(false);
            },
            onSuccess: ({ session_token }) => {
              startFinanceSession({
                sessionToken: session_token,
                component: 'SESSION_INVOICE_FLOW_WITH_INVOICE_FILE',
              });
              setIsFinancingAnInvoice(false);
            },
          }
        );
      } catch {
        setIsFinancingAnInvoice(false);
      }
    },
    [financeInvoiceMutation, isFinancingAnInvoice, startFinanceSession]
  );

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
        cellClassName: 'Monite-Cell-Highlight',
        width: 150,
        display: 'flex',
        renderCell: ({ value, row }) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0.5,
              maxWidth: '100%',
            }}
          >
            <div style={{ display: 'flex', maxWidth: '100%' }}>
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
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: 'inherit',
                          fontWeight: 'inherit',
                        }}
                      >
                        <>
                          <Sync
                            sx={{ marginRight: 0.5, fontSize: 'inherit' }}
                            color="inherit"
                          />
                          {t(i18n)`Recurring`}
                        </>
                      </Typography>
                    </Box>
                  );
                }

                if (!value) {
                  return t(i18n)`INV-auto`;
                }

                return value;
              })()}
              {row.type === 'invoice' && row.recurrence_id && (
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
              )}
            </div>
          </div>
        ),
      },
      {
        field: 'status',
        headerName: t(i18n)`Status`,
        sortable: false,
        display: 'flex',
        width: 100,
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
          <CounterpartNameCellById counterpartId={params.row.counterpart_id} />
        ),
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created on`,
        sortable: false,
        width: 140,
        renderCell: (params) => {
          if (!params.value) {
            return <span style={{ opacity: 0.4 }}>-</span>;
          }
          return i18n.date(params.value, locale.dateFormat);
        },
      },
      {
        field: 'issue_date',
        headerName: t(i18n)`Issue date`,
        sortable: false,
        width: 120,
        renderCell: (params) => {
          if (!params.value) {
            return <span style={{ opacity: 0.4 }}>-</span>;
          }
          return i18n.date(params.value, locale.dateFormat);
        },
      },
      {
        field: 'total_amount',
        headerName: t(i18n)`Amount`,
        headerAlign: 'right',
        align: 'right',
        className: 'Monite-Cell-Highlight',
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
      ...(isUSEntity
        ? [
            {
              field: '',
              headerName: t(i18n)`Financing`,
              sortable: false,
              width: 120,
              renderCell: (
                params: GridRenderCellParams<
                  components['schemas']['ReceivableResponse']
                >
              ) => {
                // This is a workaround until we have the invoice status being returned in the invoice endpoint
                const isAlreadyFinanced = financedInvoices?.data?.find(
                  (invoice) => invoice.invoice_id === params.row.id
                );
                const shouldDisplayButton =
                  (params.row.status === 'partially_paid' ||
                    params.row.status === 'issued') &&
                  isServicing &&
                  !isAlreadyFinanced;

                return shouldDisplayButton ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      financeInvoice?.(params.row.id);
                    }}
                    sx={{ py: 1.25, px: 1.5, height: 32, fontSize: 14 }}
                  >
                    {isFinancingAnInvoice ? (
                      <CircularProgress size={14} />
                    ) : (
                      t(i18n)`Get paid`
                    )}
                  </Button>
                ) : null;
              },
            },
          ]
        : []),
      ...(invoiceActionCell ? [invoiceActionCell] : []),
    ];
  }, [
    formatCurrencyToDisplay,
    i18n,
    invoiceActionCell,
    locale.dateFormat,
    isUSEntity,
    financeInvoice,
    isFinancingAnInvoice,
    isServicing,
    financedInvoices,
  ]);

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
        gap: 2,
        px: 1.5,
      }}
    >
      <ReceivableFilters
        filters={filters}
        onChange={(field, value) => {
          setPaginationToken(undefined);
          onChangeFilter(field, value);
        }}
      />

      <FinanceBanner />

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
