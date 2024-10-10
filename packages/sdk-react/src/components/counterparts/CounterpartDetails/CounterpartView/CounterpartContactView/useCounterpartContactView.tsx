import { useCallback } from 'react';

import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import {
  GenericCounterpartContact,
  useDeleteCounterpartContact,
} from '@/core/queries/useCounterpart';

export type CounterpartContactViewProps = {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  contact: GenericCounterpartContact;
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
