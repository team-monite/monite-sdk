import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  ReceivableService,
  PaginationResponse,
  ReceivableResponse,
  ReceivablesReceivablesReceivablesPaymentTermsListResponse,
  ProductServiceReceivablesPaginationResponse,
} from '@team-monite/sdk-api';

import { useComponentsContext } from '../context/ComponentsContext';

const RECEIVABLE_QUERY_ID = 'receivable';
const PAYMENT_TERM_ID = 'paymentTerm';
const PRODUCT_ID = 'product';

export const useReceivables = (
  ...args: Parameters<ReceivableService['getAllReceivables']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<PaginationResponse, Error>(
    [RECEIVABLE_QUERY_ID, { variables: args }],
    () => monite.api!.receivable.getAllReceivables(...args)
  );
};

export const usePaymentTerms = (
  ...args: Parameters<ReceivableService['getItemsV1PaymentTermsGet']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<
    ReceivablesReceivablesReceivablesPaymentTermsListResponse,
    Error
  >([PAYMENT_TERM_ID, { variables: args }], () =>
    monite.api!.receivable.getItemsV1PaymentTermsGet(...args)
  );
};

export const useProducts = (
  ...args: Parameters<ReceivableService['getProductsV1ProductsGet']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<ProductServiceReceivablesPaginationResponse, Error>(
    [PRODUCT_ID, { variables: args }],
    () => monite.api!.receivable.getProductsV1ProductsGet(...args)
  );
};

export const useReceivableById = (id?: string) => {
  const { monite } = useComponentsContext();

  return useQuery<ReceivableResponse | undefined, Error>(
    [RECEIVABLE_QUERY_ID, { id }],
    () => (id ? monite.api!.receivable.getById(id) : undefined),
    {
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!id,
    }
  );
};
