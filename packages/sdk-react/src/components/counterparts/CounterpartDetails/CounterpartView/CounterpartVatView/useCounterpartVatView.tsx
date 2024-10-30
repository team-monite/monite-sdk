import { useCallback } from 'react';

import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { useDeleteCounterpartVat } from '@/core/queries/useCounterpart';
import { components } from '@monite/sdk-api/src/api';

export type CounterpartVatViewProps = {
  vat: components['schemas']['CounterpartVatIDResponse'];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  permissions: CounterpartActionsPermissions;
};

export function useCounterpartVatView({
  onDelete,
  onEdit: onExternalEdit,
  vat: { id, counterpart_id },
}: CounterpartVatViewProps) {
  const vatDeleteMutation = useDeleteCounterpartVat(counterpart_id);

  const deleteVat = useCallback(
    async (cb?: () => void) => {
      const vatDeleteMutateAsync = vatDeleteMutation.mutateAsync;

      return await vatDeleteMutateAsync(
        {
          path: {
            counterpart_id: counterpart_id,
            vat_id: id,
          },
        },
        {
          onSuccess: () => {
            onDelete && onDelete(id);
            cb?.();
          },
        }
      );
    },
    [vatDeleteMutation.mutateAsync, counterpart_id, id, onDelete]
  );

  const onEdit = useCallback(async () => {
    onExternalEdit && onExternalEdit(id);
  }, [id, onExternalEdit]);

  return {
    deleteVat,
    onEdit,
    isLoading: vatDeleteMutation.isPending,
  };
}
