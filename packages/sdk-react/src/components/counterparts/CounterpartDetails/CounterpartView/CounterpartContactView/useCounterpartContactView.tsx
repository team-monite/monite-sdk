import { useCallback } from 'react';

import { components } from '@/api';
import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { useDeleteCounterpartContact } from '@/core/queries/useCounterpart';

export type CounterpartContactViewProps = {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  contact: components['schemas']['CounterpartContactResponse'];
  permissions: CounterpartActionsPermissions;
};

export function useCounterpartContactView({
  onDelete,
  onEdit: onExternalEdit,
  contact: { id, counterpart_id },
}: CounterpartContactViewProps) {
  const contactDeleteMutation = useDeleteCounterpartContact();

  const deleteContact = useCallback(async () => {
    const contactDeleteMutateAsync = contactDeleteMutation.mutateAsync;

    return await contactDeleteMutateAsync(
      {
        path: { counterpart_id: counterpart_id, contact_id: id },
      },
      {
        onSuccess: () => {
          onDelete && onDelete(id);
        },
      }
    );
  }, [contactDeleteMutation.mutateAsync, counterpart_id, id, onDelete]);

  const onEdit = useCallback(() => {
    onExternalEdit && onExternalEdit(id);
  }, [id, onExternalEdit]);

  return {
    deleteContact,
    onEdit,
    isLoading: contactDeleteMutation.isPending,
  };
}
