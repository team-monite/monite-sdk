import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip';
import { StyledChip } from '@/components/payables/PayableStatusChip/PayableStatusChip';
import { isInvoiceOverdue } from '@/components/payables/utils/isInvoiceOverdue';
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
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { useDateFormat } from '@/utils/MoniteOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import { Box, CircularProgress, Stack } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid';

import { addDays, formatISO } from 'date-fns';

import { isPayableInOCRProcessing } from '../utils/isPayableInOcr';
import { PayablesTableAction } from './components/PayablesTableAction';
import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_OVERDUE,
} from './consts';
import { Filters as FiltersComponent } from './Filters';
import { FilterTypes, FilterValue } from './types';

interface PayablesTableProps {
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

export const PayablesTable = (props: PayablesTableProps) => (
  <MoniteScopedProviders>
    <PayablesTableBase {...props} />
  </MoniteScopedProviders>
);

const PayablesTableBase = ({
  onRowClick,
  onPay,
  onChangeFilter: onChangeFilterCallback,
  openFileInput,
  setIsCreateInvoiceDialogOpen,
}: PayablesTableProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

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
      // HACK: api filter parameter 'created_at' requires full match with seconds. Could not be used
      created_at__lt: currentFilter[FILTER_TYPE_CREATED_AT]
        ? formatISO(addDays(currentFilter[FILTER_TYPE_CREATED_AT] as Date, 1))
        : undefined,
      created_at__gte: currentFilter[FILTER_TYPE_CREATED_AT]
        ? formatISO(currentFilter[FILTER_TYPE_CREATED_AT] as Date)
        : undefined,
      status: currentFilter[FILTER_TYPE_STATUS] || undefined,
      due_date: currentFilter[FILTER_TYPE_DUE_DATE]
        ? formatISO(currentFilter[FILTER_TYPE_DUE_DATE] as Date, {
            representation: 'date',
          })
        : undefined,
      document_id__icontains: currentFilter[FILTER_TYPE_SEARCH] || undefined,
      is_overdue: currentFilter[FILTER_TYPE_OVERDUE]
        ? currentFilter[FILTER_TYPE_OVERDUE]
        : undefined,
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

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'document_id',
        sortable: false,
        headerName: t(i18n)`Invoice #`,
        width: 100,
        display: 'flex',
        colSpan: (_, row) => (isPayableInOCRProcessing(row) ? 2 : 1),
        renderCell: (params) => {
          const payable = params.row;

          if (isPayableInOCRProcessing(payable)) {
            return (
              <>
                <FindInPageOutlinedIcon fontSize="small" />
                {payable.file?.name}
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
        headerName: t(i18n)`Counterpart`,
        display: 'flex',
        width: defaultCounterpartColumnWidth,
        renderCell: (params) => (
          <CounterpartCellById counterpartId={params.value} />
        ),
      },
      {
        field: 'created_at',
        type: 'date',
        headerName: t(i18n)`Invoice date`,
        width: 140,
        display: 'flex',
        colSpan: (_, row) => (isPayableInOCRProcessing(row) ? 3 : 1),
        renderCell: ({ row, formattedValue }) => {
          if (isPayableInOCRProcessing(row)) {
            return (
              <Stack direction="row">
                <CircularProgress size={22} sx={{ mr: 1 }} />
                {t(i18n)`Processing file…`}
              </Stack>
            );
          }

          return formattedValue;
        },
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['created_at']
        ) => i18n.date(value, dateFormat),
      },
      {
        field: 'issued_at',
        sortable: false,
        type: 'date',
        headerName: t(i18n)({
          id: 'Issue date Name',
          message: 'Issue date',
          comment: 'Payables Table "Issue date" heading title',
        }),
        width: 120,
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['issued_at']
        ) => value && i18n.date(value, dateFormat),
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
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['due_date']
        ) => value && i18n.date(value, dateFormat),
      },
      {
        field: 'status',
        sortable: false,
        headerName: t(i18n)({
          id: 'Status Name',
          message: 'Status',
          comment: 'Payables Table "Status" heading title',
        }),
        display: 'flex',
        width: 160,
        renderCell: (params) => {
          const payable = params.row;
          const isOverdue = isInvoiceOverdue(payable);

          return (
            <Box display="flex" alignItems="center" gap={1}>
              <PayableStatusChip status={params.value} />
              {isOverdue && (
                <StyledChip
                  // TODO: Consider refactoring to a custom component to allow better theming and control over styles (e.g., PayableStatusChip). This temporary solution adds specificity for the "Overdue" chip.
                  className="Monite-PayableStatusChip Monite-PayableStatusChip-Overdue"
                  status={params.value}
                  color="error"
                  label={t(i18n)`Overdue`}
                  size={'small'}
                />
              )}
            </Box>
          );
        },
      },
      {
        field: 'amount',
        sortable: false,
        headerName: t(i18n)({
          id: 'Amount Name',
          message: 'Amount',
          comment: 'Payables Table "Amount" heading title',
        }),
        width: 120,
        valueGetter: (_, payable) => {
          return payable.amount_to_pay && payable.currency
            ? formatCurrencyToDisplay(payable.amount_to_pay, payable.currency)
            : '';
        },
      },
      {
        field: 'pay',
        headerName: '',
        sortable: false,
        display: 'flex',
        minWidth: 80,
        width: 80,
        renderCell: (params) => {
          const payable = params.row;

          return <PayablesTableAction payable={payable} onPay={onPay} />;
        },
      },
    ];
  }, [dateFormat, formatCurrencyToDisplay, i18n, onPay]);

  const gridApiRef = useAutosizeGridColumns(
    payables?.data,
    columns,
    areCounterpartsLoading,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'PayablesTable'
  );

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

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
        pt: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <FiltersComponent onChangeFilter={onChangeFilter} />
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
        onRowClick={(params) => {
          onRowClick?.(params.row.id);
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
              isLoading={isLoading}
              dataLength={payables?.data.length || 0}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              onCreate={(type) => {
                if (type === 'New Invoice') {
                  setIsCreateInvoiceDialogOpen?.(true);
                } else if (type === 'Upload File') {
                  openFileInput?.();
                }
              }}
              refetch={refetch}
              entityName={t(i18n)`Payable`}
              actionButtonLabel={t(i18n)`Create new`}
              actionOptions={[t(i18n)`New Invoice`, t(i18n)`Upload File`]}
              type="no-data"
            />
          ),
        }}
        columns={columns}
        rows={payables?.data || []}
      />
    </Box>
  );
};
