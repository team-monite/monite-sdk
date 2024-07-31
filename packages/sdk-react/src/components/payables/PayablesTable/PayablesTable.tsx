import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { AccessRestriction } from '@/ui/accessRestriction';
import { CounterpartCell } from '@/ui/CounterpartCell';
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { classNames } from '@/utils/css-utils';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import { Box, CircularProgress } from '@mui/material';
import { DataGrid, GridValueFormatterParams } from '@mui/x-data-grid';

import { addDays, formatISO } from 'date-fns';

import { isPayableInOCRProcessing } from '../utils/isPayableInOcr';
import { PayablesTableAction } from './components/PayablesTableAction';
import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
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
}: PayablesTableProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
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
      order: 'desc',
      limit: pageSize,
      pagination_token: currentPaginationToken || undefined,
      sort: 'created_at',
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
    },
  });

  const {
    data: payables,
    isLoading,
    isError,
    error,
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

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback?.({ field, value });
  };

  if (isReadSupportedLoading) {
    return <LoadingPage />;
  }

  /** We have to wait until `usePayablesList` and `useIsActionAllowed` is finished */
  if (!isReadSupported) {
    return <AccessRestriction />;
  }

  const className = 'Monite-PayablesTable';
  return (
    <>
      <Box
        className={classNames(ScopedCssBaselineContainerClassName, className)}
        sx={{
          padding: 2,
        }}
      >
        <Box
          sx={{
            marginBottom: 2,
          }}
        >
          <FiltersComponent onChangeFilter={onChangeFilter} />
        </Box>
        <DataGrid
          autoHeight
          rowSelection={false}
          loading={isLoading}
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
          }}
          columns={[
            {
              field: 'document_id',
              sortable: false,
              headerName: t(i18n)`Invoice #`,
              flex: 1.1,
              colSpan: ({ row }) => (isPayableInOCRProcessing(row) ? 2 : 1),
              renderCell: (params) => {
                const payable = params.row;

                if (isPayableInOCRProcessing(payable)) {
                  return (
                    <Box display="flex">
                      <FindInPageOutlinedIcon fontSize="small" />
                      {payable.file?.name}
                    </Box>
                  );
                }

                return payable.document_id;
              },
            },
            {
              field: 'counterpart_id',
              sortable: false,
              headerName: t(i18n)`Counterpart`,
              flex: 1.2,
              renderCell: (params) => (
                <CounterpartCell counterpartId={params.value} />
              ),
            },
            {
              field: 'created_at',
              sortable: false,
              type: 'date',
              headerName: t(i18n)`Invoice date`,
              flex: 0.7,
              colSpan: ({ row }) => (isPayableInOCRProcessing(row) ? 3 : 1),
              renderCell: ({ row, formattedValue }) => {
                if (isPayableInOCRProcessing(row)) {
                  return (
                    <Box display="flex">
                      <CircularProgress size={22} sx={{ mr: 1.5 }} />
                      {t(i18n)`Processing file…`}
                    </Box>
                  );
                }

                return formattedValue;
              },
              valueFormatter: ({
                value,
              }: GridValueFormatterParams<
                components['schemas']['PayableResponseSchema']['created_at']
              >) => i18n.date(value, DateTimeFormatOptions.EightDigitDate),
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
              flex: 0.7,
              valueFormatter: ({
                value,
              }: GridValueFormatterParams<
                components['schemas']['PayableResponseSchema']['issued_at']
              >) =>
                value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
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
              flex: 0.7,
              valueFormatter: ({
                value,
              }: GridValueFormatterParams<
                components['schemas']['PayableResponseSchema']['due_date']
              >) =>
                value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
            },
            {
              field: 'status',
              sortable: false,
              headerName: t(i18n)({
                id: 'Status Name',
                message: 'Status',
                comment: 'Payables Table "Status" heading title',
              }),
              flex: 0.9,
              renderCell: (params) => (
                <PayableStatusChip status={params.value} />
              ),
            },
            {
              field: 'amount',
              sortable: false,
              headerName: t(i18n)({
                id: 'Amount Name',
                message: 'Amount',
                comment: 'Payables Table "Amount" heading title',
              }),
              width: 100,
              valueGetter: (params) => {
                const payable = params.row;

                return payable.amount_to_pay && payable.currency
                  ? formatCurrencyToDisplay(
                      payable.amount_to_pay,
                      payable.currency
                    )
                  : '';
              },
            },
            {
              field: 'pay',
              headerName: '',
              sortable: false,
              renderCell: (params) => {
                const payable = params.row;

                return <PayablesTableAction payable={payable} onPay={onPay} />;
              },
            },
          ]}
          rows={payables?.data || []}
        />
      </Box>
    </>
  );
};
