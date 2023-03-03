import { useCallback } from 'react';
import { CounterpartAddressResponseWithCounterpartID } from '@team-monite/sdk-api';

export interface CounterpartAddressViewProps {
  address: CounterpartAddressResponseWithCounterpartID;
  onEdit?: (id: string) => void;
}

export default function useCounterpartAddressView({
  address,
  onEdit: onExternalEdit,
}: CounterpartAddressViewProps) {
  const onEdit = useCallback(async () => {
    onExternalEdit && onExternalEdit(address.id);
  }, [onExternalEdit]);

  return {
    onEdit,
  };
}
