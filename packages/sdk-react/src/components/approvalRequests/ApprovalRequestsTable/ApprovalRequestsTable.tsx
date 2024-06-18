import React, { useState } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
// TODO move component CounterpartCell to common ui folder
import { CounterpartCell } from '@/components/payables/PayablesTable/CounterpartCell';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ObjectType, PayableResponseSchema } from '@monite/sdk-api';
import { Box } from '@mui/material';
import { DataGrid, GridValueFormatterParams } from '@mui/x-data-grid';

import { ApprovalRequestStatusChip } from '../ApprovalRequestStatusChip';
import { FILTER_TYPE_STATUS } from '../consts';
import { Filters as FiltersComponent } from '../Filters';
import { FilterTypes, FilterValue } from '../types';
import { UserCell } from '../UserCell';

interface ApprovalRequestsTableProps {
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
}
export const ApprovalRequestsTable = (props: ApprovalRequestsTableProps) => (
  <MoniteScopedProviders>
    <ApprovalRequestsTableBase {...props} />
  </MoniteScopedProviders>
);

const ApprovalRequestsTableBase = ({
  onChangeFilter: onChangeFilterCallback,
}: ApprovalRequestsTableProps) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [currentFilter, setCurrentFilter] = useState<FilterTypes>({});

  const { data: approvalRequests, isLoading: isApprovalRequestsLoading } =
    api.approvalRequests.getApprovalRequests.useQuery({
      query: {
        object_type: ObjectType.PAYABLE,
        pagination_token: currentPaginationToken ?? undefined,
        limit: pageSize,
        status: currentFilter[FILTER_TYPE_STATUS] || undefined,
      },
    });

  const { data: payables, isLoading: isPayablesLoading } =
    api.payables.getPayables.useQuery({
      query: {
        id__in: approvalRequests?.data.map(
          (approvalRequest) => approvalRequest.object_id
        ),
      },
    });

  const rows = approvalRequests?.data.map((approvalRequest) => {
    const approvingPayable = payables?.data.find(
      (payable) => payable.id === approvalRequest.object_id
    );

    return {
      id: approvalRequest.id,
      number: approvingPayable?.document_id,
      counterpart_id: approvingPayable?.counterpart_id,
      issued_at: approvingPayable?.issued_at,
      due_date: approvingPayable?.due_date,
      status: approvalRequest.status,
      amount_to_pay: approvingPayable?.amount_to_pay,
      currency: approvingPayable?.currency,
      created_by: approvalRequest.created_by,
    };
  });

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback?.({ field, value });
  };

  return (
    <Box
      sx={{ padding: 2, width: '100%', height: '100%' }}
      className={ScopedCssBaselineContainerClassName}
    >
      <Box sx={{ marginBottom: 2 }}>
        <FiltersComponent onChangeFilter={onChangeFilter} />
      </Box>
      <DataGrid
        autoHeight
        rowSelection={false}
        loading={isApprovalRequestsLoading || isPayablesLoading}
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
              prevPage={approvalRequests?.prev_pagination_token}
              nextPage={approvalRequests?.next_pagination_token}
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
            field: 'number',
            headerName: t(i18n)`Number`,
            sortable: false,
            flex: 1,
          },
          {
            field: 'counterpart_id',
            headerName: t(i18n)`Counterpart`,
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <CounterpartCell counterpartId={params.value} />
            ),
          },
          {
            field: 'issued_at',
            type: 'date',
            headerName: t(i18n)({
              id: 'Issue date Name',
              message: 'Issue date',
              comment: 'Payables Table "Issue date" heading title',
            }),
            sortable: false,
            flex: 0.7,
            valueFormatter: ({
              value,
            }: GridValueFormatterParams<PayableResponseSchema['issued_at']>) =>
              value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
          },
          {
            field: 'due_date',
            type: 'date',
            headerName: t(i18n)({
              id: 'Due date Name',
              message: 'Due date',
              comment: 'Payables Table "Due date" heading title',
            }),
            sortable: false,
            flex: 0.7,
            valueFormatter: ({
              value,
            }: GridValueFormatterParams<PayableResponseSchema['due_date']>) =>
              value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
          },
          {
            field: 'status',
            headerName: t(i18n)({
              id: 'Status Name',
              message: 'Status',
              comment: 'Payables Table "Status" heading title',
            }),
            sortable: false,
            flex: 0.7,
            renderCell: (params) => (
              <ApprovalRequestStatusChip status={params.value} />
            ),
          },
          {
            field: 'amount',
            headerName: t(i18n)({
              id: 'Amount Name',
              message: 'Amount',
              comment: 'Payables Table "Amount" heading title',
            }),
            sortable: false,
            flex: 0.7,
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
            field: 'created_by',
            headerName: t(i18n)`Added by`,
            sortable: false,
            flex: 1,
            renderCell: ({ value }) => <UserCell entityUserId={value} />,
          },
        ]}
        rows={rows ?? []}
      />
    </Box>
  );
};
