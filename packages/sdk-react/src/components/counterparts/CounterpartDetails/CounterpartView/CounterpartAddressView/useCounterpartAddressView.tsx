'use client';

import { useCallback } from 'react';

import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { CounterpartAddressResponseWithCounterpartID } from '@monite/sdk-api';

export interface CounterpartAddressViewProps {
  address: CounterpartAddressResponseWithCounterpartID;
  onEdit?: (id: string) => void;
  permissions: CounterpartActionsPermissions;
}

export function useCounterpartAddressView({
  address,
  onEdit: onExternalEdit,
}: CounterpartAddressViewProps) {
  const onEdit = useCallback(async () => {
    onExternalEdit && onExternalEdit(address.id);
  }, [address.id, onExternalEdit]);

  return {
    onEdit,
  };
}
