import React, { useCallback, useEffect, useState } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import type { CounterpartShowCategories } from '@/components/counterparts/Counterpart.types';
import { TableActions } from '@/components/TableActions';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { QCounterpartResponse, useEntityUserByAuthToken } from '@/core/queries';
import {
  useCounterpartCache,
  useCounterpartList,
  useDeleteCounterpart,
} from '@/core/queries/useCounterpart';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import {
  TablePagination,
  useTablePaginationThemeDefaultPageSize,
} from '@/ui/table/TablePagination';
import { ActionEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CounterpartCursorFields,
  CounterpartIndividualRootResponse,
  CounterpartOrganizationRootResponse,
  CounterpartResponse,
  CounterpartType,
  OrderEnum,
} from '@monite/sdk-api';
import MuiEnvelopeIcon from '@mui/icons-material/Email';
import MuiPhoneIcon from '@mui/icons-material/LocalPhone';
import {
  Box,
  Avatar,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { getCounterpartName } from '../helpers';
import {
  FILTER_TYPE_IS_CUSTOMER,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
} from './consts';
import { Filters as FiltersComponent } from './Filters';
import * as Styled from './styles';
import { Filters, FilterValue, Sort } from './types';

interface CounterpartsTableSortModel {
  field: CounterpartCursorFields;
  sort: GridSortDirection;
}

/**
 * Props for the CounterpartsTable component.
 */
export type CounterpartsTableProps = Partial<CounterpartShowCategories> & {
  /**
   * Callback function that is called when the edit action is triggered.
   * @param id - The ID of the counterpart to be edited.
   */
  onEdit?: (id: string) => void;

  /**
   * Callback function that is called when the delete action is triggered.
   * @param id - The ID of the counterpart to be deleted.
   */
  onDelete?: (id: string) => void;

  /**
   * Callback function that is called when a row is clicked.
   * @param id - The ID of the clicked counterpart.
   */
  onRowClick?: (id: string) => void;

  /**
   * Callback function that is called when the sort order is changed.
   * @param params - An object containing the sort field and the sort order.
   * @param params.field - The field to sort by.
   * @param params.sort - The sort order (either ascending, descending, or null).
   */
  onChangeSort?: (params: CounterpartsTableSortModel) => void;

  /**
   * Callback function that is called when the filter is changed.
   * @param filter - An object containing the filter field and value.
   * @param filter.field - The field to filter by.
   * @param filter.value - The value to filter with.
   */
  onChangeFilter?: (filter: {
    field: keyof Filters;
    value: FilterValue;
  }) => void;
};

export const CounterpartsTable = (props: CounterpartsTableProps) => (
  <MoniteScopedProviders>
    <CounterpartsTableBase {...props} />
  </MoniteScopedProviders>
);

const CounterpartsTableBase = ({
  onRowClick,
  onEdit,
  onDelete,
  onChangeSort: onChangeSortCallback,
  onChangeFilter: onChangeFilterCallback,
  showCategories = true,
}: CounterpartsTableProps) => {
  const { i18n } = useLingui();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedCounterpart, setSelectedCounterpart] = useState<
    QCounterpartResponse | undefined
  >(undefined);

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [currentSort, setCurrentSort] = useState<Sort | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filters>({});
  const [sortModel, setSortModel] = useState<Array<CounterpartsTableSortModel>>(
    []
  );
  const sortModelItem = sortModel[0];

  const { destroy } = useCounterpartCache();

  /**
   * `isUpdateSupported` and `isDeleteSupported` should be defined by `created_by_entity_user_id` from counterpart record.
   * Currently, it is not possible, counterpart record does not have this parameter
   * https://monite.atlassian.net/browse/DEV-6311
   */
  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: ActionEnum.READ,
      entityUserId: user?.id,
    });
  const { data: isUpdateSupported } = useIsActionAllowed({
    method: 'counterpart',
    action: ActionEnum.UPDATE,
    entityUserId: user?.id,
  });
  const { data: isDeleteSupported } = useIsActionAllowed({
    method: 'counterpart',
    action: ActionEnum.DELETE,
    entityUserId: user?.id,
  });

  // clear cache before unmount
  useEffect(() => destroy, [destroy]);

  const {
    data: counterparts,
    isLoading,
    refetch,
  } = useCounterpartList(
    // undefined,
    // sortModelItem ? (sortModelItem.sort as OrderEnum) : undefined,
    // pageSize,
    // currentPaginationToken || undefined,
    // sortModelItem
    //   ? (sortModelItem.field as CounterpartCursorFields)
    //   : undefined,
    // currentFilter[FILTER_TYPE_TYPE] || undefined,
    // undefined,
    // undefined,
    // currentFilter[FILTER_TYPE_SEARCH] || undefined,
    // currentFilter[FILTER_TYPE_IS_CUSTOMER] === 'false' ? true : undefined,
    // currentFilter[FILTER_TYPE_IS_CUSTOMER] === 'true' ? true : undefined
    {
      query: {
        order: sortModelItem ? (sortModelItem.sort as OrderEnum) : undefined,
        limit: pageSize || undefined,
        pagination_token: currentPaginationToken || undefined,
        sort: sortModelItem
          ? (sortModelItem.field as CounterpartCursorFields)
          : undefined,
        type: currentFilter[FILTER_TYPE_TYPE] || undefined,
        counterpart_name__icontains:
          currentFilter[FILTER_TYPE_SEARCH] || undefined,
        is_vendor:
          currentFilter[FILTER_TYPE_IS_CUSTOMER] === 'false' ? true : undefined,
        is_customer:
          currentFilter[FILTER_TYPE_IS_CUSTOMER] === 'true' ? true : undefined,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [currentPaginationToken, currentSort, currentFilter, refetch]);

  const closeDeleteCounterpartModal = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);
  const closedDeleteCounterpartModal = useCallback(() => {
    setSelectedCounterpart(undefined);
  }, []);

  const onChangeSort = (m: GridSortModel) => {
    const model = m as Array<CounterpartsTableSortModel>;
    setSortModel(model);
    setCurrentPaginationToken(null);

    onChangeSortCallback?.(model[0]);
  };

  const onChangeFilter = (field: keyof Filters, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback && onChangeFilterCallback({ field, value });
  };

  const deleteCounterpartMutation = useDeleteCounterpart();
  const deleteCounterpart = useCallback(() => {
    if (!selectedCounterpart) {
      return;
    }

    deleteCounterpartMutation.mutate(
      {
        body: undefined,
        path: {
          counterpart_id: selectedCounterpart.id,
        },
      },
      {
        onSuccess: () => {
          onDelete?.(selectedCounterpart.id);
          closeDeleteCounterpartModal();
        },
      }
    );
  }, [
    selectedCounterpart,
    deleteCounterpartMutation,
    onDelete,
    closeDeleteCounterpartModal,
  ]);

  const { root } = useRootElements();

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
          width: '100%',
        }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <FiltersComponent
            onChangeFilter={onChangeFilter}
            showCategories={showCategories}
          />
        </Box>
        <DataGrid
          autoHeight
          rowSelection={false}
          loading={isLoading}
          onRowClick={(params) => onRowClick?.(params.row.id)}
          sortModel={sortModel}
          columnVisibilityModel={{
            category: showCategories,
          }}
          onSortModelChange={onChangeSort}
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
                prevPage={counterparts?.prev_pagination_token}
                nextPage={counterparts?.next_pagination_token}
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
              field: 'counterpart_name',
              sortable: true,
              headerName: t(i18n)`Name, country, city`,
              flex: 1,
              renderCell: (params) => {
                const counterpart = params.row;

                const name =
                  counterpart.type === CounterpartType.ORGANIZATION
                    ? (counterpart as CounterpartOrganizationRootResponse)
                        .organization.legal_name
                    : (counterpart as CounterpartIndividualRootResponse)
                        .individual.first_name;

                return (
                  <>
                    <Avatar sx={{ marginRight: 2 }}>{name[0]}</Avatar>
                    <Typography variant="caption">{name}</Typography>
                  </>
                );
              },
            },
            {
              field: 'category',
              sortable: false,
              headerName: t(i18n)`Category`,
              flex: 0.6,
              renderCell: (params) => {
                const counterpart = params.row;

                const counterpartData =
                  counterpart.type === CounterpartType.ORGANIZATION
                    ? (counterpart as CounterpartOrganizationRootResponse)
                        .organization
                    : (counterpart as CounterpartIndividualRootResponse)
                        .individual;

                const items = [
                  {
                    label: t(i18n)`Customer`,
                    value: counterpartData.is_customer,
                  },
                  { label: t(i18n)`Vendor`, value: counterpartData.is_vendor },
                ].map(
                  ({ label, value }) =>
                    value && (
                      <Chip
                        key={label}
                        label={label}
                        variant="outlined"
                        color="default"
                      />
                    )
                );

                return (
                  <Stack direction="row" spacing={1}>
                    {items}
                  </Stack>
                );
              },
            },
            {
              field: 'contacts',
              sortable: false,
              flex: 1,
              headerName: t(i18n)`Contact information`,
              renderCell: (params) => {
                const counterpart = params.row;

                const data = (() => {
                  switch (counterpart.type) {
                    case CounterpartType.ORGANIZATION: {
                      const organization = (
                        counterpart as CounterpartOrganizationRootResponse
                      ).organization;

                      return {
                        email: organization.email,
                        phone: organization.phone,
                      };
                    }

                    case CounterpartType.INDIVIDUAL: {
                      const individual = (
                        counterpart as CounterpartIndividualRootResponse
                      ).individual;

                      return {
                        email: individual.email,
                        phone: individual.phone,
                      };
                    }
                  }
                })();

                return (
                  <Stack spacing={1} direction="column">
                    {data?.email && (
                      <Styled.MuiColContacts>
                        <MuiEnvelopeIcon fontSize="small" color="disabled" />
                        <Typography variant="body2">{data.email}</Typography>
                      </Styled.MuiColContacts>
                    )}
                    {data?.phone && (
                      <Styled.MuiColContacts>
                        <MuiPhoneIcon fontSize="small" color="disabled" />
                        <Typography variant="body2">{data?.phone}</Typography>
                      </Styled.MuiColContacts>
                    )}
                  </Stack>
                );
              },
            },
            {
              field: 'actions',
              sortable: false,
              headerName: '',
              width: 70,
              renderCell: (params) => (
                <TableActions
                  permissions={{
                    isUpdateAllowed: isUpdateSupported,
                    isDeleteAllowed: isDeleteSupported,
                  }}
                  onEdit={() => {
                    onEdit?.(params.row.id);
                  }}
                  onDelete={() => {
                    setSelectedCounterpart(params.row as QCounterpartResponse);
                    setIsDeleteDialogOpen(true);
                  }}
                />
              ),
            },
          ]}
          rows={counterparts?.data || []}
        />
        <Dialog
          open={isDeleteDialogOpen && Boolean(selectedCounterpart)}
          container={root}
          onClose={closeDeleteCounterpartModal}
          aria-label={t(i18n)`Delete confirmation`}
          maxWidth="sm"
          fullWidth
          TransitionProps={{
            onExited: closedDeleteCounterpartModal,
          }}
        >
          <DialogTitle variant="h3">
            {t(i18n)`Delete Counterpart "${getCounterpartName(
              selectedCounterpart!
            )}"?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t(i18n)`This action can't be undone.`}
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              variant="outlined"
              onClick={closeDeleteCounterpartModal}
              color="inherit"
            >
              {t(i18n)`Cancel`}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={deleteCounterpart}
              autoFocus
            >
              {t(i18n)`Delete`}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
