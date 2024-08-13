import { useMemo, useState } from 'react';

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
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { addDays, formatISO } from 'date-fns';

import {
  FILTER_TYPE_ADDED_BY,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CURRENT_USER,
  FILTER_TYPE_STATUS,
} from '../consts';
import { FilterTypes, FilterValue } from '../types';
import { ApprovalRequestsFilter } from './ApprovalRequestsFilter/ApprovalRequestsFilter';
import { ApprovalRequestStatusChip } from './ApprovalRequestStatusChip';
import {
  useApprovalRequestActionsCell,
  UseApprovalRequestActionsCellProps,
} from './useApprovalRequestActionsCell';
import { UserCell } from './UserCell/UserCell';

interface ApprovalRequestsTableBaseProps {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;
}

type ApprovalRequestsTableProps =
  | ApprovalRequestsTableBaseProps
  | (ApprovalRequestsTableBaseProps & UseApprovalRequestActionsCellProps);

export const ApprovalRequestsTable = (props: ApprovalRequestsTableProps) => (
  <MoniteScopedProviders>
    <ApprovalRequestsTableBase {...props} />
  </MoniteScopedProviders>
);

const ApprovalRequestsTableBase = ({
  onRowClick,
  ...restProps
}: ApprovalRequestsTableProps) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { data: user } = useEntityUserByAuthToken();

  const {
    data: isApprovalReadSupported,
    isLoading: isApprovalReadSupportedLoading,
  } = useIsActionAllowed({
    method: 'approval_request',
    action: 'read',
    entityUserId: user?.id,
  });
  const {
    data: isPayableReadSupported,
    isLoading: isPayableReadSupportedLoading,
  } = useIsActionAllowed({
    method: 'payable',
    action: 'read',
    entityUserId: user?.id,
  });
  const {
    data: isApprovalUpdateSupported,
    isLoading: isApprovalUpdateSupportedLoading,
  } = useIsActionAllowed({
    method: 'approval_request',
    action: 'update',
    entityUserId: user?.id,
  });

  const actionsCell = useApprovalRequestActionsCell({
    onRowActionClick:
      'onRowActionClick' in restProps && restProps.onRowActionClick,
    isApprovePending:
      'isApprovePending' in restProps && restProps.isApprovePending,
    isRejectPending:
      'isRejectPending' in restProps && restProps.isRejectPending,
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
  };

  const columns = useMemo<GridColDef[]>(() => {
    return [
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
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['issued_at']
        ) => value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
      },
      {
        field: 'due_date',
        type: 'date',
        headerName: t(i18n)`Due date`,
        sortable: false,
        flex: 0.7,
        valueFormatter: (
          value: components['schemas']['PayableResponseSchema']['due_date']
        ) => value && i18n.date(value, DateTimeFormatOptions.EightDigitDate),
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
        valueGetter: (_, row) => {
          const payable = row;

          return payable.amount_to_pay && payable.currency
            ? formatCurrencyToDisplay(payable.amount_to_pay, payable.currency)
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
      ...(actionsCell ? [actionsCell] : []),
    ];
  }, [actionsCell, formatCurrencyToDisplay, i18n]);

  if (
    isApprovalReadSupportedLoading ||
    isPayableReadSupportedLoading ||
    isApprovalUpdateSupportedLoading
  ) {
    return <LoadingPage />;
  }

  if (!isApprovalReadSupported || !isPayableReadSupported) {
    return <AccessRestriction />;
  }

  return (
    <Box
      sx={{ padding: 2, width: '100%', height: '100%' }}
      className={ScopedCssBaselineContainerClassName}
    >
      <Box sx={{ marginBottom: 2 }}>
        <ApprovalRequestsFilter onChangeFilter={onChangeFilter} />
      </Box>
      <DataGrid
        autoHeight
        rowSelection={false}
        disableColumnFilter={true}
        initialState={{
          columns: {
            columnVisibilityModel: {
              actions:
                isApprovalUpdateSupported && 'onRowActionClick' in restProps,
            },
          },
        }}
        loading={isApprovalRequestsLoading || isPayablesLoading}
        onRowClick={(params) => onRowClick?.(params.row.id)}
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
        columns={columns}
        rows={rows ?? []}
      />
    </Box>
  );
};
