import React, { useState } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export const ApprovalRequestsTable = () => (
  <MoniteScopedProviders>
    <ApprovalRequestsTableBase />
  </MoniteScopedProviders>
);

const ApprovalRequestsTableBase = () => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );

  const {
    data: approvalRequests,
    isLoading: isApprovalRequestsLoading,
    isError,
    error,
  } = api.approvalRequests.getApprovalRequests.useQuery({
    query: {
      pagination_token: currentPaginationToken ?? undefined,
      limit: pageSize,
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
    };
  });

  return (
    <Box
      sx={{ padding: 2, width: '100%', height: '100%' }}
      className={ScopedCssBaselineContainerClassName}
    >
      <Box sx={{ marginBottom: 2 }}>{`Filters`}</Box>
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
            field: 'id',
            headerName: t(i18n)`ID`,
            sortable: false,
            flex: 1,
          },
          {
            field: 'number',
            headerName: t(i18n)`Number`,
            sortable: false,
            flex: 1,
          },
        ]}
        rows={rows ?? []}
      />
    </Box>
  );
};
