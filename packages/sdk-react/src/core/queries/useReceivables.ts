import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { ExistingReceivableDetailsProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ApiError,
  CreditNoteResponsePayload,
  CreditNoteStateEnum,
  InvoiceResponsePayload,
  QuoteResponsePayload,
  QuoteStateEnum,
  ReceivableFacadeCreatePayload,
  ReceivableFileUrl,
  ReceivablePaginationResponse,
  ReceivableResponse,
  ReceivableSendRequest,
  ReceivableSendResponse,
  ReceivableService,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import { useEntityListCache } from './hooks';

const receivablesQueryKeys = {
  all: () => ['receivable'],
  pdf: (id: string) => [...receivablesQueryKeys.all(), 'detail', id, 'pdf'],
  detail: (id: string) => [...receivablesQueryKeys.all(), 'detail', id],
};

export const receivablesDefaultQueryConfig = {
  refetchInterval: 15_000,
};

function exhaustiveMatchingGuard(_: never): never {
  throw new Error('Should not have reached here');
}

const useReceivableListCache = () =>
  useEntityListCache<ReceivableResponse>(receivablesQueryKeys.all);

export const useReceivables = (
  ...args: Parameters<ReceivableService['getAllReceivables']>
) => {
  const { monite } = useMoniteContext();

  return useQuery<ReceivablePaginationResponse, Error>({
    queryKey: [...receivablesQueryKeys.all(), { variables: args }],

    queryFn: () => monite.api.receivable.getAllReceivables(...args),
    ...receivablesDefaultQueryConfig,
  });
};

export const useCreateReceivable = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useReceivableListCache();

  return useMutation<ReceivableResponse, Error, ReceivableFacadeCreatePayload>({
    mutationFn: (payload) => monite.api.receivable.createNewReceivable(payload),

    onSuccess: (receivable) => {
      invalidate();
      if (receivable.counterpart_name) {
        toast.success(
          t(i18n)`Invoice to “${receivable.counterpart_name}” was created`
        );

        return;
      }

      toast.success(t(i18n)`Invoice with id “${receivable.id}” was created`);
    },
  });
};

/**
 * Fetches receivable by provided `id`
 *
 * @see {@link https://docs.monite.com/reference/get_receivables_id} Monite backend call API
 */
export const useReceivableById = (receivableId: string) => {
  const { monite } = useMoniteContext();

  return useQuery<ReceivableResponse | undefined, ApiError>({
    queryKey: receivablesQueryKeys.detail(receivableId),

    queryFn: () => monite.api.receivable.getById(receivableId),

    ...receivablesDefaultQueryConfig,
  });
};

/**
 * Marks receivable as issued by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_issue} Monite backend call API
 */
export const useIssueReceivableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useMoniteContext();
  const { invalidate } = useReceivableListCache();
  const { i18n } = useLingui();

  return useMutation<ReceivableResponse, ApiError, string>({
    mutationFn: (receivableId) => monite.api.receivable.issueById(receivableId),

    onSuccess: (receivable, id) => {
      queryClient.setQueryData(receivablesQueryKeys.detail(id), receivable);
      invalidate();

      toast.success(t(i18n)`Issued`);
    },
    onError: (error) => {
      toast.error(error.body.error.message || error.message);
    },
  });
};

/**
 * Marks receivable as deleted by provided id
 *
 * @see {@link https://docs.monite.com/reference/delete_receivables_id} Monite backend call API
 */
export const useDeleteReceivableById = () => {
  const { i18n } = useLingui();
  const queryClient = useQueryClient();
  const { monite } = useMoniteContext();
  const { remove } = useReceivableListCache();

  return useMutation<void, ApiError, string>({
    mutationFn: (id) => monite.api.receivable.deleteById(id),

    onSuccess: (_, receivableId) => {
      /** Update current receivable status */
      queryClient.setQueryData<ReceivableResponse>(
        receivablesQueryKeys.detail(receivableId),
        (currentReceivable) => {
          if (!currentReceivable) {
            return undefined;
          }

          switch (currentReceivable.type) {
            case CreditNoteResponsePayload.type.CREDIT_NOTE: {
              return {
                ...currentReceivable,
                status: CreditNoteStateEnum.DELETED,
              };
            }

            case QuoteResponsePayload.type.QUOTE: {
              return {
                ...currentReceivable,
                status: QuoteStateEnum.DELETED,
              };
            }

            case InvoiceResponsePayload.type.INVOICE: {
              return {
                ...currentReceivable,
                status: ReceivablesStatusEnum.DELETED,
              };
            }
          }
        }
      );
      remove(receivableId);

      toast.success(t(i18n)`Receivable was deleted`);
    },

    onError: (error) => {
      toast.error(error.body.error.message || error.message);
    },
  });
};

/**
 * Marks receivable as canceled by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_cancel} Monite backend call API
 */
export const useCancelReceivableById = () => {
  const { i18n } = useLingui();
  const queryClient = useQueryClient();
  const { monite } = useMoniteContext();
  const { invalidate } = useReceivableListCache();

  return useMutation<void, ApiError, string>({
    mutationFn: (id) => monite.api.receivable.cancelById(id),

    onSuccess: (_, receivableId) => {
      /** Update current receivable status */
      queryClient.setQueryData<InvoiceResponsePayload>(
        receivablesQueryKeys.detail(receivableId),
        (currentReceivable) => {
          if (!currentReceivable) {
            return undefined;
          }

          return {
            ...currentReceivable,
            status: ReceivablesStatusEnum.CANCELED,
          };
        }
      );

      invalidate();

      toast.success(t(i18n)`Canceled`);
    },

    onError: (error) => {
      toast.error(error.body.error.message || error.message);
    },
  });
};

/**
 * Marks receivable as uncollectible by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_mark_as_uncollectible} Monite backend call API
 */
export const useMarkAsUncollectibleReceivableById = () => {
  const queryClient = useQueryClient();
  const { monite } = useMoniteContext();
  const { invalidate } = useReceivableListCache();
  const { i18n } = useLingui();

  return useMutation<ReceivableResponse, ApiError, string>({
    mutationFn: (id) => monite.api.receivable.markAsUncollectibleById(id),

    onSuccess: (receivable, id) => {
      queryClient.setQueryData(receivablesQueryKeys.detail(id), receivable);
      invalidate();

      toast.success(t(i18n)`Marked as uncollectible`);
    },

    onError: (error) => {
      toast.error(error.body.error.message || error.message);
    },
  });
};

/**
 * Issue an invoice and send PDF with an email
 *  to the counterpart
 */
export const useSendReceivableById = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useReceivableListCache();

  return useMutation<
    ReceivableSendResponse,
    ApiError,
    {
      receivableId: string;
      body: ReceivableSendRequest;
    }
  >({
    mutationFn: ({ receivableId, body }) =>
      monite.api.receivable.send(receivableId, body),

    onSuccess: () => {
      invalidate();

      toast.success(t(i18n)`Sent`);
    },

    onError: (error) => {
      toast.error(error.body.error.message || error.message);
    },
  });
};

export const usePDFReceivableByIdMutation = (
  receivableId: string,
  options?: {
    onSuccess?: (data: ReceivableFileUrl) => void;
  }
) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();

  return useMutation<ReceivableFileUrl, ApiError>({
    mutationKey: receivablesQueryKeys.pdf(receivableId),

    mutationFn: () => monite.api.receivable.getPdfLink(receivableId),

    retry: false,

    onSuccess: (response) => {
      toast.success(t(i18n)`PDF was generated`);

      options?.onSuccess?.(response);
    },
  });
};

export const usePDFReceivableById = (
  receivableId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  const { monite } = useMoniteContext();

  return useQuery<ReceivableFileUrl, ApiError>({
    queryKey: receivablesQueryKeys.pdf(receivableId),

    queryFn: () => monite.api.receivable.getPdfLink(receivableId),

    enabled: options?.enabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 0,
    refetchIntervalInBackground: false,
    staleTime: 0,
    retry: false,
  });
};

export enum InvoiceDetailsPermissions {
  Cancel = 'cancel',
  Delete = 'delete',
  Issue = 'issue',
  MarkAsUncollectible = 'mark_as_uncollectible',
}

type IUseInvoiceDetailsProps = {
  id: string;
} & Pick<
  ExistingReceivableDetailsProps,
  'onIssue' | 'onDelete' | 'onCancel' | 'onMarkAsUncollectible'
>;

interface IReceivableDetailsResult {
  permissions: Array<InvoiceDetailsPermissions>;
  receivable: ReceivableResponse | undefined;

  isInitialLoading: boolean;

  /**
   * `isButtonsLoading` means that some mutation
   *  (issue action, cancel action, etc)
   *  is on the fly and we have no ability to call any other action
   */
  isButtonsLoading: boolean;
  error: ApiError | null;

  actions: {
    issueInvoice: () => Promise<void>;
    deleteInvoice: () => Promise<void>;
    cancelInvoice: () => Promise<void>;
    markAsUncollectibleInvoice: () => Promise<void>;
  };
}

export function useInvoiceDetails({
  id,
  onCancel,
  onIssue,
  onMarkAsUncollectible,
  onDelete,
}: IUseInvoiceDetailsProps): IReceivableDetailsResult {
  const { data: receivable, isInitialLoading, error } = useReceivableById(id);
  const [permissions, setPermissions] = useState<
    Array<InvoiceDetailsPermissions>
  >([]);
  const [isPermissionsLoading, setIsPermissionsLoading] =
    useState<boolean>(true);
  const [isButtonsLoading, setIsButtonsLoading] = useState<boolean>(true);

  const issueMutation = useIssueReceivableById();
  const deleteMutation = useDeleteReceivableById();
  const cancelMutation = useCancelReceivableById();
  const markAsUncollectibleMutation = useMarkAsUncollectibleReceivableById();

  const status = receivable?.status as ReceivablesStatusEnum | undefined;
  const type = receivable?.type;

  useEffect(() => {
    if (!status || !type) {
      if (!isInitialLoading) {
        setIsPermissionsLoading(false);
      }

      return;
    }

    setPermissions([]);
    setIsPermissionsLoading(true);

    switch (status) {
      case ReceivablesStatusEnum.DRAFT: {
        setPermissions([
          InvoiceDetailsPermissions.Delete,
          InvoiceDetailsPermissions.Issue,
        ]);

        break;
      }

      case ReceivablesStatusEnum.ISSUED: {
        /**
         * We can cancel only `Invoice` type of `Receivable`.
         * It's not possible for `Quote` or `CreditNote` types
         */
        if (type === InvoiceResponsePayload.type.INVOICE) {
          setPermissions([InvoiceDetailsPermissions.Cancel]);
        }

        break;
      }

      case ReceivablesStatusEnum.OVERDUE: {
        setPermissions([
          InvoiceDetailsPermissions.Cancel,
          InvoiceDetailsPermissions.MarkAsUncollectible,
        ]);

        break;
      }

      case ReceivablesStatusEnum.ACCEPTED:
      case ReceivablesStatusEnum.EXPIRED:
      case ReceivablesStatusEnum.DECLINED:
      case ReceivablesStatusEnum.RECURRING:
      case ReceivablesStatusEnum.PARTIALLY_PAID:
      case ReceivablesStatusEnum.PAID:
      case ReceivablesStatusEnum.UNCOLLECTIBLE:
      case ReceivablesStatusEnum.CANCELED:
      case ReceivablesStatusEnum.DELETED: {
        setPermissions([]);

        break;
      }

      default:
        exhaustiveMatchingGuard(status);
    }

    setIsPermissionsLoading(false);
  }, [isInitialLoading, status, type]);

  useEffect(() => {
    setIsButtonsLoading(
      issueMutation.isPending ||
        deleteMutation.isPending ||
        cancelMutation.isPending ||
        markAsUncollectibleMutation.isPending
    );
  }, [
    cancelMutation.isPending,
    deleteMutation.isPending,
    issueMutation.isPending,
    markAsUncollectibleMutation.isPending,
  ]);

  const issueInvoice = useCallback(async () => {
    await issueMutation.mutateAsync(id);

    onIssue?.(id);
  }, [issueMutation, id, onIssue]);

  const deleteInvoice = useCallback(async () => {
    await deleteMutation.mutateAsync(id);

    onDelete?.(id);
  }, [deleteMutation, id, onDelete]);

  const cancelInvoice = useCallback(async () => {
    await cancelMutation.mutateAsync(id);

    onCancel?.(id);
  }, [cancelMutation, id, onCancel]);

  const markAsUncollectibleInvoice = useCallback(async () => {
    await markAsUncollectibleMutation.mutateAsync(id);

    onMarkAsUncollectible?.(id);
  }, [markAsUncollectibleMutation, id, onMarkAsUncollectible]);

  return {
    permissions,
    receivable,
    isInitialLoading:
      isInitialLoading || isButtonsLoading || isPermissionsLoading,
    isButtonsLoading,
    error,
    actions: {
      issueInvoice,
      deleteInvoice,
      cancelInvoice,
      markAsUncollectibleInvoice,
    },
  };
}
