import { useCallback } from 'react';

import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { useDeleteCounterpartBank } from '@/core/queries/useCounterpart';
import { CounterpartBankAccountResponse } from '@monite/sdk-api';

export type CounterpartBankViewProps = {
  bank: CounterpartBankAccountResponse;
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

      return await bankDeleteMutateAsync(id, {
        onSuccess: () => {
          onDelete && onDelete(id);
          cb?.();
        },
      });
    },
    [bankDeleteMutation.mutateAsync, id, onDelete]
  );

  const onEdit = useCallback(async () => {
    onExternalEdit && onExternalEdit(id);
  }, [id, onExternalEdit]);

  return {
    deleteBank,
    onEdit,
    isLoading: bankDeleteMutation.isLoading,
  };
}
