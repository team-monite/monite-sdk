import { useCallback } from 'react';

import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { components } from '@monite/sdk-api/src/api';

export interface CounterpartAddressViewProps {
  address: components['schemas']['CounterpartAddressResponseWithCounterpartID'];
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
