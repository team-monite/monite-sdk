import { useCallback } from 'react';

import { CounterpartType } from '@monite/sdk-api';

import {
  useCounterpartBankList,
  useCounterpartById,
  useCounterpartContactList,
  useDeleteCounterpart,
  useDeleteCounterpartBank,
  useDeleteCounterpartContact,
} from 'core/queries/useCounterpart';

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
  onDelete,
  onBankDelete,
  onContactDelete,
}: CounterpartViewProps) {
  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(id);

  const { data: contacts, isLoading: isContactsLoading } =
    useCounterpartContactList(id);

  const { data: banks, isLoading: isBanksLoading } = useCounterpartBankList(id);

  const counterpartDeleteMutation = useDeleteCounterpart();
  const contactDeleteMutation = useDeleteCounterpartContact(id);
  const bankDeleteMutation = useDeleteCounterpartBank(id);

  const deleteCounterpart = useCallback(async () => {
    if (!counterpart) return;

    return await counterpartDeleteMutation.mutateAsync(counterpart, {
      onSuccess: () => {
        onDelete && onDelete();
      },
    });
  }, [counterpartDeleteMutation, counterpart]);

  const deleteContact = useCallback(
    async (contactId: string) => {
      return await contactDeleteMutation.mutateAsync(contactId, {
        onSuccess: () => {
          onContactDelete && onContactDelete();
        },
      });
    },
    [contactDeleteMutation]
  );

  const deleteBank = useCallback(
    async (bankId: string) => {
      return await bankDeleteMutation.mutateAsync(bankId, {
        onSuccess: () => {
          onBankDelete && onBankDelete();
        },
      });
    },
    [bankDeleteMutation]
  );

  return {
    contacts,
    banks,
    counterpart,
    deleteCounterpart,
    deleteBank,
    deleteContact,
    isLoading:
      isBanksLoading ||
      isCounterpartLoading ||
      isContactsLoading ||
      counterpartDeleteMutation.isLoading ||
      bankDeleteMutation.isLoading ||
      contactDeleteMutation.isLoading,
  };
}
