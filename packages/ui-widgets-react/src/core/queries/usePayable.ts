import { useQuery, useQueryClient, useMutation } from 'react-query';
import {
  PayableResponseSchema,
  PayableUpdateSchema,
  PartnerApiService,
  PaginationResponse,
} from '@monite/sdk-api';
import payableMock from 'components/payables/fixtures/getById';
import { useComponentsContext } from '../context/ComponentsContext';

const PAYABLE_QUERY_ID = 'payable';

export const usePayable = (
  ...args: Parameters<PartnerApiService['getPayables']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<PaginationResponse, Error>([PAYABLE_QUERY_ID], () =>
    // TODO use partnerApi because `payables.getList` does not have documentId filter yet
    monite.api!.partnerApi.getPayables(...args)
  );
};

export const usePayableById = (id: string, debug?: boolean) => {
  const { monite } = useComponentsContext();

  return useQuery<PayableResponseSchema, Error>(
    [PAYABLE_QUERY_ID, { id }],
    () => (debug ? payableMock : monite.api!.payable.getById(id))
  );
};

export const useUpdatePayableById = (id: string) => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, PayableUpdateSchema>(
    (body) => monite.api!.payable.update(id, body),
    {
      onSuccess: (payable) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
      },
    }
  );
};

export const useSubmitPayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.submit(id),
    {
      onSuccess: (payable, id) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
      },
    }
  );
};

export const useApprovePayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.approve(id),
    {
      onSuccess: (payable, id) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
      },
    }
  );
};

export const useRejectPayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.reject(id),
    {
      onSuccess: (payable, id) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
      },
    }
  );
};

export const usePayPayableById = () => {
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, string>(
    [PAYABLE_QUERY_ID],
    (id) => monite.api!.payable.pay(id)
  );
};
