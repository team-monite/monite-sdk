import { useCallback } from 'react';

import {
  useCounterpartBankList,
  useCounterpartById,
  useCounterpartContactList,
  useDeleteCounterpartBank,
  useDeleteCounterpartContact,
} from 'core/queries/useCounterpart';
import { CounterpartType } from '@monite/sdk-api';

export type CounterpartViewProps = {
  id: string;
  onClose?: () => void;
  onEdit: (type: CounterpartType) => void;
  onDelete?: () => void;

  onContactCreate: () => void;
  onContactEdit: (id: string) => void;
  onContactDelete?: () => void;

  onBankCreate: () => void;
  onBankEdit: (id: string) => void;
  onBankDelete?: () => void;
};

export default function useCounterpartView({
  id,
  onBankDelete,
  onContactDelete,
}: CounterpartViewProps) {
  const { data: counterpart } = useCounterpartById(id);
  const { data: contacts } = useCounterpartContactList(id);
  const { data: banks } = useCounterpartBankList(id);

  const contactDeleteMutation = useDeleteCounterpartContact(id);
  const bankDeleteMutation = useDeleteCounterpartBank(id);

  const deleteContact = useCallback(async () => {
    return await contactDeleteMutation.mutateAsync(id, {
      onSuccess: () => {
        onContactDelete && onContactDelete();
      },
    });
  }, [contactDeleteMutation]);

  const deleteBank = useCallback(async () => {
    return await bankDeleteMutation.mutateAsync(id, {
      onSuccess: () => {
        onBankDelete && onBankDelete();
      },
    });
  }, [bankDeleteMutation]);

  return {
    contacts,
    banks,
    counterpart,
    deleteBank,
    deleteContact,
  };
}
