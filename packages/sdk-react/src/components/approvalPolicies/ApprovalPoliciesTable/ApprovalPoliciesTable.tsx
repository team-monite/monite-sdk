import { useEffect, useMemo, useState } from 'react';

import { components } from '@/api';
import { ApprovalPoliciesRules } from '@/components/approvalPolicies/ApprovalPoliciesTable/components/ApprovalPoliciesRules';
import { User } from '@/components/approvalPolicies/ApprovalPolicyDetails/ApprovalPolicyView/User';
import { ApprovalStatusChip } from '@/components/approvalPolicies/ApprovalStatusChip';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { extractApprovalCallsForTable } from '@/components/payables/PayableDetails/PayableDetailsApprovalFlow/approvalStepUtils';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { DataGridEmptyState } from '@/ui/DataGridEmptyState';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { TablePagination } from '@/ui/table/TablePagination';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { addDays, formatISO } from 'date-fns';

import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CREATED_BY,
  FILTER_TYPE_SEARCH,
} from '../consts';
import { FilterTypes, FilterValue } from '../types';
import { ApprovalPoliciesTriggers } from './components/ApprovalPoliciesTriggers';
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
  order: 'asc' | 'desc' | null;
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

export interface ApprovalPoliciesTableProps {
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

  /**
   * Triggered when the create button is clicked for no data state.
   */
  onCreateClick?: () => void;
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
  onCreateClick,
}: ApprovalPoliciesTableProps) => {
  const { i18n } = useLingui();
  const { api, locale, componentSettings } = useMoniteContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    componentSettings.approvalPolicies.pageSizeOptions[0]
  );
  const [currentFilters, setCurrentFilters] = useState<FilterTypes>({});

  const {
    data: approvalPolicies,
    isLoading,
    isError,
    refetch,
  } = api.approvalPolicies.getApprovalPolicies.useQuery({
    query: {
      limit: pageSize,
      name__ncontains: currentFilters[FILTER_TYPE_SEARCH] ?? undefined,
      created_by: currentFilters[FILTER_TYPE_CREATED_BY] ?? undefined,
      pagination_token: currentPaginationToken ?? undefined,
      created_at__gte: currentFilters[FILTER_TYPE_CREATED_AT]
        ? formatISO(currentFilters[FILTER_TYPE_CREATED_AT] as Date)
        : undefined,
      created_at__lte: currentFilters[FILTER_TYPE_CREATED_AT]
        ? formatISO(addDays(currentFilters[FILTER_TYPE_CREATED_AT] as Date, 1))
        : undefined,
    },
  });

  useEffect(() => {
    if (currentPaginationToken && approvalPolicies?.data.length === 0) {
      setCurrentPaginationToken(null);
    }
  }, [currentPaginationToken, approvalPolicies]);

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'name',
        headerName: t(i18n)`Policy name`,
        sortable: false,
        flex: 1,
      },
      {
        field: 'triggers',
        headerName: t(i18n)`Conditions`,
        sortable: false,
        flex: 1,
        renderCell: (params) => (
          <ApprovalPoliciesTriggers approvalPolicy={params.row} />
        ),
      },
      {
        field: 'approvals',
        headerName: t(i18n)`Approvals`,
        sortable: false,
        flex: 1,
        renderCell: (params) => {
          const script = params.row.script?.[0]?.if?.all;
          if (!script) {
            return (
              <span>
                {t(i18n)`N/A`} {t(i18n)`approvals required`}
              </span>
            );
          }

          const allApprovalCalls = extractApprovalCallsForTable(script);
          const totalRequiredApprovals = allApprovalCalls.reduce(
            (sum, call) => sum + (call.params?.required_approval_count || 0),
            0
          );
          const requiredApprovalCount = totalRequiredApprovals || t(i18n)`N/A`;

          return (
            <span>
              {requiredApprovalCount} {t(i18n)`approvals required`}
            </span>
          );
        },
      },
      {
        field: 'rule',
        headerName: t(i18n)`Flow`,
        sortable: false,
        flex: 1,
        renderCell: (params) => (
          <ApprovalPoliciesRules approvalPolicy={params.row} />
        ),
      },
      {
        field: 'status',
        headerName: t(i18n)`Status`,
        sortable: false,
        flex: 0.7,
        renderCell: (params) => (
          <ApprovalStatusChip status={params.row.status} />
        ),
      },
      {
        field: 'created_at',
        headerName: t(i18n)`Created at`,
        sortable: false,
        flex: 0.7,
        valueFormatter: (value) => i18n.date(value, locale.dateFormat),
      },
      {
        field: 'created_by',
        headerName: t(i18n)`Created by`,
        sortable: false,
        flex: 0.8,
        renderCell: ({ value }) => <User userId={value} />,
      },
    ];
  }, [locale.dateFormat, i18n]);

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback && onChangeFilterCallback({ field, value });
  };

  const isFiltering = Object.keys(currentFilters).some(
    (key) =>
      currentFilters[key as keyof FilterTypes] !== null &&
      currentFilters[key as keyof FilterTypes] !== undefined
  );
  const isSearching = !!currentFilters[FILTER_TYPE_SEARCH];

  if (
    !isLoading &&
    approvalPolicies?.data.length === 0 &&
    !isFiltering &&
    !isSearching
  ) {
    return (
      <DataGridEmptyState
        title={t(i18n)`No Approval Policies`}
        descriptionLine1={t(i18n)`You don’t have any approval policies yet.`}
        descriptionLine2={t(i18n)`You can create your first approval policy.`}
        actionButtonLabel={t(i18n)`Create`}
        actionOptions={[t(i18n)`Approval Policy`]}
        onAction={() => {
          onCreateClick?.();
        }}
        type="no-data"
      />
    );
  }

  return (
    <Box
      className={ScopedCssBaselineContainerClassName}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        minHeight: '500px',
      }}
    >
      <Filters onChangeFilter={onChangeFilter} sx={{ mb: 2 }} />
      <DataGrid
        disableColumnFilter={true}
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
        }}
        loading={isLoading}
        getRowHeight={() => 'auto'}
        columns={columns}
        rows={approvalPolicies?.data || []}
        onRowClick={(params) => {
          if (!hasSelectedText()) {
            onRowClick?.(params.row);
          }
        }}
        slots={{
          pagination: () => (
            <TablePagination
              pageSizeOptions={
                componentSettings.approvalPolicies.pageSizeOptions
              }
              paginationLayout={componentSettings.approvalPolicies.paginationLayout}
              navigationPosition={componentSettings.approvalPolicies.navigationPosition}
              pageSizePosition={componentSettings.approvalPolicies.pageSizePosition}
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
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={approvalPolicies?.data.length || 0}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              onCreate={() => onCreateClick?.()}
              refetch={refetch}
              entityName={t(i18n)`Approval Policies`}
              actionButtonLabel={t(i18n)`Create`}
              type="no-data"
            />
          ),
        }}
      />
    </Box>
  );
};

type ApprovalPolicyResource = components['schemas']['ApprovalPolicyResource'];
type ApprovalPolicyCursorFields =
  components['schemas']['ApprovalPolicyCursorFields'];
