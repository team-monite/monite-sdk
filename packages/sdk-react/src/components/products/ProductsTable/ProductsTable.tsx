import React, { useState } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { ProductDeleteModal } from '@/components/products/ProductDeleteModal';
import { TableActions } from '@/components/TableActions';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { useEntityUserByAuthToken, useProducts } from '@/core/queries';
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
  ProductCursorFields,
  OrderEnum,
  ProductServiceResponse,
} from '@monite/sdk-api';
import { Box, Stack, Typography } from '@mui/material';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ProductType } from '../ProductDetails/components/ProductType';
import { Filters as FiltersComponent } from './components/Filters/Filters';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_UNITS,
} from './consts';
import { Filters as FilterType, FilterValue } from './types';

/** @deprecated Use `ProductTableProps` instead */
export type IProductTableProps = ProductTableProps;

export interface ProductTableProps {
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
  onSortChanged?: (params: ProductsTableSortModel) => void;

  /**
   * The event handler for a row click.
   *
   * @param product - The product selected from the table by clicking on the row.
   */
  onRowClick?: (product: ProductServiceResponse) => void;

  /**
   * The event handler for a product edit. Triggers when the user clicks the edit button.
   * Sync with the server is *not* performed.
   *
   * @param product - The product on which the user clicked the edit button.
   */
  onEdit?: (product: ProductServiceResponse) => void;

  /**
   * The event handler for a product delete.
   * Triggers when the user deletes the product from the modal and sync with server is successful.
   * Sync with the server *is* performed.
   *
   * @param productId - Removed product ID.
   */
  onDeleted?: (productId: ProductServiceResponse['id']) => void;
}

interface ProductsTableSortModel {
  field: ProductCursorFields;
  sort: GridSortDirection;
}

export const ProductsTable = (props: ProductTableProps) => (
  <MoniteScopedProviders>
    <ProductsTableBase {...props} />
  </MoniteScopedProviders>
);

const ProductsTableBase = ({
  onFilterChanged: onChangeFilterCallback,
  onSortChanged: onChangeSortCallback,
  onRowClick,
  onEdit,
  onDeleted,
}: ProductTableProps) => {
  const { i18n } = useLingui();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    useTablePaginationThemeDefaultPageSize()
  );
  const [currentFilter, setCurrentFilter] = useState<FilterType>({});
  const [sortModel, setSortModel] = useState<Array<ProductsTableSortModel>>([]);
  const sortModelItem = sortModel[0];
  const { formatCurrencyToDisplay } = useCurrencies();

  /** Controls the visibility of the deleting dialog */
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<
    ProductServiceResponse | undefined
  >(undefined);

  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'product',
      action: ActionEnum.READ,
      entityUserId: user?.id,
    });
  const { data: isUpdateSupported } = useIsActionAllowed({
    method: 'product',
    action: ActionEnum.UPDATE,
    entityUserId: user?.id,
  });
  const { data: isDeleteSupported } = useIsActionAllowed({
    method: 'product',
    action: ActionEnum.DELETE,
    entityUserId: user?.id,
  });

  const { data: products, isLoading } = useProducts({
    order: sortModelItem
      ? (sortModelItem.sort as unknown as OrderEnum)
      : undefined,
    limit: pageSize,
    type: currentFilter[FILTER_TYPE_TYPE] || undefined,
    paginationToken: currentPaginationToken || undefined,
    sort: sortModelItem
      ? (sortModelItem.field as ProductCursorFields)
      : undefined,
    nameIcontains: currentFilter[FILTER_TYPE_SEARCH] || undefined,
    measureUnitId: currentFilter[FILTER_TYPE_UNITS] || undefined,
  });

  const onChangeFilter = (field: keyof FilterType, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback?.({ field, value });
  };

  const onChangeSort = (m: GridSortModel) => {
    const model = m as Array<ProductsTableSortModel>;
    setSortModel(model);
    setCurrentPaginationToken(null);

    onChangeSortCallback?.(model[0]);
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
          <FiltersComponent onChangeFilter={onChangeFilter} />
        </Box>
        <DataGrid
          autoHeight
          rowSelection={false}
          rows={products?.data || []}
          onRowClick={(params) => {
            onRowClick?.(params.row);
          }}
          columns={[
            {
              field: 'name',
              headerName: t(i18n)`Name, description`,
              flex: 3,
              renderCell: (params) => (
                <Stack spacing={1} width="100%">
                  <Typography variant="caption">{params.row.name}</Typography>
                  <Typography
                    color="secondary"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {params.row.description}
                  </Typography>
                </Stack>
              ),
            },
            {
              field: 'type',
              headerName: t(i18n)`Type`,
              flex: 1,
              sortable: false,
              renderCell: (params) => {
                return params.row.type ? (
                  <ProductType type={params.row.type} />
                ) : null;
              },
            },
            {
              field: 'price',
              headerName: t(i18n)`Price per unit`,
              flex: 1,
              sortable: false,
              align: 'right',
              headerAlign: 'right',
              valueGetter: (params) => {
                const price = params.value as ProductServiceResponse['price'];

                return price
                  ? formatCurrencyToDisplay(price.value, price.currency)
                  : '';
              },
            },
            {
              field: 'measure_unit_id',
              headerName: t(i18n)`Units`,
              flex: 1,
              sortable: false,
              renderCell: (params) => {
                return <MeasureUnit unitId={params.value} />;
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
                  onEdit={() => onEdit?.(params.row)}
                  onDelete={() => {
                    setSelectedProduct(params.row);
                    setIsDeleteDialogOpen(true);
                  }}
                />
              ),
            },
          ]}
          loading={isLoading}
          sortModel={sortModel}
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
                prevPage={products?.prev_pagination_token}
                nextPage={products?.next_pagination_token}
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
        <ProductDeleteModal
          id={selectedProduct?.id}
          open={isDeleteDialogOpen}
          onDeleted={onDeleted}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      </Box>
    </>
  );
};
