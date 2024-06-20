import React, { useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { CounterpartCell } from '@/ui/CounterpartCell';
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { ActionEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Stack } from '@mui/material';
import { DataGrid, GridValueFormatterParams } from '@mui/x-data-grid';

import { addDays, formatISO } from 'date-fns';

import {
  ApprovalRequestStatus,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_ADDED_BY,
  FILTER_TYPE_CURRENT_USER,
} from '../consts';
import { FilterTypes, FilterValue } from '../types';
import { ApprovalRequestStatusChip } from './ApprovalRequestStatusChip';
import { ApproveButton } from './ApproveButton';
import { Filters as FiltersComponent } from './Filters';
import { RejectButton } from './RejectButton';
import { UserCell } from './UserCell';

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
  const { data: user } = useEntityUserByAuthToken();

  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'approval_request',
      action: ActionEnum.READ,
      entityUserId: user?.id,
    });
  const { data: isUpdateSupported, isLoading: isUpdateSupportedLoading } =
    useIsActionAllowed({
      method: 'approval_request',
      action: ActionEnum.UPDATE,
      entityUserId: user?.id,
    });

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
        sort: 'updated_at',
        order: 'desc',
        object_type: 'payable',
        pagination_token: currentPaginationToken ?? undefined,
        limit: pageSize,
        status: currentFilter[FILTER_TYPE_STATUS] || undefined,
        created_at__lt: currentFilter[FILTER_TYPE_CREATED_AT]
          ? formatISO(addDays(currentFilter[FILTER_TYPE_CREATED_AT] as Date, 1))
          : undefined,
        created_at__gte: currentFilter[FILTER_TYPE_CREATED_AT]
          ? formatISO(currentFilter[FILTER_TYPE_CREATED_AT] as Date)
          : undefined,
        created_by: currentFilter[FILTER_TYPE_CURRENT_USER]
          ? user?.id
          : currentFilter[FILTER_TYPE_ADDED_BY] || undefined,
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
      user_ids: approvalRequest.user_ids,
      approved_by: approvalRequest.approved_by,
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

  if (isReadSupportedLoading || isUpdateSupportedLoading) {
    return <LoadingPage />;
  }

  if (!isReadSupported) {
    return <AccessRestriction />;
  }

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
            headerName: t(i18n)`Invoice #`,
            sortable: false,
            flex: 0.7,
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
            headerName: t(i18n)`Issue date`,
            sortable: false,
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
            type: 'date',
            headerName: t(i18n)`Due date`,
            sortable: false,
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
            headerName: t(i18n)`Status`,
            sortable: false,
            flex: 0.7,
            renderCell: (params) => (
              <ApprovalRequestStatusChip status={params.value} />
            ),
          },
          {
            field: 'amount',
            headerName: t(i18n)`Amount`,
            sortable: false,
            flex: 0.5,
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
          {
            field: 'actions',
            renderHeader: () => null,
            sortable: false,
            flex: 0.5,
            align: 'right',
            renderCell: (params) => {
              if (
                params.row.status === ApprovalRequestStatus.WAITING &&
                user?.id &&
                params.row.user_ids.includes(user.id) &&
                !params.row.approved_by?.includes(user.id)
              ) {
                return (
                  <Stack direction="row" spacing={1}>
                    <ApproveButton id={params.row.id} />
                    <RejectButton id={params.row.id} />
                  </Stack>
                );
              }
            },
          },
        ]}
        columnVisibilityModel={{
          actions: isUpdateSupported,
        }}
        rows={rows ?? []}
      />
    </Box>
  );
};
