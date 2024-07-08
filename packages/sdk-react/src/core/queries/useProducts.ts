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

const productQueryKeys = {
  all: () => [PRODUCT_QUERY_ID],
  detail: (id: string) => [...productQueryKeys.all(), 'detail', id],
};

export const useProductById = (id?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<ProductServiceResponse | undefined, Error>({
    queryKey: productQueryKeys.detail(id!),

    queryFn: () => (id ? monite.api.products.getById(id) : undefined),

    enabled: !!id,
  });
};
