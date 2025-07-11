import { useMemo, useState } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { ProductDeleteModal } from '@/components/products/ProductDeleteModal';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { GetNoRowsOverlay } from '@/ui/DataGridEmptyState/GetNoRowsOverlay';
import { LoadingPage } from '@/ui/loadingPage';
import { MeasureUnit } from '@/ui/MeasureUnit/MeasureUnit';
import { TablePagination } from '@/ui/table/TablePagination';
import { hasSelectedText } from '@/utils/text-selection';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { GridSortDirection } from '@mui/x-data-grid/models/gridSortModel';

import { ProductType } from '../ProductDetails/components/ProductType';
import { Filters as FiltersComponent } from './components/Filters/Filters';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_UNITS,
} from './consts';
import { Filters as FilterType, FilterValue } from './types';

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

  /**
   * The event handler open create modal
   * Triggers when the user click on the create new button for no data state
   */
  openCreateModal?: () => void;
}

interface ProductsTableSortModel {
  field: ProductCursorFields;
  sort: NonNullable<GridSortDirection>;
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

  onDeleted,
  openCreateModal,
}: ProductTableProps) => {
  const { i18n } = useLingui();
  const { api, componentSettings } = useMoniteContext();
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    componentSettings.products.pageSizeOptions[0]
  );
  const [currentFilter, setCurrentFilter] = useState<FilterType>({});
  const [sortModel, setSortModel] = useState<
    ProductsTableSortModel | undefined
  >();
  const { formatCurrencyToDisplay } = useCurrencies();

  /** Controls the visibility of the deleting dialog */
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadSupported, isLoading: isReadSupportedLoading } =
    useIsActionAllowed({
      method: 'product',
      action: 'read',
      entityUserId: user?.id,
    });

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = api.products.getProducts.useQuery({
    query: {
      sort: sortModel?.field,
      order: sortModel?.sort,
      limit: pageSize,
      type: currentFilter[FILTER_TYPE_TYPE] || undefined,
      pagination_token: currentPaginationToken || undefined,
      name__icontains: currentFilter[FILTER_TYPE_SEARCH] || undefined,
      measure_unit_id: currentFilter[FILTER_TYPE_UNITS] || undefined,
    },
  });

  const onChangeFilter = (field: keyof FilterType, value: FilterValue) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback?.({ field, value });
  };

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as ProductsTableSortModel);
    setCurrentPaginationToken(null);

    onChangeSortCallback?.(model[0] as ProductsTableSortModel);
  };

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: 'name',
        headerName: t(i18n)`Name & description`,
        display: 'flex',
        flex: 3,
        renderCell: (params) => (
          <Typography variant="body1">{params.row.name}</Typography>
        ),
      },
      {
        field: 'type',
        headerName: t(i18n)`Type`,
        display: 'flex',
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          return params.row.type ? (
            <ProductType type={params.row.type} />
          ) : null;
        },
      },
      {
        field: 'measure_unit_id',
        headerName: t(i18n)`Unit`,
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          return <MeasureUnit unitId={params.value} />;
        },
      },
      {
        field: 'price',
        headerName: t(i18n)`Price per unit`,
        headerAlign: 'right',
        align: 'right',
        flex: 1,
        sortable: false,
        valueGetter: (value: ProductServiceResponse['price']) => {
          const price = value;

          return price
            ? formatCurrencyToDisplay(price.value, price.currency)
            : '';
        },
      },
      // {
      //   field: 'actions',
      //   sortable: false,
      //   headerName: '',
      //   width: 70,
      //   renderCell: (params) => (
      //     <TableActions
      //       permissions={{
      //         isUpdateAllowed: isUpdateSupported,
      //         isDeleteAllowed: isDeleteSupported,
      //       }}
      //       onEdit={() => onEdit?.(params.row)}
      //       onDelete={() => {
      //         setIsDeleteDialogOpen({
      //           id: params.row.id,
      //           open: true,
      //         });
      //       }}
      //     />
      //   ),
      // },
    ];
  }, [formatCurrencyToDisplay, i18n]);

  if (isReadSupportedLoading) {
    return <LoadingPage />;
  }

  if (!isReadSupported) {
    return <AccessRestriction />;
  }

  const isFiltering = Object.keys(currentFilter).some(
    (key) =>
      currentFilter[key as keyof FilterType] !== null &&
      currentFilter[key as keyof FilterType] !== undefined
  );
  const isSearching = !!currentFilter[FILTER_TYPE_SEARCH];

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
      <FiltersComponent onChangeFilter={onChangeFilter} sx={{ mb: 2 }} />
      <DataGrid
        initialState={{
          sorting: {
            sortModel: sortModel && [sortModel],
          },
        }}
        rowSelection={false}
        disableColumnFilter={true}
        rows={products?.data || []}
        onSortModelChange={onChangeSort}
        onRowClick={(params) => {
          if (!hasSelectedText()) {
            onRowClick?.(params.row);
          }
        }}
        columns={columns}
        loading={isLoading}
        slots={{
          pagination: () => (
            <TablePagination
              pageSizeOptions={componentSettings.products.pageSizeOptions}
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
          noRowsOverlay: () => (
            <GetNoRowsOverlay
              isLoading={isLoading}
              dataLength={products?.data.length || 0}
              isFiltering={isFiltering}
              isSearching={isSearching}
              isError={isError}
              onCreate={openCreateModal}
              refetch={refetch}
              filterTitle={t(i18n)`No product or service found`}
              filterDescription1={t(
                i18n
              )`Try adjusting your search or filter criteria`}
              filterDescription2={null}
              entityName={t(i18n)`products or services`}
              actionButtonLabel={t(i18n)`Create new`}
              actionOptions={[t(i18n)`Product`]}
              noDataTitle={t(i18n)`No products or services yet`}
              noDataDescription1={t(
                i18n
              )`You don’t have any products or services yet`}
              noDataDescription2={t(i18n)`Create your first product or service`}
              type="no-data"
            />
          ),
        }}
      />
      {isDeleteDialogOpen.id && (
        <ProductDeleteModal
          id={isDeleteDialogOpen.id}
          open={isDeleteDialogOpen.open}
          onDeleted={onDeleted}
          onClose={() =>
            setIsDeleteDialogOpen((prev) => ({
              ...prev,
              open: false,
            }))
          }
        />
      )}
    </Box>
  );
};

type ProductServiceResponse = components['schemas']['ProductServiceResponse'];
type ProductCursorFields = components['schemas']['ProductCursorFields'];
