'use client';

import toast from 'react-hot-toast';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ApiError,
  ProductServicePaginationResponse,
  ProductServiceRequest,
  ProductServiceResponse,
  ProductsServiceGetAllRequest,
} from '@monite/sdk-api';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import { useEntityListCache } from './hooks';

const PRODUCT_QUERY_ID = 'product';
const PRODUCT_INFINITE_QUERY_ID = 'product-infinite';

const productQueryKeys = {
  all: () => [PRODUCT_QUERY_ID],
  allInfinite: () => [PRODUCT_INFINITE_QUERY_ID],
  detail: (id: string) => [...productQueryKeys.all(), 'detail', id],
};

const useProductListCache = () => {
  /**
   * We have two caches for the product list:
   * - One for the regular list
   * - One for the infinite list
   * We need to invalidate both when we create/update/delete a product.
   */
  const listCaches = [
    useEntityListCache<ProductServiceResponse>(productQueryKeys.all),
    useEntityListCache<ProductServiceResponse>(productQueryKeys.allInfinite),
  ];

  return {
    invalidate: () => listCaches.forEach((cache) => cache.invalidate()),
  };
};

export const useProducts = (
  params: ProductsServiceGetAllRequest,
  options?: {
    /** Should we enable the request or not? */
    enabled: boolean;
  }
) => {
  const { monite } = useMoniteContext();

  return useQuery<ProductServicePaginationResponse, Error>({
    queryKey: [...productQueryKeys.all(), params],

    queryFn: () => monite.api.products.getAll(params),

    enabled: options?.enabled,
  });
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

export const useCreateProduct = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useProductListCache();

  return useMutation<ProductServiceResponse, Error, ProductServiceRequest>({
    mutationFn: (params) => monite.api.products.createProduct(params),

    onSuccess: (product) => {
      invalidate();
      toast.success(t(i18n)`Product ${product.name} was created.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to create product.`);
    },
  });
};

export const useUpdateProduct = (productId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useProductListCache();

  return useMutation<ProductServiceResponse, Error, ProductServiceRequest>({
    mutationFn: (params) => monite.api.products.updateById(productId, params),

    onSuccess: (product) => {
      invalidate();
      toast.success(t(i18n)`Product ${product.name} was updated.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to update product.`);
    },
  });
};

export const useDeleteProduct = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useProductListCache();

  return useMutation<void, Error, string>({
    mutationFn: (params) => monite.api.products.deleteById(params),

    onSuccess: () => {
      invalidate();
      toast.success(t(i18n)`Product was deleted.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to delete product.`);
    },
  });
};
