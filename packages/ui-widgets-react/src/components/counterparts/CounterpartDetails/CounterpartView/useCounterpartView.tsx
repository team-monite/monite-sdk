import { useCallback } from 'react';

import { CounterpartType } from '@monite/sdk-api';

import {
  useCounterpartBankList,
  useCounterpartById,
  useCounterpartContactList,
  useDeleteCounterpart,
} from 'core/queries/useCounterpart';

export type CounterpartViewProps = {
  id: string;
  onClose?: () => void;
  onEdit?: (id: string, type: CounterpartType) => void;
  onDelete?: (id: string) => void;

  onContactCreate?: () => void;
  onContactEdit?: (id: string) => void;
  onContactDelete?: (id: string) => void;

  onBankCreate?: () => void;
  onBankEdit?: (id: string) => void;
  onBankDelete?: (id: string) => void;
};

export default function useCounterpartView({
  id,
  onDelete,
  onEdit: onExternalEdit,
}: CounterpartViewProps) {
  const {
    data: counterpart,
    isLoading: isCounterpartLoading,
    error: counterpartError,
  } = useCounterpartById(id);

  const { data: contacts, isLoading: isContactsLoading } =
    useCounterpartContactList(
      counterpart?.type === CounterpartType.ORGANIZATION
        ? counterpart?.id
        : undefined
    );

  const { data: banks, isLoading: isBanksLoading } = useCounterpartBankList(
    counterpart?.id
  );

  const counterpartDeleteMutation = useDeleteCounterpart();

  const deleteCounterpart = useCallback(async () => {
    if (!counterpart) return;

    return await counterpartDeleteMutation.mutateAsync(counterpart, {
      onSuccess: () => {
        onDelete && onDelete(counterpart.id);
      },
    });
  }, [counterpartDeleteMutation, counterpart]);

  const onEdit = useCallback(async () => {
    if (!counterpart) return;

    onExternalEdit && onExternalEdit(counterpart.id, counterpart.type);
  }, [onExternalEdit, counterpart]);

  return {
    contacts,
    banks,
    counterpart,
    deleteCounterpart,
    counterpartError,
    onEdit,
    isLoading:
      isBanksLoading ||
      isCounterpartLoading ||
      isContactsLoading ||
      counterpartDeleteMutation.isLoading,
  };
}
