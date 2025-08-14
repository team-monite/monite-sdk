import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MoniteCustomFilters } from '@/components/payables/PayablesTable/Filters/MoniteCustomFilters';
import { SummaryCardsFilters } from '@/components/payables/PayablesTable/Filters/SummaryCardsFilters';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  defaultCounterpartColumnWidth,
  useAreCounterpartsLoading,
  useAutosizeGridColumns,
} from '@/core/hooks/useAutosizeGridColumns';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useEntityUserByAuthToken } from '@/core/queries';
import { usePayablePaymentIntentsAndRecords } from '@/core/queries/usePaymentRecords';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { AccessRestriction } from '@/ui/accessRestriction';
import { CounterpartNameCellById } from '@/ui/CounterpartCell';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { DueDateCell } from '@/ui/DueDateCell';
import { LoadingPage } from '@/ui/loadingPage';
import { TablePagination } from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, CircularProgress } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid';

import { formatISO } from 'date-fns';

import { isPayableInOCRProcessing } from '../utils/isPayableInOcr';
import { PayablesTableAction } from './components/PayablesTableAction';
import {
  DEFAULT_FIELD_ORDER,
  FILTER_TYPE_SUMMARY_CARD,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from './consts';
import { Filters as FiltersComponent } from './Filters';
import { FilterTypes, FilterValue, MonitePayableTableProps } from './types';

interface PayablesTableProps extends MonitePayableTableProps {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;
  /**
   * The event handler for the pay action
   *
   * @param id - The identifier of the row to perform the pay action on, a string.
   */
  onPay?: (id: string) => void;
  /**
   * The event handler for the pay action in US
   *
   * @param id - The identifier of the row to perform the pay action on, a string.
   */
  onPayUS?: (id: string) => void;
  /**
   * Triggered when the filtering options are changed
   *
   * @param filter - An object containing the filter parameters.
   * @param filter.field - The field to filter by, specified as a keyof FilterTypes.
   * @param filter.value - The value to be applied to the filter, of type FilterValue.
   */
  onChangeFilter?: (filter: {
    field: keyof FilterTypes;
    value: FilterValue;
  }) => void;
  /**
   * Triggered when the sorting options are changed
   *
   * @param params - An object containing the sorting parameters.
   * @param params.sort - The field to sort by, in this case 'created_at'.
   * @param params.order - The sort order can be either SortOrderEnum values or null.
   */
  onChangeSort?: (params: {
    sort: 'created_at';
    order: 'asc' | 'desc' | null;
  }) => void;

  /**
   * The event handler for the file input when no data is present.
   * This triggers the file upload process when the user selects a file.
   */
  openFileInput?: () => void;

  /**
   * The event handler for opening the "New Invoice" dialog when no data is present.
   * This function controls the visibility of the dialog for invoice creation.
   *
   * @param {boolean} isOpen - A boolean value indicating whether the dialog should be open (true) or closed (false).
   */
  setIsCreateInvoiceDialogOpen?: (isOpen: boolean) => void;
}

export interface PayableGridSortModel {
  field: components['schemas']['PayableCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

/**
 * PayablesTable component.
 * @component
 * @example Monite Provider customisation
 * ```ts
 * // You can configure the component through Monite Provider property `componentSettings` like this:
 * const componentSettings = {
 *   payables: {
 *     fieldOrder: ['document_id', 'counterpart_id', 'created_at', 'issued_at', 'due_date', 'status', 'amount', 'pay'],
 *     summaryCardFilters: {
 *       'Overdue Invoices': {
 *         status__in: ['waiting_to_be_paid'],
 *         overdue: true,
 *       },
 *       'High-Value Invoices': {
 *         amount__gte: 10000,
 *       },
 *     },
 *   },
 * };
 * ```
 */
export const PayablesTable = (props: PayablesTableProps) => (
  <MoniteScopedProviders>
    <PayablesTableBase {...props} />
  </MoniteScopedProviders>
);

const PayablesTableBase = ({
  onRowClick,
  onPay,
  onPayUS,
  onChangeFilter: onChangeFilterCallback,
  openFileInput,
  setIsCreateInvoiceDialogOpen,
  ...inProps
}: PayablesTableProps) => {
  const { i18n } = useLingui();
  const { api, locale, queryClient, componentSettings } = useMoniteContext();

  const {
    isShowingSummaryCards,
    fieldOrder,
    requiredColumns,
    summaryCardFilters,
  } = usePayableTableThemeProps(inProps);

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    componentSettings.payables.pageSizeOptions?.[0] ?? 15
  );
  const [sortModel, setSortModel] = useState<PayableGridSortModel>({
    field: 'created_at',
    sort: 'desc',
  });
  const [currentFilter, setCurrentFilter] = useState<FilterTypes>({});

  const { formatCurrencyToDisplay } = useCurrencies();

  const { data: user } = useEntityUserByAuthToken();

  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: 'read',
      entityUserId: user?.id,
    });

  const payablesQueryParameters = api.payables.getPayables.getQueryKey({
    query: {
      sort: sortModel?.field,
      order: sortModel?.sort,
      limit: pageSize,
      pagination_token: currentPaginationToken || undefined,
      status: currentFilter[FILTER_TYPE_STATUS] || undefined,
      due_date: currentFilter[FILTER_TYPE_DUE_DATE]
        ? formatISO(currentFilter[FILTER_TYPE_DUE_DATE] as Date, {
            representation: 'date',
          })
        : undefined,
      search_text: currentFilter[FILTER_TYPE_SEARCH] || undefined,
      ...(typeof currentFilter[FILTER_TYPE_SUMMARY_CARD] === 'string'
        ? summaryCardFilters?.[currentFilter[FILTER_TYPE_SUMMARY_CARD]] || {}
        : {}),
    },
  });

  const {
    data: payables,
    isLoading,
    isError,
    error,
    refetch,
  } = api.payables.getPayables.useQuery(payablesQueryParameters, {
    refetchInterval: api.payables.getPayables
      .getQueryData(payablesQueryParameters, queryClient)
      ?.data.filter(isPayableInOCRProcessing).length
      ? 2_000
      : undefined,
  });

  // Get IDs of payables in status [waiting_to_be_paid, partially_paid]
  const payableIdsInWaitingToBePaidOrPartiallyPaid = useMemo(() => {
    return payables?.data
      ?.filter(
        (payable) =>
          payable.status === 'waiting_to_be_paid' ||
          payable.status === 'partially_paid'
      )
      .map((payable) => payable.id);
  }, [payables?.data]);
  // Fetch payment records for payables in status [waiting_to_be_paid, partially_paid]
  const {
    payablesPaymentIntentsRecord,
    isLoading: isPaymentRecordsLoading,
    refetch: refetchPaymentRecords,
  } = usePayablePaymentIntentsAndRecords(
    payableIdsInWaitingToBePaidOrPartiallyPaid || []
  );

  //TODO: Remove this error handling and replace with proper error handling
  useEffect(() => {
    if (isError) {
      toast.error(getAPIErrorMessage(i18n, error));
    }
  }, [isError, error, i18n]);

  const areCounterpartsLoading = useAreCounterpartsLoading(payables?.data);

  const calculatedFieldOrder = useMemo<string[]>(() => {
    if (fieldOrder && Array.isArray(fieldOrder)) {
      return fieldOrder as string[];
    }
    return DEFAULT_FIELD_ORDER;
  }, [fieldOrder]);

  const columnsConfig = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'document_id',
        sortable: false,
        hideable: !requiredColumns?.includes('document_id'),
        headerName: t(i18n)`Number`,
        width: 140,
        display: 'flex',
        cellClassName: 'Monite-Cell-Highlight',
        colSpan: (_, row) => (isPayableInOCRProcessing(row) ? 5 : 1),
        renderCell: (params) => {
          const payable = params.row;

          if (isPayableInOCRProcessing(payable)) {
            return (
              <>
                <CircularProgress size={22} sx={{ mr: 1 }} />
                <Box sx={{ ml: 1 }}>
                  {t(i18n)`Processing file`} '{payable.file?.name}'
                </Box>
              </>
            );
          }

          return (
            <span className="Monite-TextOverflowContainer">
              {payable.document_id}
            </span>
          );
        },
      },
      {
        field: 'counterpart_id',
        sortable: false,
        hideable: !requiredColumns?.includes('counterpart_id'),
        headerName: t(i18n)`Vendor`,
        display: 'flex',
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <CounterpartNameCellById counterpartId={params.value} />
        ),
      },
      {
        field: 'created_at',
        type: 'date',
        hideable: !requiredColumns?.includes('created_at'),
        headerName: t(i18n)`Added on`,
        width: 120,
        display: 'flex',
        renderCell: ({ formattedValue }) => formattedValue,
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['created_at']
        ) => i18n.date(value, locale.dateFormat),
      },
      {
        field: 'issued_at',
        type: 'date',
        hideable: !requiredColumns?.includes('issued_at'),
        headerName: t(i18n)`Issued on`,
        width: 120,
        display: 'flex',
        renderCell: ({ formattedValue }) => formattedValue,
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['issued_at']
        ) => value ? i18n.date(value, locale.dateFormat) : '',
      },
      {
        field: 'due_date',
        sortable: false,
        hideable: !requiredColumns?.includes('due_date'),
        type: 'date',
        headerName: t(i18n)({
          id: 'Due date Name',
          message: 'Due date',
          comment: 'Payables Table "Due date" heading title',
        }),
        width: 120,
        renderCell: (params) => <DueDateCell data={params.row} />,
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['due_date']
        ) => value && i18n.date(value, locale.dateFormat),
      },
      {
        field: 'status',
        sortable: false,
        hideable: !requiredColumns?.includes('status'),
        headerName: t(i18n)`Status`,
        display: 'flex',
        width: 100,
        renderCell: (params) => (
          <PayableStatusChip status={params.value} size="small" />
        ),
      },
      {
        field: 'amount',
        sortable: false,
        hideable: !requiredColumns?.includes('amount'),
        headerAlign: 'right',
        align: 'right',
        headerName: t(i18n)({
          id: 'Total',
          message: 'Total',
          comment: 'Payables Table "Total" heading title',
        }),
        width: 120,
        valueGetter: (
          _,
          payable: components['schemas']['PayableResponseSchema']
        ) => {
          return payable.total_amount && payable.currency
            ? formatCurrencyToDisplay(payable.total_amount, payable.currency)
            : null;
        },
        renderCell: (params) => {
          if (!params.value) {
            return <span className="mtw:opacity-40">-</span>;
          }
          return params.value;
        },
      },
      {
        field: 'amount_to_pay',
        sortable: false,
        hideable: !requiredColumns?.includes('amount_to_pay'),
        headerAlign: 'right',
        align: 'right',
        headerName: t(i18n)({
          id: 'Due',
          message: 'Due',
          comment: 'Payables Table "Due" heading title',
        }),
        width: 120,
        valueGetter: (
          _,
          payable: components['schemas']['PayableResponseSchema']
        ) => {
          // If the payable is paid, just return null.
          if (payable.status === 'paid') {
            return null;
          }

          // The truthiness check filters out zero values, returning null so the cell renders "0.00" with reduced opacity
          return payable.amount_to_pay && payable.currency
            ? payable.amount_to_pay
            : null;
        },
        renderCell: (params) => {
          const statusShowPaymentValues = [
            'waiting_to_be_paid',
            'partially_paid',
            'paid',
          ].includes(params.row.status);

          if (statusShowPaymentValues) {
            return params.value ? (
              formatCurrencyToDisplay(params.value, params.row.currency)
            ) : (
              <span className="mtw:opacity-40">0.00</span>
            );
          }

          return <span className="mtw:opacity-40">-</span>;
        },
      },
      {
        field: 'amount_paid',
        sortable: false,
        hideable: !requiredColumns?.includes('amount_paid'),
        headerAlign: 'right',
        align: 'right',
        headerName: t(i18n)({
          id: 'Paid',
          message: 'Paid',
          comment: 'Payables Table "Paid" heading title',
        }),
        width: 120,
        valueGetter: (
          _,
          payable: components['schemas']['PayableResponseSchema']
        ) => {
          // If the payable is paid, just return the total amount.
          if (payable.status === 'paid') {
            return payable.total_amount && payable.currency
              ? payable.total_amount
              : null;
          }

          // The truthiness check filters out zero values, returning null so the cell renders "0.00" with reduced opacity
          return payable.amount_paid && payable.currency
            ? payable.amount_paid
            : null;
        },
        renderCell: (params) => {
          const statusShowPaymentValues = [
            'waiting_to_be_paid',
            'partially_paid',
            'paid',
          ].includes(params.row.status);

          if (statusShowPaymentValues) {
            return params.value ? (
              formatCurrencyToDisplay(params.value, params.row.currency)
            ) : (
              <span className="mtw:opacity-40">0.00</span>
            );
          }

          return <span className="mtw:opacity-40">-</span>;
        },
      },
      // {
      //   field: 'was_created_by_user_id',
      //   sortable: false,
      //   headerName: t(i18n)`Added by`,
      //   display: 'flex',
      //   width: 240,
      //   minWidth: 200,
      //   renderCell: (params) => (
      //     <UserCell userId={params.row.was_created_by_user_id} />
      //   ),
      // },
      {
        field: 'pay',
        headerName: t(i18n)`Payment`,
        sortable: false,
        hideable: !requiredColumns?.includes('pay'),
        width: 200,
        minWidth: 150,
        maxWidth: 450,
        renderCell: (params) => {
          const payable = params.row;

          const statusShowPaymentActions = [
            'waiting_to_be_paid',
            'partially_paid',
          ].includes(payable.status);

          if (!statusShowPaymentActions) {
            return null;
          }

          if (isPaymentRecordsLoading) {
            return <CircularProgress size={22} sx={{ mr: 1 }} />;
          }

          return (
            <PayablesTableAction
              payable={payable}
              payableRecentPaymentRecordByIntent={
                payablesPaymentIntentsRecord?.[payable.id] || []
              }
              refetchPaymentRecords={refetchPaymentRecords}
              onPayableActionComplete={() => {
                refetch();
              }}
              onPay={onPay}
              onPayUS={onPayUS}
            />
          );
        },
      },
    ];
  }, [
    requiredColumns,
    i18n,
    locale.dateFormat,
    formatCurrencyToDisplay,
    isPaymentRecordsLoading,
    payablesPaymentIntentsRecord,
    refetchPaymentRecords,
    onPay,
    onPayUS,
    refetch,
  ]);

  const columns = useMemo<GridColDef[]>(() => {
    return columnsConfig.sort((a, b) => {
      const aIndex = calculatedFieldOrder.indexOf(a.field);
      const bIndex = calculatedFieldOrder.indexOf(b.field);

      if (aIndex === -1 || bIndex === -1) return 0;

      return aIndex - bIndex;
    });
  }, [columnsConfig, calculatedFieldOrder]);

  const gridApiRef = useAutosizeGridColumns(
    payables?.data,
    columns,
    areCounterpartsLoading,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'PayablesTable'
  );

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentPaginationToken(null);
    if (field === FILTER_TYPE_SUMMARY_CARD && value) {
      setCurrentFilter((prevFilter) => ({
        ...prevFilter,
        [FILTER_TYPE_SUMMARY_CARD]: value as keyof typeof summaryCardFilters,
      }));
    } else {
      setCurrentFilter((prevFilter) => ({
        ...prevFilter,
        [field]: value === 'all' ? null : value,
      }));
    }

    onChangeFilterCallback?.({ field, value });
  };

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as PayableGridSortModel);
    setCurrentPaginationToken(null);
  };

  if (isReadSupportedLoading) {
    return <LoadingPage />;
  }

  /** We have to wait until `usePayablesList` and `useIsActionAllowed` is finished */
  if (!isReadSupported) {
    return <AccessRestriction />;
  }

  const isFiltering = Object.keys(currentFilter).some(
    (key) =>
      currentFilter[key as keyof FilterTypes] !== null &&
      currentFilter[key as keyof FilterTypes] !== undefined
  );
  const isSearching = !!currentFilter[FILTER_TYPE_SEARCH];

  const className = 'Monite-PayablesTable';
  return (
    <Box
      className={classNames(ScopedCssBaselineContainerClassName, className)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        minHeight: '500px',
      }}
    >
      {isShowingSummaryCards && !summaryCardFilters && (
        <SummaryCardsFilters
          onChangeFilter={onChangeFilter}
          selectedStatus={currentFilter[FILTER_TYPE_STATUS] || 'all'}
          sx={{ mb: 2 }}
        />
      )}
      {summaryCardFilters && Object.keys(summaryCardFilters).length > 0 && (
        <MoniteCustomFilters
          summaryCardFiltersData={summaryCardFilters}
          onChangeFilter={onChangeFilter}
          selectedFilter={
            typeof currentFilter[FILTER_TYPE_SUMMARY_CARD] === 'string'
              ? currentFilter[FILTER_TYPE_SUMMARY_CARD]
              : 'all'
          }
          sx={{ mb: 2 }}
        />
      )}
      <FiltersComponent onChangeFilter={onChangeFilter} />
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
          const payable =
            params.row as components['schemas']['PayableResponseSchema'];

          if (!hasSelectedText() && payable.ocr_status !== 'processing') {
            onRowClick?.(payable.id);
          }
        }}
        sx={{
          '& .MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
          '&.MuiDataGrid-withBorderColor': {
            borderColor: 'divider',
          },
          '& .MuiDataGrid-row.ocr-processing': {
            pointerEvents: 'none',
            backgroundColor: 'inherit',
          },
        }}
        getRowClassName={(params) =>
          isPayableInOCRProcessing(params.row) ? 'ocr-processing' : ''
        }
        slots={{
          pagination: () => (
            <TablePagination
              pageSizeOptions={componentSettings.payables.pageSizeOptions}
              nextPage={payables?.next_pagination_token}
              prevPage={payables?.prev_pagination_token}
              paginationModel={{
                pageSize,
                page: currentPaginationToken,
              }}
              onPaginationModelChange={({ page, pageSize }) => {
                setPageSize(pageSize);
                setCurrentPaginationToken(page);
              }}
            />
          ),
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              noDataTitle={t(i18n)`No bills yet`}
              noDataDescription1={t(i18n)`You don’t have any bills yet`}
              noDataDescription2={t(i18n)`Add your first bill`}
              filterTitle={t(i18n)`No bills found`}
              isLoading={isLoading}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              dataLength={payables?.data.length || 0}
              onCreate={(type) => {
                if (type === 'New Invoice') {
                  setIsCreateInvoiceDialogOpen?.(true);
                } else if (type === 'Upload File') {
                  openFileInput?.();
                }
              }}
              refetch={refetch}
              entityName={t(i18n)`Payable`}
              type="no-data=payables"
            />
          ),
        }}
        columns={columns}
        rows={payables?.data || []}
      />
    </Box>
  );
};

const usePayableTableThemeProps = (
  inProps: Partial<MonitePayableTableProps>
): MonitePayableTableProps => {
  const { componentSettings } = useMoniteContext();

  return {
    isShowingSummaryCards:
      inProps?.isShowingSummaryCards ??
      componentSettings?.payables?.isShowingSummaryCards,
    fieldOrder: inProps?.fieldOrder ?? componentSettings?.payables?.fieldOrder,
    summaryCardFilters:
      inProps?.summaryCardFilters ??
      componentSettings?.payables?.summaryCardFilters,
    requiredColumns:
      inProps?.requiredColumns ?? componentSettings?.payables?.requiredColumns,
  };
};
