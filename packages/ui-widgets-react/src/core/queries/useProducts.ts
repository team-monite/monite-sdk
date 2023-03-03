import {
  ProductServicePaginationResponse,
  ProductsService,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { useInfiniteQuery } from 'react-query';

const PRODUCT_QUERY_ID = 'product';

export const useProducts = (
  ...args: Parameters<ProductsService['getProducts']>
) => {
  const { monite } = useComponentsContext();

  return useInfiniteQuery<ProductServicePaginationResponse, Error>(
    [PRODUCT_QUERY_ID, { variables: args }],
    ({ pageParam }) => {
      args[2] = pageParam;
      return monite.api.products.getProducts(...args);
    },
    {
      getNextPageParam: (res) => {
        return res.next_pagination_token;
      },
    }
  );
};
