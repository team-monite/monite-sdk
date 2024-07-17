import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

import type { Services } from '@/api';
import { ExistingReceivableDetailsProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { isInvoice } from '@/components/receivables/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t, select } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useReceivables = (
  query: Services['receivables']['getReceivables']['types']['parameters']['query']
) => {
  const { api } = useMoniteContext();

  return api.receivables.getReceivables.useQuery({
    query,
  });
};

export const useCreateReceivable = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivables.useMutation(
    {},
    {
      onSuccess: async (receivable) => {
        await api.receivables.getReceivables.invalidateQueries(queryClient);

        if (receivable.counterpart_name) {
          return toast.success(
            t(i18n)`Invoice to “${receivable.counterpart_name}” was created`
          );
        }

        toast.success(t(i18n)`${receivable.type} has been created`);
      },
    }
  );
};

/**
 * Update receivable line items
 *
 * @param receivable_id - Receivable id
 */
export const useUpdateReceivableLineItems = (receivable_id: string) => {
  const { api, queryClient } = useMoniteContext();

  return api.receivables.putReceivablesIdLineItems.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async () => {
        await api.receivables.getReceivablesId.invalidateQueries(
          {
            parameters: {
              path: {
                receivable_id,
              },
            },
          },
          queryClient
        );
      },
    }
  );
};

/**
 * Update receivable by provided `id`
 *
 * @param receivable_id - Receivable id
 */
export const useUpdateReceivable = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  const pdf = useReceivablePDFById(receivable_id);

  return api.receivables.patchReceivablesId.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async (receivable) => {
        api.receivables.getReceivablesId.setQueryData(
          {
            path: {
              receivable_id,
            },
          },
          receivable,
          queryClient
        );

        await Promise.all([
          pdf.refetch(),
          api.receivables.getReceivables.invalidateQueries(queryClient),
        ]);

        toast.success(t(i18n)`${receivable.type} has been updated`);
      },
    }
  );
};

/**
 * Fetches receivable by provided `id`
 *
 * @see {@link https://docs.monite.com/reference/get_receivables_id} Monite backend call API
 */
export const useReceivableById = (receivable_id: string) => {
  const { api } = useMoniteContext();

  return api.receivables.getReceivablesId.useQuery({
    path: {
      receivable_id,
    },
  });
};

/**
 * Marks receivable as issued by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_issue} Monite backend call API
 */
export const useIssueReceivableById = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivablesIdIssue.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async (receivable) => {
        api.receivables.getReceivablesId.setQueryData(
          {
            path: {
              receivable_id,
            },
          },
          receivable,
          queryClient
        );

        await Promise.all([
          api.receivables.getReceivables.invalidateQueries(queryClient),
          api.receivables.getReceivablesIdPdfLink.resetQueries(
            {
              parameters: {
                path: {
                  receivable_id,
                },
              },
            },
            queryClient
          ),
        ]);

        toast.success(t(i18n)`${receivable.type} has been issued`);
      },
    }
  );
};

/**
 * Marks receivable as deleted by provided id
 *
 * @see {@link https://docs.monite.com/reference/delete_receivables_id} Monite backend call API
 */
export const useDeleteReceivableById = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.deleteReceivablesId.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: () => {
        const previousReceivable =
          api.receivables.getReceivablesId.getQueryData(
            {
              path: {
                receivable_id,
              },
            },
            queryClient
          );

        if (previousReceivable)
          api.receivables.getReceivablesId.setQueryData(
            {
              path: {
                receivable_id,
              },
            },
            { ...previousReceivable, status: 'deleted' },
            queryClient
          );

        t(i18n)({
          message: select(previousReceivable?.type ?? '', {
            credit_note: 'Credit Note has been deleted',
            invoice: 'Invoice has been deleted',
            quote: 'Quote has been deleted',
            other: 'Receivable has been deleted',
          }),
        });
      },
    }
  );
};

/**
 * Marks receivable as canceled by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_cancel} Monite backend call API
 */
export const useCancelReceivableById = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivablesIdCancel.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async () => {
        const receivable = api.receivables.getReceivablesId.getQueryData(
          {
            path: {
              receivable_id,
            },
          },
          queryClient
        );

        if (!receivable || !isInvoice(receivable)) return;

        api.receivables.getReceivablesId.setQueryData(
          {
            path: {
              receivable_id,
            },
          },
          { ...receivable, status: 'canceled' },
          queryClient
        );

        await api.receivables.getReceivables.invalidateQueries(queryClient);

        toast.success(t(i18n)`${receivable.type} has been canceled`);
      },
    }
  );
};

/**
 * Marks receivable as uncollectible by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_mark_as_uncollectible} Monite backend call API
 */
export const useMarkAsUncollectibleReceivableById = (receivable_id: string) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  return api.receivables.postReceivablesIdMarkAsUncollectible.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async (receivable) => {
        api.receivables.getReceivablesId.setQueryData(
          {
            path: {
              receivable_id,
            },
          },
          receivable,
          queryClient
        );

        await api.receivables.getReceivables.invalidateQueries(queryClient);

        toast.success(t(i18n)`Marked as uncollectible`);
      },
    }
  );
};

/**
 * Issue a receivable and send PDF with an email
 *  to the counterpart
 */
export const useSendReceivableById = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivablesIdSend.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async () => {
        const receivable = api.receivables.getReceivablesId.getQueryData(
          {
            path: {
              receivable_id,
            },
          },
          queryClient
        );

        await api.receivables.getReceivables.invalidateQueries(queryClient);

        if (!receivable) return;

        toast.success(t(i18n)`${receivable.type} has been sent`);
      },
    }
  );
};

export const useReceivablePDFById = (receivable_id: string) => {
  const { api } = useMoniteContext();

  return api.receivables.getReceivablesIdPdfLink.useQuery(
    {
      path: {
        receivable_id,
      },
    },
    { refetchInterval: 15_000 }
  );
};

export type InvoiceDetailsPermissions =
  | 'cancel'
  | 'delete'
  | 'issue'
  | 'mark_as_uncollectible';

type IUseInvoiceDetailsProps = {
  id: string;
} & Pick<
  ExistingReceivableDetailsProps,
  'onIssue' | 'onDelete' | 'onCancel' | 'onMarkAsUncollectible'
>;

export function useInvoiceDetails({
  id,
  onCancel,
  onIssue,
  onMarkAsUncollectible,
  onDelete,
}: IUseInvoiceDetailsProps) {
  const { data: receivable, isLoading, error } = useReceivableById(id);

  const [permissions, setPermissions] = useState<
    Array<InvoiceDetailsPermissions>
  >([]);

  const [isPermissionsLoading, setIsPermissionsLoading] =
    useState<boolean>(true);

  const [isButtonsLoading, setIsButtonsLoading] = useState<boolean>(true);

  const issueMutation = useIssueReceivableById(id);
  const deleteMutation = useDeleteReceivableById(id);
  const cancelMutation = useCancelReceivableById(id);
  const markAsUncollectibleMutation = useMarkAsUncollectibleReceivableById(id);

  const status = receivable?.status;
  const type = receivable?.type;

  useEffect(() => {
    if (!status || !type) {
      if (!isLoading) {
        setIsPermissionsLoading(false);
      }

      return;
    }

    setPermissions([]);
    setIsPermissionsLoading(true);

    switch (status) {
      case 'draft': {
        setPermissions(['delete', 'issue']);

        break;
      }

      case 'issued': {
        /**
         * We can cancel only `Invoice` type of `Receivable`.
         * It's not possible for `Quote` or `CreditNote` types
         */
        if (type === 'invoice') {
          setPermissions(['cancel']);
        }

        break;
      }

      case 'overdue': {
        setPermissions(['cancel', 'mark_as_uncollectible']);

        break;
      }

      default: {
        setPermissions([]);
        break;
      }
    }

    setIsPermissionsLoading(false);
  }, [isLoading, status, type]);

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
    await issueMutation.mutateAsync(undefined);

    onIssue?.(id);
  }, [issueMutation, id, onIssue]);

  const deleteInvoice = useCallback(async () => {
    await deleteMutation.mutateAsync(undefined);

    onDelete?.(id);
  }, [deleteMutation, id, onDelete]);

  const cancelInvoice = useCallback(async () => {
    await cancelMutation.mutateAsync(undefined);

    onCancel?.(id);
  }, [cancelMutation, id, onCancel]);

  const markAsUncollectibleInvoice = useCallback(async () => {
    await markAsUncollectibleMutation.mutateAsync({
      // TODO provide a comment
      comment: '',
    });

    onMarkAsUncollectible?.(id);
  }, [markAsUncollectibleMutation, id, onMarkAsUncollectible]);

  return {
    permissions,
    receivable,
    isLoading: isLoading || isButtonsLoading || isPermissionsLoading,
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
