import { useCallback } from 'react';

import { useDeleteCounterpartBank } from 'core/queries/useCounterpart';
import { CounterpartBankAccountResponse } from '@monite/sdk-api';

export type CounterpartBankViewProps = {
  bank: CounterpartBankAccountResponse;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function useCounterpartBankView({
  onDelete,
  onEdit: onExternalEdit,
  bank: { id, counterpart_id },
}: CounterpartBankViewProps) {
  const bankDeleteMutation = useDeleteCounterpartBank(counterpart_id);

  const deleteBank = useCallback(async () => {
    return await bankDeleteMutation.mutateAsync(id, {
      onSuccess: () => {
        onDelete && onDelete(id);
      },
    });
  }, [bankDeleteMutation, onDelete]);

  const onEdit = useCallback(async () => {
    onExternalEdit && onExternalEdit(id);
  }, [onExternalEdit]);

  return {
    deleteBank,
    onEdit,
    isLoading: bankDeleteMutation.isLoading,
  };
}
