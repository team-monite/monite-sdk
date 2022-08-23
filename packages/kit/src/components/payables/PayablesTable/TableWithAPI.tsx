import React, { useEffect, useState } from 'react';
import { formatISO, addDays } from 'date-fns';
import {
  api__v1__payables__pagination__CursorFields,
  ReceivableResponse,
  OrderEnum,
} from '@monite/js-sdk';
import { SortOrderEnum } from '@monite/ui';

import { useComponentsContext } from '../../../core/context/ComponentsContext';
import Table from './Table';
import { PaginationTokens, Sort, Filters, FilterValue } from './types';
import { MONITE_ENTITY_ID, PAGE_LIMIT } from '../../../constants';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_STATUS,
} from './consts';
const PayablesTableWithAPI = () => {
  const { monite } = useComponentsContext() || {};
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = useState<ReceivableResponse[]>([]);
  const [paginationTokens, setPaginationTokens] = useState<PaginationTokens>({
    next_pagination_token: null,
    prev_pagination_token: null,
  });
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | null
  >(null);
  const [currentSort, setCurrentSort] = useState<Sort | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filters>({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      // TODO request fires multiple times when component mounts
      const res = await monite.api!.partnerApi.getPayables(
        MONITE_ENTITY_ID,
        currentSort ? (currentSort.order as unknown as OrderEnum) : undefined,
        PAGE_LIMIT,
        currentPaginationToken || undefined,
        currentSort ? currentSort.sort : undefined,
        undefined,
        undefined,
        // HACK: api filter parameter 'created_at' requires full match with seconds. Could not be used
        currentFilter[FILTER_TYPE_CREATED_AT]
          ? formatISO(addDays(currentFilter[FILTER_TYPE_CREATED_AT] as Date, 1))
          : undefined,
        currentFilter[FILTER_TYPE_CREATED_AT]
          ? formatISO(currentFilter[FILTER_TYPE_CREATED_AT] as Date)
          : undefined,
        undefined,
        currentFilter[FILTER_TYPE_STATUS] || undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        currentFilter[FILTER_TYPE_DUE_DATE]
          ? formatISO(currentFilter[FILTER_TYPE_DUE_DATE] as Date)
          : undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        currentFilter[FILTER_TYPE_SEARCH] || undefined
      );

      setData(
        (Array.isArray(res?.data) ? res.data : []).filter((row) => row.id)
      );
      setPaginationTokens({
        next_pagination_token: res.next_pagination_token,
        prev_pagination_token: res.prev_pagination_token,
      });
      setIsLoading(false);
    })();
  }, [monite, currentSort, currentPaginationToken, currentFilter]);

  const onPrev = () =>
    paginationTokens.prev_pagination_token &&
    setCurrentPaginationToken(paginationTokens.prev_pagination_token);

  const onNext = () =>
    paginationTokens.next_pagination_token &&
    setCurrentPaginationToken(paginationTokens.next_pagination_token);

  const onChangeSort = (
    sort: api__v1__payables__pagination__CursorFields,
    order: SortOrderEnum | null
  ) => {
    if (order) {
      setCurrentSort({
        sort,
        order,
      });
    } else if (currentSort?.sort === sort && order === null) {
      setCurrentSort(null);
    }
  };

  const onChangeFilter = (field: keyof Filters, value: FilterValue) => {
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value === 'all' ? null : value,
    }));
  };

  return (
    <Table
      loading={isLoading}
      data={data}
      onPrev={onPrev}
      onNext={onNext}
      paginationTokens={paginationTokens}
      onChangeSort={onChangeSort}
      currentSort={currentSort}
      onChangeFilter={onChangeFilter}
    />
  );
};

export default PayablesTableWithAPI;
