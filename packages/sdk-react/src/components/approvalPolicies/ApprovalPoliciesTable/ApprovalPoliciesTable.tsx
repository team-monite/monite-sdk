import React, { useEffect, useState } from 'react';

import { ApprovalPoliciesRules } from '@/components/approvalPolicies/ApprovalPoliciesTable/components/ApprovalPoliciesRules';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useApprovalPoliciesList } from '@/core/queries';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { SortOrderEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ApprovalPolicyCursorFields,
  ApprovalPolicyResource,
} from '@monite/sdk-api';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { addDays, formatISO } from 'date-fns';

import {
  FILTER_TYPE_CREATED_BY,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_CREATED_AT,
} from '../consts';
import { FilterTypes, FilterValue } from '../types';
import { ApprovalPoliciesTriggers } from './components/ApprovalPoliciesTriggers';
import { ApprovalPoliciesUser } from './components/ApprovalPoliciesUser';
import { Filters } from './Filters';

interface onChangeSortParams {
  /**
   * The field to sort by. Defaults to ApprovalPolicyCursorFields.CREATED_AT.
   */
  sort: ApprovalPolicyCursorFields;
  /**
   * The value to order by. Defaults to SortOrderEnum.DESC.
   * null means no sorting.
   */
  order: SortOrderEnum | null;
}

interface onFilterChangeParams {
  /**
   * The field to filter by.
   */
  field: keyof FilterTypes;
  /**
   * The value to filter by.
   */
  value: FilterValue;
}

interface ApprovalPoliciesTableProps {
  /**
   * Triggered when the sorting options are changed.
   *
   * @param params - The sorting options.
   */
  onChangeSort?: (params: onChangeSortParams) => void;

  /**
   * Triggered when the filtering options are changed.
   *
   * @param filter - The filtering options.
   */
  onChangeFilter?: (filter: onFilterChangeParams) => void;

  /**
   * Triggered when a row is clicked.
   *
   * @param approvalPolicy - The approval policy that was clicked.
   */
  onRowClick?: (approvalPolicy: ApprovalPolicyResource) => void;
}

/**
 * ApprovalPoliciesTable component
 *
 * This component renders a table of approval policies. It includes pagination and filtering functionality.
 */
export const ApprovalPoliciesTable = (props: ApprovalPoliciesTableProps) => (
  <MoniteScopedProviders>
    <ApprovalPoliciesTableBase {...props} />
  </MoniteScopedProviders>
);

const ApprovalPoliciesTableBase = ({
  onChangeFilter: onChangeFilterCallback,
  onRowClick,
}: ApprovalPoliciesTableProps) => {
  const { i18n } = useLingui();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [currentFilters, setCurrentFilters] = useState<FilterTypes>({});

  const { data: approvalPolicies, isLoading } = useApprovalPoliciesList({
    limit: pageSize,
    name__ncontains: currentFilters[FILTER_TYPE_SEARCH] ?? undefined,
    created_by: currentFilters[FILTER_TYPE_CREATED_BY] ?? undefined,
    paginationToken: currentPaginationToken ?? undefined,
    created_at__gte: currentFilters[FILTER_TYPE_CREATED_AT]
      ? formatISO(currentFilters[FILTER_TYPE_CREATED_AT] as Date)
      : undefined,
    created_at__lte: currentFilters[FILTER_TYPE_CREATED_AT]
      ? formatISO(addDays(currentFilters[FILTER_TYPE_CREATED_AT] as Date, 1))
      : undefined,
  });

  useEffect(() => {
    if (currentPaginationToken && approvalPolicies?.data.length === 0) {
      setCurrentPaginationToken(null);
    }
  }, [currentPaginationToken, approvalPolicies]);

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback && onChangeFilterCallback({ field, value });
  };

  return (
    <>
      <Box
        sx={{ padding: 2, width: '100%', height: '100%' }}
        className={ScopedCssBaselineContainerClassName}
      >
        <Box sx={{ marginBottom: 2 }}>
          <Filters onChangeFilter={onChangeFilter} />
        </Box>
        <DataGrid
          autoHeight
          rowSelection={false}
          sx={{
            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
              py: '8px',
            },
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
              py: '15px',
            },
            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
              py: '22px',
            },
            '& .MuiDataGrid-withBorderColor': {
              borderColor: 'divider',
            },
            '&.MuiDataGrid-withBorderColor': {
              borderColor: 'divider',
            },
          }}
          loading={isLoading}
          getRowHeight={() => 'auto'}
          columns={[
            {
              field: 'name',
              headerName: t(i18n)`Policy name`,
              sortable: false,
              flex: 1,
            },
            {
              field: 'triggers',
              headerName: t(i18n)`Triggers`,
              sortable: false,
              flex: 1,
              renderCell: (params) => (
                <ApprovalPoliciesTriggers approvalPolicyId={params.row.id} />
              ),
            },
            {
              field: 'rule',
              headerName: t(i18n)`Rule`,
              sortable: false,
              flex: 1,
              renderCell: (params) => (
                <ApprovalPoliciesRules approvalPolicyId={params.row.id} />
              ),
            },
            {
              field: 'created_at',
              headerName: t(i18n)`Created at`,
              sortable: false,
              flex: 0.7,
              valueFormatter: ({ value }) =>
                i18n.date(value, DateTimeFormatOptions.EightDigitDate),
            },
            {
              field: 'created_by',
              headerName: t(i18n)`Created by`,
              sortable: false,
              flex: 0.8,
              renderCell: ({ value }) => (
                <ApprovalPoliciesUser entityUserId={value} />
              ),
            },
          ]}
          rows={approvalPolicies?.data || []}
          onRowClick={(params) => onRowClick?.(params.row)}
          slots={{
            pagination: () => (
              <TablePagination
                nextPage={approvalPolicies?.next_pagination_token}
                prevPage={approvalPolicies?.prev_pagination_token}
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
        />
      </Box>
    </>
  );
};
