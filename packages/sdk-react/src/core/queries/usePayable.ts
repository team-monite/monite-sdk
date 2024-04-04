import { FieldNamesMarkedBoolean } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import {
  LineItem,
  PayableDetailsFormFields,
  prepareLineItemSubmit,
} from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  PartnerApiService,
  PayableResponseSchema,
  PayableUpdateSchema,
  ApiError,
  PayableUploadWithDataSchema,
  LineItemResponse,
} from '@monite/sdk-api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import { useCurrencies } from '../hooks';
import { useEntityListCache, useEntityCache } from './hooks';
import { usePayableLineItemCache } from './usePayableLineItems';

export const PAYABLE_QUERY_ID = 'payable';

export const payableQueryKeys = {
  all: () => [PAYABLE_QUERY_ID],
  list: () => [...payableQueryKeys.all(), 'list'],
  detail: (id?: string) =>
    id
      ? [...payableQueryKeys.all(), 'detail', id]
      : [...payableQueryKeys.all(), 'detail'],
};

export const payablesDefaultQueryConfig = {
  refetchInterval: 15_000,
};

export const usePayableListCache = () =>
  useEntityListCache<PayableResponseSchema>(payableQueryKeys.list);

export const usePayableDetailCache = (id?: string) =>
  useEntityCache<PayableResponseSchema>(() => payableQueryKeys.detail(id));

export const usePayablesList = (
  ...args: Parameters<PartnerApiService['getPayables']>
) => {
  const { monite } = useMoniteContext();

  return useQuery({
    queryKey: [...payableQueryKeys.list(), ...args] as const,

    // TODO use partnerApi because `payables.getList` does not have documentId filter yet
    queryFn: () => monite.api.partnerApi.getPayables(...args),

    ...payablesDefaultQueryConfig,
  });
};

export const usePayableById = (id?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<PayableResponseSchema | undefined, Error>({
    queryKey: payableQueryKeys.detail(id),

    queryFn: () => (id ? monite.api.payable.getById(id) : undefined),

    enabled: !!id,
    ...payablesDefaultQueryConfig,
  });
};

export const useCreatePayableWithLineItems = () => {
  const { i18n } = useLingui();
  const { formatToMinorUnits } = useCurrencies();
  const { monite } = useMoniteContext();
  const { invalidate } = usePayableListCache();
  const { setEntity } = usePayableDetailCache();
  const { removeEntity } = usePayableDetailCache();
  const { invalidate: invalidateLineItems } = usePayableLineItemCache();

  return useMutation<
    PayableResponseSchema,
    ApiError,
    {
      body: PayableUploadWithDataSchema;
      lineItemsToCreate?: LineItem[];
    }
  >({
    mutationFn: async ({ body, lineItemsToCreate }) => {
      let payable = await monite.api!.payable.create(body);

      if (lineItemsToCreate) {
        const lineItemsMutation: Promise<void | LineItemResponse>[] = [];

        lineItemsToCreate?.forEach((lineItem) => {
          if (payable.currency && !lineItem.id) {
            lineItemsMutation.push(
              monite.api.payableLineItems.create(
                payable.id,
                prepareLineItemSubmit(
                  payable.currency,
                  lineItem,
                  formatToMinorUnits
                )
              )
            );
          }
        });

        await Promise.all(lineItemsMutation);
      }

      return monite.api.payable.getById(payable.id);
    },

    onSuccess: (payable) => {
      setEntity(payable);
      invalidate();
      invalidateLineItems(payable.id);
      // destroy cache for new payable form
      removeEntity(payable.id);

      toast.success(t(i18n)`Created`);
    },
  });
};

export const useUpdatePayableByIdWithLineItems = (payableId?: string) => {
  const { i18n } = useLingui();
  const { formatToMinorUnits } = useCurrencies();
  const { monite } = useMoniteContext();
  const { invalidate } = usePayableListCache();
  const { setEntity } = usePayableDetailCache(payableId);
  const { removeEntity } = usePayableDetailCache();
  const { invalidate: invalidateLineItems } = usePayableLineItemCache();

  return useMutation<
    PayableResponseSchema,
    ApiError,
    {
      id: string;
      body: PayableUpdateSchema;
      updatedLineItems?: LineItem[];
      dirtyFields?: FieldNamesMarkedBoolean<PayableDetailsFormFields>;
      lineItems?: LineItemResponse[];
    }
  >({
    mutationFn: async ({
      id,
      body,
      updatedLineItems,
      dirtyFields,
      lineItems,
    }) => {
      let payable = await monite.api!.payable.update(id, body);

      if (updatedLineItems && dirtyFields) {
        const lineItemsMutation: Promise<void | LineItemResponse>[] = [];

        // create line items
        updatedLineItems?.forEach((lineItem) => {
          if (payable.currency && !lineItem.id) {
            lineItemsMutation.push(
              monite.api.payableLineItems.create(
                payable.id,
                prepareLineItemSubmit(
                  payable.currency,
                  lineItem,
                  formatToMinorUnits
                )
              )
            );
          }
        });

        // update line items
        dirtyFields?.lineItems?.forEach(
          ({ id: isIdDirty, ...lineItemsDirtyFields }, index) => {
            const isLineItemDirty = Object.values(lineItemsDirtyFields).some(
              (isFieldDirty) => isFieldDirty
            );
            const lineItemId = updatedLineItems[index]?.id;
            const updatedLineItem = updatedLineItems[index];
            const isLineItemPersistAndUpdated =
              !isIdDirty &&
              Boolean(isLineItemDirty) &&
              Boolean(lineItemId) &&
              Boolean(updatedLineItem);

            if (payable.currency && isLineItemPersistAndUpdated) {
              lineItemsMutation.push(
                monite.api.payableLineItems.update(
                  payable.id,
                  lineItemId,
                  prepareLineItemSubmit(
                    payable.currency,
                    updatedLineItem,
                    formatToMinorUnits
                  )
                )
              );
            }
          }
        );

        // delete line items
        lineItems?.forEach((defaultValue) => {
          const formValue = updatedLineItems?.find(
            (lineItem) => lineItem.id === defaultValue.id
          );

          if (!formValue) {
            lineItemsMutation.push(
              monite.api.payableLineItems.delete(payable.id, defaultValue.id)
            );
          }
        });

        await Promise.all(lineItemsMutation);
      }

      return monite.api.payable.getById(payable.id);
    },

    onSuccess: (payable, args) => {
      setEntity(payable);
      invalidate();
      invalidateLineItems(args.id);
      // destroy cache for new payable form
      removeEntity(payable.id);

      toast.success(t(i18n)`Saved`);
    },
  });
};

export const useSubmitPayableById = (payableId?: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = usePayableListCache();
  const { setEntity } = usePayableDetailCache(payableId);

  return useMutation<PayableResponseSchema, Error, string>({
    mutationFn: (id) => monite.api!.payable.submit(id),

    onSuccess: (payable, id) => {
      setEntity(payable);
      invalidate();

      toast.success(t(i18n)`Submitted`);
    },
  });
};

export const useApprovePayableById = (payableId?: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = usePayableListCache();
  const { setEntity } = usePayableDetailCache(payableId);

  return useMutation<PayableResponseSchema, Error, string>({
    mutationFn: (id) => monite.api.payable.approve(id),

    onSuccess: (payable, id) => {
      setEntity(payable);
      invalidate();

      toast.success(t(i18n)`Approved`);
    },
  });
};

export const useRejectPayableById = (payableId?: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = usePayableListCache();
  const { setEntity } = usePayableDetailCache(payableId);

  return useMutation<PayableResponseSchema, Error, string>({
    mutationFn: (id) => monite.api!.payable.reject(id),

    onSuccess: (payable, id) => {
      setEntity(payable);
      invalidate();

      toast.success(t(i18n)`Rejected`);
    },
  });
};

export const useCancelPayableById = (payableId?: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = usePayableListCache();
  const { setEntity } = usePayableDetailCache(payableId);

  return useMutation<PayableResponseSchema, Error, string>({
    mutationFn: (id) => monite.api!.payable.cancel(id),

    onSuccess: (payable, id) => {
      setEntity(payable);
      invalidate();

      toast.success(t(i18n)`Cancelled`);
    },
  });
};

export const usePayableUpload = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = usePayableListCache();

  return useMutation({
    mutationFn: async (file: File | null | undefined) => {
      if (!file) throw new Error(t(i18n)`File not found`);
      return monite.api.payable.uploadFromFile({ file });
    },

    onSuccess: () => {
      invalidate();
    },

    onError() {}, // Disables global Toast Error Reporter
  });
};

/**
 * Hook to attach a file to a payable.
 * @param payableId
 *
 * @see {@link https://docs.monite.com/reference/post_payables_id_attach_file}
 */
export const useAttachFileToPayable = (payableId: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { setEntity } = usePayableDetailCache(payableId);

  return useMutation({
    mutationFn: async ({ file }: { file: File | null | undefined }) => {
      if (!file) throw new Error(t(i18n)`File not found`);

      return monite.api.payable.attachFile(payableId, { file });
    },

    onSuccess: (payable) => {
      setEntity(payable);
    },
  });
};
