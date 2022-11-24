import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  ReceivableService,
  PaginationResponse,
  ReceivableResponse,
  ReceivablesReceivablesReceivablesPaymentTermsListResponse,
  ProductServiceReceivablesPaginationResponse,
  ReceivablesReceivablesCounterpartBankAccountsResponse,
  ReceivablesReceivableFacadeCreatePayload,
  ReceivablesUnitListResponse,
} from '@team-monite/sdk-api';

import { useComponentsContext } from '../context/ComponentsContext';

const RECEIVABLE_QUERY_ID = 'receivable';
const COUNTERPART_BANK_ACCOUNT_QUERY_ID = 'counterpartBankAccount';
const PAYMENT_TERM_QUERY_ID = 'paymentTerm';
const PRODUCT_QUERY_ID = 'product';
const MEASURE_UNITS_ID = 'product';

export const useReceivables = (
  ...args: Parameters<ReceivableService['getAllReceivables']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<PaginationResponse, Error>(
    [RECEIVABLE_QUERY_ID, { variables: args }],
    () => monite.api!.receivable.getAllReceivables(...args)
  );
};

export const useCreateReceivable = () => {
  const { monite, t } = useComponentsContext();

  return useMutation<
    ReceivableResponse,
    Error,
    ReceivablesReceivableFacadeCreatePayload
  >(
    (payload) =>
      monite.api!.receivable.createNewReceivableV1ReceivablesPost(
        monite.entityId,
        payload
      ),
    {
      onSuccess: (receivable) => {
        toast.success(
          t('receivables:notifications.createSuccess', {
            name: receivable.counterpart_name,
          })
        );
      },
      onError: () => {
        toast.error(t('receivables:notifications.createError'));
      },
    }
  );
};

export const useCounterpartBankAccounts = (
  enabled: boolean,
  ...args: Parameters<
    ReceivableService['getCounterpartsBankAccountsV1CounterpartsCounterpartIdBankAccountsGet']
  >
) => {
  const { monite } = useComponentsContext();

  return useQuery<ReceivablesReceivablesCounterpartBankAccountsResponse, Error>(
    [COUNTERPART_BANK_ACCOUNT_QUERY_ID, { variables: args }],
    () =>
      monite.api!.receivable.getCounterpartsBankAccountsV1CounterpartsCounterpartIdBankAccountsGet(
        ...args
      ),
    {
      enabled,
    }
  );
};

export const usePaymentTerms = (
  ...args: Parameters<ReceivableService['getItemsV1PaymentTermsGet']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<
    ReceivablesReceivablesReceivablesPaymentTermsListResponse,
    Error
  >([PAYMENT_TERM_QUERY_ID, { variables: args }], () =>
    monite.api!.receivable.getItemsV1PaymentTermsGet(...args)
  );
};

export const useProducts = (
  ...args: Parameters<ReceivableService['getProductsV1ProductsGet']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<ProductServiceReceivablesPaginationResponse, Error>(
    [PRODUCT_QUERY_ID, { variables: args }],
    () => monite.api!.receivable.getProductsV1ProductsGet(...args)
  );
};

export const useMeasureUnits = (
  ...args: Parameters<ReceivableService['getUnitsV1MeasureUnitsGet']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<ReceivablesUnitListResponse, Error>(
    [MEASURE_UNITS_ID, { variables: args }],
    () => monite.api!.receivable.getUnitsV1MeasureUnitsGet(...args)
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
