import { ConfigurableDataTable } from '../shared/ConfigurableDataTable';
import { Filters as FiltersComponent } from './Filters';
import { createPurchaseOrderTableConfig } from './config/tableConfig';
import { PURCHASE_ORDER_CONSTANTS } from './constants';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_VENDOR,
} from './consts';
import { PurchaseOrderFilterTypes, PurchaseOrderFilterValue } from './types';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { GridSortDirection, GridSortModel } from '@mui/x-data-grid';
import { useState, useMemo } from 'react';

interface PurchaseOrdersTableProps {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;

  /**
   * The event handler for opening the "Create Purchase Order" dialog.
   *
   * @param {boolean} isOpen - A boolean value indicating whether the dialog should be open (true) or closed (false).
   */
  setIsCreatePurchaseOrderDialogOpen?: (isOpen: boolean) => void;

  /**
   * Triggered when the filtering options are changed
   */
  onChangeFilter?: (filter: {
    field: keyof PurchaseOrderFilterTypes;
    value: PurchaseOrderFilterValue;
  }) => void;
}

export interface PurchaseOrderGridSortModel {
  field: components['schemas']['PurchaseOrderCursorFields'];
  sort: NonNullable<GridSortDirection>;
}

export const PurchaseOrdersTable = ({
  onRowClick,
  setIsCreatePurchaseOrderDialogOpen,
  onChangeFilter: onChangeFilterCallback,
}: PurchaseOrdersTableProps) => {
  const { i18n } = useLingui();
  const { api, locale, componentSettings, entityId } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [pageSize, setPageSize] = useState<number>(
    componentSettings.payables?.pageSizeOptions?.[0] ??
      PURCHASE_ORDER_CONSTANTS.DEFAULT_PAGE_SIZE
  );
  const [sortModel, setSortModel] = useState<PurchaseOrderGridSortModel>({
    field: 'created_at',
    sort: 'desc',
  });
  const [currentFilter, setCurrentFilter] = useState<PurchaseOrderFilterTypes>(
    {}
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'payables_purchase_order',
      action: 'read',
      entityUserId: user?.id,
    });

  const purchaseOrdersQueryParameters = {
    query: {
      sort: sortModel?.field,
      order: sortModel?.sort,
      limit: pageSize,
      pagination_token: currentPaginationToken || undefined,
      status:
        (currentFilter[
          FILTER_TYPE_STATUS
        ] as components['schemas']['PurchaseOrderStatusEnum']) || undefined,
      counterpart_id: currentFilter[FILTER_TYPE_VENDOR] || undefined,
      ...(currentFilter[FILTER_TYPE_SEARCH] && {
        document_id__contains: currentFilter[FILTER_TYPE_SEARCH] as string,
      }),
    },
    header: {
      'x-monite-entity-id': entityId,
    },
  };

  const {
    data: purchaseOrdersData,
    isLoading,
    isError,
    error,
    refetch,
  } = api.payablePurchaseOrders.getPayablePurchaseOrders.useQuery(
    purchaseOrdersQueryParameters
  );

  const purchaseOrders = useMemo(
    () => purchaseOrdersData?.data || [],
    [purchaseOrdersData?.data]
  );

  const tableConfig = useMemo(
    () => createPurchaseOrderTableConfig(i18n, locale, formatCurrencyToDisplay),
    [i18n, locale, formatCurrencyToDisplay]
  );

  const onChangeFilter = (
    field: keyof PurchaseOrderFilterTypes,
    value: PurchaseOrderFilterValue
  ) => {
    setCurrentPaginationToken(null);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback?.({ field, value });
  };

  const onChangeSort = (model: GridSortModel) => {
    setSortModel(model[0] as PurchaseOrderGridSortModel);
    setCurrentPaginationToken(null);
  };

  if (isReadAllowedLoading) {
    return <LoadingPage />;
  }

  if (!isReadAllowed) {
    return <AccessRestriction />;
  }

  const isFiltering = Object.keys(currentFilter).some(
    (key) =>
      currentFilter[key as keyof PurchaseOrderFilterTypes] !== null &&
      currentFilter[key as keyof PurchaseOrderFilterTypes] !== undefined
  );
  const isSearching = !!currentFilter[FILTER_TYPE_SEARCH];

  return (
    <ConfigurableDataTable
      data={purchaseOrders}
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      config={tableConfig}
      nextPage={purchaseOrdersData?.next_pagination_token}
      prevPage={purchaseOrdersData?.prev_pagination_token}
      currentPage={currentPaginationToken}
      pageSize={pageSize}
      onPaginationChange={({ page, pageSize }) => {
        setPageSize(pageSize);
        setCurrentPaginationToken(page);
      }}
      onSortChange={onChangeSort}
      onRowClick={onRowClick}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      filters={<FiltersComponent onChangeFilter={onChangeFilter} />}
      isFiltering={isFiltering}
      isSearching={isSearching}
      noDataTitle={t(i18n)`No purchase orders yet`}
      noDataDescription1={t(i18n)`You don't have any purchase orders yet`}
      noDataDescription2={t(
        i18n
      )`Create your first purchase order to get started`}
      filterTitle={t(i18n)`No purchase orders found`}
      actionButtonLabel={
        !isFiltering && !isSearching
          ? t(i18n)`Create Purchase Order`
          : undefined
      }
      actionOptions={
        !isFiltering && !isSearching
          ? [t(i18n)`Create Purchase Order`]
          : undefined
      }
      onCreate={(type) => {
        if (
          type === t(i18n)`Create Purchase Order` ||
          type === 'Create Purchase Order'
        ) {
          setIsCreatePurchaseOrderDialogOpen?.(true);
        }
      }}
      entityName={t(i18n)`Purchase Order`}
      isReadAllowed={isReadAllowed}
      isReadAllowedLoading={isReadAllowedLoading}
      className="Monite-PurchaseOrdersTable"
      pageSizeOptions={componentSettings.payables?.pageSizeOptions}
    />
  );
};
