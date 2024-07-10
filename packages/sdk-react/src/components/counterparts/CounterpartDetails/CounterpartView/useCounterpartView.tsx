import { useCallback, useMemo } from 'react';

import { components } from '@/api';
import type { CounterpartShowCategories } from '@/components/counterparts/Counterpart.types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  useCounterpartAddresses,
  useCounterpartById,
  useCounterpartContactList,
  useCounterpartVatList,
  useDeleteCounterpart,
} from '@/core/queries/useCounterpart';
import { getLegacyAPIErrorMessage } from '@/core/utils/getLegacyAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';

import { getCounterpartName } from '../../helpers';

export type CounterpartViewProps = {
  id: string;
  showBankAccounts?: boolean;
  onEdit?: (id: string, type: components['schemas']['CounterpartType']) => void;
  onDelete?: (id: string) => void;

  onAddressEdit?: (id: string) => void;

  onContactCreate?: () => void;
  onContactEdit?: (id: string) => void;
  onContactDelete?: (id: string) => void;

  onBankCreate?: () => void;
  onBankEdit?: (id: string) => void;
  onBankDelete?: (id: string) => void;

  onVatCreate?: () => void;
  onVatEdit?: (id: string) => void;
  onVatDelete?: (id: string) => void;
} & Partial<CounterpartShowCategories>;

export function useCounterpartView({
  id,
  onDelete,
  onEdit: onExternalEdit,
}: CounterpartViewProps) {
  const { i18n } = useLingui();
  const {
    data: counterpart,
    isLoading: isCounterpartLoading,
    error: counterpartError,
  } = useCounterpartById(id);

  const { data: addresses, isLoading: isAddressesLoading } =
    useCounterpartAddresses(counterpart?.id);

  const { data: contacts, isLoading: isContactsLoading } =
    useCounterpartContactList(
      counterpart?.type === 'organization' ? counterpart?.id : undefined
    );

  const { data: vats, isLoading: isVatsLoading } = useCounterpartVatList(
    counterpart?.id
  );

  const { api } = useMoniteContext();

  const { data: banks, isLoading: isBanksLoading } =
    api.counterparts.getCounterpartsIdBankAccounts.useQuery({
      path: {
        counterpart_id: counterpart?.id || '',
      },
    });

  const { mutate: deleteMutate, isPending: isCounterpartDeleteLoading } =
    useDeleteCounterpart();

  const deleteCounterpart = useCallback(
    (cb?: () => void) => {
      if (!counterpart) return;

      return deleteMutate(
        {
          body: undefined,
          path: {
            counterpart_id: counterpart.id,
          },
        },
        {
          onSuccess: () => {
            onDelete?.(counterpart.id);
            cb?.();
          },
        }
      );
    },
    [deleteMutate, counterpart, onDelete]
  );

  const onEdit = useCallback(() => {
    if (!counterpart) return;

    onExternalEdit && onExternalEdit(counterpart.id, counterpart.type);
  }, [onExternalEdit, counterpart]);

  const isLoading =
    isAddressesLoading ||
    isBanksLoading ||
    isCounterpartLoading ||
    isContactsLoading ||
    isVatsLoading ||
    isCounterpartDeleteLoading;

  const title = useMemo((): string => {
    if (isLoading) return t(i18n)`Loading...`;
    if (counterpartError)
      return getLegacyAPIErrorMessage(counterpartError) as string;
    if (counterpart) return getCounterpartName(counterpart);
    return '';
  }, [isLoading, i18n, counterpartError, counterpart]);

  return {
    addresses: addresses || [],
    contacts: contacts || [],
    banks: banks?.data || [],
    vats: vats?.data || [],
    counterpart,
    deleteCounterpart,
    onEdit,
    isLoading,
    title,
  };
}
