import { useCallback } from 'react';

import { components } from '@/api';
import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { useDeleteCounterpartBank } from '@/core/queries/useCounterpart';

export type CounterpartBankViewProps = {
  bank: components['schemas']['CounterpartBankAccountResponse'];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  permissions: CounterpartActionsPermissions;
};

export function useCounterpartBankView({
  onDelete,
  onEdit: onExternalEdit,
  bank: { id, counterpart_id },
}: CounterpartBankViewProps) {
  const bankDeleteMutation = useDeleteCounterpartBank(counterpart_id);

  const deleteBank = useCallback(
    async (cb?: () => void) => {
      const bankDeleteMutateAsync = bankDeleteMutation.mutateAsync;

      return await bankDeleteMutateAsync(
        {
          path: {
            counterpart_id: counterpart_id,
            bank_account_id: id,
          },
          body: undefined,
        },
        {
          onSuccess: () => {
            onDelete && onDelete(id);
            cb?.();
          },
        }
      );
    },
    [bankDeleteMutation.mutateAsync, counterpart_id, id, onDelete]
  );

  const onEdit = useCallback(async () => {
    onExternalEdit && onExternalEdit(id);
  }, [id, onExternalEdit]);

  return {
    deleteBank,
    onEdit,
    isLoading: bankDeleteMutation.isPending,
  };
}
