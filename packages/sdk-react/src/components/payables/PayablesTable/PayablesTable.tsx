import React, { useState } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { CounterpartCell } from '@/components/payables/PayablesTable/CounterpartCell/CounterpartCell';
import { PAGE_LIMIT } from '@/constants';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useEntityUserByAuthToken, usePayablesList } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import { TablePagination } from '@/ui/table/TablePagination';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { SortOrderEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  OrderEnum,
  PayableActionEnum,
  PayableCursorFields,
  PayableResponseSchema,
  PayableStateEnum,
} from '@monite/sdk-api';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import { Box, CircularProgress, Chip } from '@mui/material';
import { DataGrid, GridValueFormatterParams } from '@mui/x-data-grid';

import { addDays, formatISO } from 'date-fns';

import { getRowToStatusTextMap, ROW_TO_STATUS_MUI_MAP } from '../consts';
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
   * @param params.sort - The field to sort by, in this case PayableCursorFields.CREATED_AT.
   * @param params.order - The sort order can be either SortOrderEnum values or null.
   */
  onChangeSort?: (params: {
    sort: PayableCursorFields.CREATED_AT;
    order: SortOrderEnum | null;
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
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [currentFilter, setCurrentFilter] = useState<FilterTypes>({});
  const [pageLimit, setPageLimit] = useState<number>(PAGE_LIMIT);

  const { formatCurrencyToDisplay } = useCurrencies();

  const { data: user } = useEntityUserByAuthToken();

  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: PayableActionEnum.READ,
      entityUserId: user?.id,
    });

  const { data: payables, isLoading } = usePayablesList(
    OrderEnum.DESC,
    pageLimit,
    currentPaginationToken || undefined,
    PayableCursorFields.CREATED_AT,
    undefined,
    undefined,
    // HACK: api filter parameter 'created_at' requires full match with seconds. Could not be used
    currentFilter[FILTER_TYPE_CREATED_AT]
      ? formatISO(addDays(currentFilter[FILTER_TYPE_CREATED_AT] as Date, 1))
      : undefined,
    currentFilter[FILTER_TYPE_CREATED_AT]
      ? formatISO(currentFilter[FILTER_TYPE_CREATED_AT] as Date)
      : undefined,
    undefined,
    currentFilter[FILTER_TYPE_STATUS] || undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    currentFilter[FILTER_TYPE_DUE_DATE]
      ? formatISO(currentFilter[FILTER_TYPE_DUE_DATE] as Date)
      : undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    currentFilter[FILTER_TYPE_SEARCH] || undefined
  );

  const onPrev = () =>
    setCurrentPaginationToken(payables?.prev_pagination_token || null);

  const onNext = () =>
    setCurrentPaginationToken(payables?.next_pagination_token || null);

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

  return (
    <>
      <Box
        className={ScopedCssBaselineContainerClassName}
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
          loading={isLoading}
          pageSizeOptions={[PAGE_LIMIT, PAGE_LIMIT * 2, PAGE_LIMIT * 3]}
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
                isPreviousAvailable={Boolean(payables?.prev_pagination_token)}
                isNextAvailable={Boolean(payables?.next_pagination_token)}
                onPrevious={onPrev}
                onNext={onNext}
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
                PayableResponseSchema['created_at']
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
                PayableResponseSchema['issued_at']
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
              }: GridValueFormatterParams<PayableResponseSchema['due_date']>) =>
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
              renderCell: (params) => {
                const status = params.value as PayableStateEnum;

                return (
                  <Chip
                    label={getRowToStatusTextMap(i18n)[status]}
                    color={ROW_TO_STATUS_MUI_MAP[status]}
                    variant="filled"
                  />
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
