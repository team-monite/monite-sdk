import { useCallback } from 'react';

import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { useDeleteCounterpartContact } from '@/core/queries/useCounterpart';
import { CounterpartContactResponse } from '@monite/sdk-api';

export type CounterpartContactViewProps = {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  contact: CounterpartContactResponse;
  permissions: CounterpartActionsPermissions;
};

export function useCounterpartContactView({
  onDelete,
  onEdit: onExternalEdit,
  contact: { id, counterpart_id },
}: CounterpartContactViewProps) {
  const contactDeleteMutation = useDeleteCounterpartContact(counterpart_id);

  const deleteContact = useCallback(async () => {
    const contactDeleteMutateAsync = contactDeleteMutation.mutateAsync;
    return await contactDeleteMutateAsync(id, {
      onSuccess: () => {
        onDelete && onDelete(id);
      },
    });
  }, [contactDeleteMutation.mutateAsync, id, onDelete]);

  const onEdit = useCallback(() => {
    onExternalEdit && onExternalEdit(id);
  }, [id, onExternalEdit]);

  return {
    deleteContact,
    onEdit,
    isLoading: contactDeleteMutation.isPending,
  };
}
