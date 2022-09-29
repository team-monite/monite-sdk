import { useCallback } from 'react';

import { useDeleteCounterpartContact } from 'core/queries/useCounterpart';
import { CounterpartContactResponse } from '@monite/sdk-api';

export type CounterpartContactViewProps = {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  contact: CounterpartContactResponse;
};

export function useCounterpartContactView({
  onDelete,
  onEdit: onExternalEdit,
  contact: { id, counterpart_id },
}: CounterpartContactViewProps) {
  const contactDeleteMutation = useDeleteCounterpartContact(counterpart_id);

  const deleteContact = useCallback(async () => {
    return await contactDeleteMutation.mutateAsync(id, {
      onSuccess: () => {
        onDelete && onDelete(id);
      },
    });
  }, [contactDeleteMutation, onDelete]);

  const onEdit = useCallback(async () => {
    onExternalEdit && onExternalEdit(id);
  }, [onExternalEdit]);

  return {
    deleteContact,
    onEdit,
    isLoading: contactDeleteMutation.isLoading,
  };
}
