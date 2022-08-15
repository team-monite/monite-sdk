import React, { useState, useEffect } from 'react';
import { ReceivableResponse } from '@monite/js-sdk';

import { useComponentsContext } from '../../../core/context/ComponentsContext';
import Table from './Table';
import { PaginationTokens } from './types';

const PayablesTableWithAPI = () => {
  const [data, setData] = useState<ReceivableResponse[]>([]);
  const [paginationTokens, setPaginationTokens] = useState<PaginationTokens>({
    next_pagination_token: null,
    prev_pagination_token: null,
  });
  const [currentPaginationToken, setCurrentPaginationToken] = useState<
    string | undefined
  >(undefined);

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      const res = await monite.api!.payables.getList(
        undefined,
        10,
        currentPaginationToken
      );
      setData(
        (Array.isArray(res?.data) ? res.data : []).filter((row) => row.id)
      );

      setPaginationTokens({
        next_pagination_token: res.next_pagination_token,
        prev_pagination_token: res.prev_pagination_token,
      });
    })();
  }, [monite, currentPaginationToken]);

  const onPrev = () =>
    paginationTokens.prev_pagination_token &&
    setCurrentPaginationToken(paginationTokens.prev_pagination_token);

  const onNext = () =>
    paginationTokens.next_pagination_token &&
    setCurrentPaginationToken(paginationTokens.next_pagination_token);

  return (
    <Table
      data={data}
      onPrev={onPrev}
      onNext={onNext}
      paginationTokens={paginationTokens}
    />
  );
};

export default PayablesTableWithAPI;
