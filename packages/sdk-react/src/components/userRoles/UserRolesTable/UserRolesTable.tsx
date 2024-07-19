import React, { useState } from 'react';

import { components } from '@/api';
import { FILTER_TYPE_CREATED_AT } from '@/components/approvalPolicies/consts';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { FILTER_TYPE_SEARCH } from '@/components/userRoles/consts';
import { FilterType, FilterValue } from '@/components/userRoles/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridValueFormatterParams,
  gridClasses,
  GridSortModel,
} from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { addDays, formatISO } from 'date-fns';

import { Filters } from './Filters';
import { PermissionsCell } from './PermissionsCell';

interface UserRolesTableProps {
  /**
   * Triggered when the filtering options are changed.
   * Sync with the server *is* performed.
   *
   * @param filter - An object containing the filter parameters.
   * @param filter.field - The field to filter by, specified as a keyof FilterTypes.
   * @param filter.value - The value to be applied to the filter, of type FilterValue.
   */
  onFilterChanged?: (filter: {
    field: keyof FilterType;
    value: FilterValue;
  }) => void;

  /**
   * Triggered when the sorting options are changed.
   * Sync with the server *is* performed.
   *
   * @param params - An object containing the sorting parameters.
   * @param params.sort - The field to sort by, in this case PayableCursorFields.CREATED_AT.
   * @param params.order - The sort order can be either SortOrderEnum values or null.
   */
  onSortChanged?: (params: UserRolesTableSortModel) => void;
  /**
   * Triggered when a row is clicked.
   *
   * @param id - The id of the row that was clicked.
   */
  onRowClick?: (id: string) => void;
}

interface UserRolesTableSortModel {
  field: components['schemas']['RoleCursorFields'];
  sort: GridSortDirection;
}

export const UserRolesTable = (props: UserRolesTableProps) => (
  <MoniteScopedProviders>
    <UserRolesTableBase {...props} />
  </MoniteScopedProviders>
);

const UserRolesTableBase = ({
  onFilterChanged,
  onSortChanged,
  onRowClick,
}: UserRolesTableProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [currentFilter, setCurrentFilter] = useState<FilterType>({});
  const [sortModel, setSortModel] = useState<Array<UserRolesTableSortModel>>(
    []
  );
  const sortModelItem = sortModel[0];

  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'read',
      entityUserId: user?.id,
    });

  const { data: roles, isLoading } = api.roles.getRoles.useQuery({
    query: {
      order: sortModelItem
        ? (sortModelItem.sort as unknown as components['schemas']['OrderEnum'])
        : undefined,
      limit: pageSize,
      pagination_token: currentPaginationToken || undefined,
      sort: sortModelItem
        ? (sortModelItem.field as components['schemas']['RoleCursorFields'])
        : undefined,
      name: currentFilter[FILTER_TYPE_SEARCH] || undefined,
      created_at__gte: currentFilter[FILTER_TYPE_CREATED_AT]
        ? formatISO(currentFilter[FILTER_TYPE_CREATED_AT] as Date)
        : undefined,
      created_at__lte: currentFilter[FILTER_TYPE_CREATED_AT]
        ? formatISO(addDays(currentFilter[FILTER_TYPE_CREATED_AT] as Date, 1))
        : undefined,
    },
  });

  const onChangeFilter = (field: keyof FilterType, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));

    onFilterChanged?.({ field, value });
  };

  const onChangeSort = (m: GridSortModel) => {
    const model = m as Array<UserRolesTableSortModel>;
    setSortModel(model);
    setCurrentPaginationToken(null);

    onSortChanged?.(model[0]);
  };

  if (isReadSupportedLoading) {
    return <LoadingPage />;
  }

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
        <Box sx={{ marginBottom: 2 }}>
          <Filters onChangeFilter={onChangeFilter} />
        </Box>
        <DataGrid
          autoHeight
          rowSelection={false}
          loading={isLoading}
          columns={[
            {
              field: 'name',
              headerName: t(i18n)`Name`,
              sortable: false,
              flex: 1,
            },
            {
              field: 'permissions',
              headerName: t(i18n)`Permissions`,
              sortable: false,
              flex: 2,
              renderCell: (params) => (
                <PermissionsCell
                  permissions={params.value}
                  onCLickSeeAll={() => onRowClick?.(params.row.id)}
                />
              ),
            },
            {
              field: 'created_at',
              headerName: t(i18n)`Created on`,
              sortable: true,
              type: 'date',
              flex: 1,
              valueFormatter: ({
                value,
              }: GridValueFormatterParams<
                components['schemas']['PayableResponseSchema']['created_at']
              >) => i18n.date(value, DateTimeFormatOptions.EightDigitDate),
            },
          ]}
          rows={roles?.data || []}
          onRowClick={(params) => onRowClick?.(params.row.id)}
          getRowHeight={() => 'auto'}
          sortModel={sortModel}
          onSortModelChange={onChangeSort}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 1,
            },
          }}
          slots={{
            pagination: () => (
              <TablePagination
                prevPage={roles?.prev_pagination_token}
                nextPage={roles?.next_pagination_token}
                paginationModel={{
                  pageSize,
                  page: currentPaginationToken,
                }}
                onPaginationModelChange={({ page, pageSize }) => {
                  setCurrentPaginationToken(page);
                  setPageSize(pageSize);
                }}
              />
            ),
          }}
        />
      </Box>
    </>
  );
};
