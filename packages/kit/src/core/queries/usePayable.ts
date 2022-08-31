import { useQuery, useQueryClient, useMutation } from 'react-query';
import { PayableResponseSchema, PayableUpdateSchema } from '@monite/js-sdk';
import payableMock from 'components/payables/fixtures/getById';
import { useComponentsContext } from '../context/ComponentsContext';

const PAYABLE_QUERY_ID = 'payable';

export const usePayableById = (id: string, debug?: boolean) => {
  const { monite } = useComponentsContext();

  return useQuery<PayableResponseSchema, Error>([PAYABLE_QUERY_ID, id], () =>
    debug ? payableMock : monite.api!.payable.getById(id)
  );
};

export const useUpdatePayableById = (id: string) => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, PayableUpdateSchema>(
    (body) => monite.api!.payable.update(id, body),
    {
      onSuccess: () => queryClient.invalidateQueries([PAYABLE_QUERY_ID, id]),
    }
  );
};

export const useSubmitPayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.submit(id),
    {
      onSuccess: () => queryClient.invalidateQueries([PAYABLE_QUERY_ID]),
    }
  );
};

export const useApprovePayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.approve(id),
    {
      onSuccess: () => queryClient.invalidateQueries([PAYABLE_QUERY_ID]),
    }
  );
};

export const useRejectPayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.reject(id),
    {
      onSuccess: () => queryClient.invalidateQueries([PAYABLE_QUERY_ID]),
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
