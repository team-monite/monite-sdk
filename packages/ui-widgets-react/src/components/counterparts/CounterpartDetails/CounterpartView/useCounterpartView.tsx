import { useCallback } from 'react';

import { CounterpartType } from '@team-monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';
import {
  useCounterpartBankList,
  useCounterpartById,
  useCounterpartContactList,
  useDeleteCounterpart,
} from 'core/queries/useCounterpart';
import { getCounterpartName } from '../../helpers';

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
  const { t } = useComponentsContext();

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

  const deleteCounterpart = useCallback(() => {
    if (!counterpart) return;

    return counterpartDeleteMutation.mutate(counterpart.id, {
      onSuccess: () => {
        onDelete && onDelete(counterpart.id);
      },
    });
  }, [counterpartDeleteMutation, counterpart, onDelete]);

  const onEdit = useCallback(() => {
    if (!counterpart) return;

    onExternalEdit && onExternalEdit(counterpart.id, counterpart.type);
  }, [onExternalEdit, counterpart]);

  const isLoading =
    isBanksLoading ||
    isCounterpartLoading ||
    isContactsLoading ||
    counterpartDeleteMutation.isLoading;

  const getTitle = useCallback((): string => {
    if (isLoading) return t('counterparts:actions.loading');
    if (counterpartError) return counterpartError.message;
    if (counterpart) return getCounterpartName(counterpart);
    return '';
  }, [t, isLoading, counterpart, counterpartError]);

  return {
    contacts: contacts || [],
    banks: banks || [],
    counterpart,
    deleteCounterpart,
    onEdit,
    isLoading,
    getTitle,
  };
}
