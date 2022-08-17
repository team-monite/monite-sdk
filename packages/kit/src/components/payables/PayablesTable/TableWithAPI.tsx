import React, { useEffect, useState } from 'react';
import {
  api__v1__payables__pagination__CursorFields,
  OrderEnum,
  ReceivableResponse,
} from '@monite/js-sdk';

import { useComponentsContext } from '../../../core/context/ComponentsContext';
import Table from './Table';
import { PaginationTokens, Sort } from './types';
import { MONITE_ENTITY_ID, PAGE_LIMIT } from '../../../constants';

const PayablesTableWithAPI = () => {
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
  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const res = await monite.api!.partnerApi.getPayables(
        MONITE_ENTITY_ID,
        currentSort ? currentSort.order : undefined,
        PAGE_LIMIT,
        currentPaginationToken || undefined,
        currentSort ? currentSort.sort : undefined
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
  }, [monite, currentSort, currentPaginationToken]);

  const onPrev = () =>
    paginationTokens.prev_pagination_token &&
    setCurrentPaginationToken(paginationTokens.prev_pagination_token);

  const onNext = () =>
    paginationTokens.next_pagination_token &&
    setCurrentPaginationToken(paginationTokens.next_pagination_token);

  const onChangeSort = (
    sort: api__v1__payables__pagination__CursorFields,
    order: OrderEnum | null
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

  return (
    <Table
      loading={isLoading}
      data={data}
      onPrev={onPrev}
      onNext={onNext}
      paginationTokens={paginationTokens}
      onChangeSort={onChangeSort}
      currentSort={currentSort}
    />
  );
};

export default PayablesTableWithAPI;
