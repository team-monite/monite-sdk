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
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { AccessRestriction } from '@/ui/accessRestriction';
import { CounterpartCellById } from '@/ui/CounterpartCell';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { DueDateCell } from '@/ui/DueDateCell';
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { UserCell } from '@/ui/UserCell';
import { classNames } from '@/utils/css-utils';
import { useDateFormat } from '@/utils/MoniteOptions';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useThemeProps } from '@mui/material/styles';
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
 * @example MUI theming
 * const theme = createTheme({
 *   components: {
 *     MonitePayablesTable: {
 *       defaultProps: {
 *         fieldOrder: ['document_id', 'counterpart_id', 'created_at', 'issued_at', 'due_date', 'status', 'amount', 'pay'],
 *         summaryCardFilters: {
 *           'Overdue Invoices': {
 *             status__in: ['waiting_to_be_paid'],
 *             overdue: true,
 *           },
 *           'High-Value Invoices': {
 *             amount__gte: 10000,
 *           },
 *         },
 *       },
 *     },
 *   },
 * });
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
  const { api, queryClient } = useMoniteContext();

  const { isShowingSummaryCards, fieldOrder, summaryCardFilters } =
    usePayableTableThemeProps(inProps);

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
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

  //TODO: Remove this error handling and replace with proper error handling
  useEffect(() => {
    if (isError) {
      toast.error(getAPIErrorMessage(i18n, error));
    }
  }, [isError, error, i18n]);

  const areCounterpartsLoading = useAreCounterpartsLoading(payables?.data);
  const dateFormat = useDateFormat();

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
        headerName: t(i18n)`Number`,
        width: 100,
        display: 'flex',
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
                {payable.document_id}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: 'status',
        sortable: false,
        headerName: t(i18n)`Status`,
        display: 'flex',
        width: 80,
        renderCell: (params) => (
          <PayableStatusChip status={params.value} size="small" />
        ),
      },
      {
        field: 'counterpart_id',
        sortable: false,
        headerName: t(i18n)`Vendor`,
        display: 'flex',
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <CounterpartCellById counterpartId={params.value} />
        ),
      },
      {
        field: 'amount',
        sortable: false,
        headerAlign: 'right',
        align: 'right',
        headerName: t(i18n)({
          id: 'Total',
          message: 'Total',
          comment: 'Payables Table "Total" heading title',
        }),
        width: 120,
        valueGetter: (_, payable) => {
          const amount =
            payable.status === 'paid'
              ? payable.total_amount
              : payable.amount_to_pay;

          return amount && payable.currency
            ? formatCurrencyToDisplay(amount, payable.currency)
            : '';
        },
      },
      {
        field: 'created_at',
        type: 'date',
        headerName: t(i18n)`Invoice date`,
        width: 140,
        display: 'flex',
        renderCell: ({ formattedValue }) => formattedValue,
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['created_at']
        ) => i18n.date(value, dateFormat),
      },
      {
        field: 'due_date',
        sortable: false,
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
        ) => value && i18n.date(value, dateFormat),
      },
      {
        field: 'was_created_by_user_id',
        sortable: false,
        headerName: t(i18n)`Added by`,
        display: 'flex',
        width: 240,
        minWidth: 200,
        renderCell: (params) => (
          <UserCell userId={params.row.was_created_by_user_id} />
        ),
      },
      {
        field: 'pay',
        headerName: t(i18n)`Actions`,
        sortable: false,
        display: 'flex',
        minWidth: 80,
        width: 80,
        renderCell: (params) => {
          const payable = params.row;

          return (
            <PayablesTableAction
              payable={payable}
              onPay={onPay}
              onPayUS={onPayUS}
            />
          );
        },
      },
    ];
  }, [dateFormat, formatCurrencyToDisplay, i18n, onPay, onPayUS]);

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
        pt: 2,
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
          if (!hasSelectedText()) {
            onRowClick?.(params.row.id);
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
              filterDescription1={t(
                i18n
              )`Try adjusting your search or filter criteria`}
              filterDescription2={' '}
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
): MonitePayableTableProps =>
  useThemeProps({
    props: inProps,
    name: 'MonitePayableTable',
  });
