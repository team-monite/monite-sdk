import {
  ApiError,
  ProductServicePaginationResponse,
  ProductServiceResponse,
  ProductsServiceGetAllRequest,
} from '@monite/sdk-api';
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const PRODUCT_QUERY_ID = 'product';
const PRODUCT_INFINITE_QUERY_ID = 'product-infinite';

const productQueryKeys = {
  all: () => [PRODUCT_QUERY_ID],
  allInfinite: () => [PRODUCT_INFINITE_QUERY_ID],
  detail: (id: string) => [...productQueryKeys.all(), 'detail', id],
};

export const useInfiniteProducts = (
  params: ProductsServiceGetAllRequest,
  options?: {
    /** Should we enable the request or not? */
    enabled: boolean;
  }
) => {
  const { monite } = useMoniteContext();

  return useInfiniteQuery<
    ProductServicePaginationResponse,
    ApiError,
    InfiniteData<ProductServicePaginationResponse, unknown>,
    (string | ProductsServiceGetAllRequest)[],
    string
  >({
    queryKey: [...productQueryKeys.allInfinite(), params],
    queryFn: ({ pageParam }) => {
      return monite.api.products.getAll({
        ...params,
        paginationToken: pageParam,
      });
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_pagination_token,
    enabled: options?.enabled ?? true,
  });
};

export const useProductById = (id?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<ProductServiceResponse | undefined, Error>({
    queryKey: productQueryKeys.detail(id!),

    queryFn: () => (id ? monite.api.products.getById(id) : undefined),

    enabled: !!id,
  });
};
