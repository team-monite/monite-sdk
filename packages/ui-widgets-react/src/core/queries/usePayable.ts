import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import {
  PayableResponseSchema,
  PayableUpdateSchema,
  PartnerApiService,
  package__payables__schemas__PaginationResponse,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { useEntityListCache } from './hooks';

export const PAYABLE_QUERY_ID = 'payable';

export const usePayableListCache = () =>
  useEntityListCache<PayableResponseSchema>(() => [PAYABLE_QUERY_ID]);

export const usePayable = (
  ...args: Parameters<PartnerApiService['getPayables']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<package__payables__schemas__PaginationResponse, Error>(
    [PAYABLE_QUERY_ID],
    () =>
      // TODO use partnerApi because `payables.getList` does not have documentId filter yet
      monite.api!.partnerApi.getPayables(...args)
  );
};

export const usePayableById = (id?: string) => {
  const { monite } = useComponentsContext();

  return useQuery<PayableResponseSchema | undefined, Error>(
    [PAYABLE_QUERY_ID, { id }],
    () => (id ? monite.api!.payable.getById(id) : undefined),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useUpdatePayableById = (id: string) => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();
  const { invalidate } = usePayableListCache();

  return useMutation<PayableResponseSchema, Error, PayableUpdateSchema>(
    (body) => monite.api!.payable.update(id, body),
    {
      onSuccess: (payable) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
        invalidate();
        toast.success('Saved');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useSubmitPayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();
  const { invalidate } = usePayableListCache();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.submit(id),
    {
      onSuccess: (payable, id) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
        invalidate();
        toast.success('Submitted');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useApprovePayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();
  const { invalidate } = usePayableListCache();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.approve(id),
    {
      onSuccess: (payable, id) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
        invalidate();
        toast.success('Approved');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useRejectPayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();
  const { invalidate } = usePayableListCache();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.reject(id),
    {
      onSuccess: (payable, id) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
        invalidate();
        toast.success('Rejected');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCancelPayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();
  const { invalidate } = usePayableListCache();

  return useMutation<PayableResponseSchema, Error, string>(
    (id) => monite.api!.payable.cancel(id),
    {
      onSuccess: (payable, id) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
        invalidate();
        toast.success('Canceled');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const usePayPayableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();
  const { invalidate } = usePayableListCache();

  return useMutation<PayableResponseSchema, Error, string>(
    [PAYABLE_QUERY_ID],
    (id) => monite.api!.payable.pay(id),
    {
      onSuccess: (payable, id) => {
        queryClient.setQueryData([PAYABLE_QUERY_ID, { id }], payable);
        invalidate();
        toast.success('Paid');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
